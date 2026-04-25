"""
Integration tests for payment flow.
Tests: create payment order -> verify payment -> webhook processing
"""
import hashlib
import hmac
import json
from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.payment import Payment, PaymentState


@pytest.mark.usefixtures("db_session")
class TestPaymentFlow:
    """Test complete payment lifecycle."""
    
    def test_create_payment_order(self, auth_client, db_session: Session):
        """Test creating a Razorpay payment order."""
        # Create an order first
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=1000.0,
            total_price=1000.0,
        )
        db_session.add(order)
        db_session.commit()
        
        # Mock Razorpay client
        with patch("app.services.payment_service.client") as mock_client:
            mock_client.order.create.return_value = {
                "id": "order_test123",
                "amount": 100000,
                "currency": "INR",
            }
            
            response = auth_client.post(
                "/payments/create",
                json={
                    "order_id": order.id,
                    "amount_percent": 100,
                },
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["razorpay_order_id"] == "order_test123"
            assert data["amount"] == 100000  # 1000 * 100 paise
            assert data["key"] == settings.RAZORPAY_KEY_ID
    
    def test_payment_idempotency(self, auth_client, db_session: Session):
        """Test that creating payment order twice returns same order."""
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=1000.0,
            total_price=1000.0,
        )
        db_session.add(order)
        db_session.commit()
        
        with patch("app.services.payment_service.client") as mock_client:
            mock_client.order.create.return_value = {
                "id": "order_test123",
                "amount": 100000,
                "currency": "INR",
            }
            
            # First call
            response1 = auth_client.post(
                "/payments/create",
                json={"order_id": order.id, "amount_percent": 100},
            )
            
            # Second call (should return same order without creating new one)
            response2 = auth_client.post(
                "/payments/create",
                json={"order_id": order.id, "amount_percent": 100},
            )
            
            assert response1.json()["razorpay_order_id"] == response2.json()["razorpay_order_id"]
            # Razorpay API should only be called once
            assert mock_client.order.create.call_count == 1
    
    def test_verify_payment_success(self, auth_client, db_session: Session):
        """Test successful payment verification."""
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=1000.0,
            total_price=1000.0,
            razorpay_order_id="order_test123",
        )
        db_session.add(order)
        
        payment = Payment(
            order_id=order.id,
            razorpay_order_id="order_test123",
            amount=1000.0,
            currency="INR",
            state=PaymentState.created,
        )
        db_session.add(payment)
        db_session.commit()
        
        # Mock Razorpay signature verification
        with patch("app.services.payment_service.client") as mock_client:
            mock_client.utility.verify_payment_signature.return_value = True
            
            response = auth_client.post(
                "/payments/verify",
                json={
                    "order_id": order.id,
                    "razorpay_order_id": "order_test123",
                    "razorpay_payment_id": "pay_test123",
                    "razorpay_signature": "valid_signature",
                },
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "paid"
            
            # Verify order status updated
            db_session.refresh(order)
            assert order.payment_status == PaymentStatus.paid
            assert order.status == OrderStatus.confirmed
            
            # Verify payment record updated
            db_session.refresh(payment)
            assert payment.state == PaymentState.captured
            assert payment.razorpay_payment_id == "pay_test123"
    
    def test_verify_payment_invalid_signature(self, auth_client, db_session: Session):
        """Test payment verification with invalid signature."""
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=1000.0,
            total_price=1000.0,
            razorpay_order_id="order_test123",
        )
        db_session.add(order)
        db_session.commit()
        
        # Mock Razorpay signature verification failure
        with patch("app.services.payment_service.client") as mock_client:
            mock_client.utility.verify_payment_signature.side_effect = Exception("Invalid signature")
            
            response = auth_client.post(
                "/payments/verify",
                json={
                    "order_id": order.id,
                    "razorpay_order_id": "order_test123",
                    "razorpay_payment_id": "pay_test123",
                    "razorpay_signature": "invalid_signature",
                },
            )
            
            assert response.status_code == 400
            assert "signature verification failed" in response.json()["error"].lower()
            
            # Verify order status updated to failed
            db_session.refresh(order)
            assert order.payment_status == PaymentStatus.failed
    
    def test_webhook_payment_captured(self, client, db_session: Session):
        """Test webhook processing for payment.captured event."""
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=1000.0,
            total_price=1000.0,
            razorpay_order_id="order_test123",
        )
        db_session.add(order)
        
        payment = Payment(
            order_id=order.id,
            razorpay_order_id="order_test123",
            amount=1000.0,
            currency="INR",
            state=PaymentState.created,
        )
        db_session.add(payment)
        db_session.commit()
        
        # Prepare webhook payload
        webhook_body = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_test123",
                        "order_id": "order_test123",
                        "amount": 100000,
                        "method": "card",
                    }
                }
            },
        }
        
        body_bytes = json.dumps(webhook_body).encode()
        signature = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body_bytes,
            hashlib.sha256,
        ).hexdigest()
        
        # Mock Razorpay order fetch
        with patch("app.services.payment_service.client") as mock_client:
            mock_client.order.fetch.return_value = {
                "id": "order_test123",
                "receipt": f"order_{order.id}",
                "amount": 100000,
            }
            
            response = client.post(
                "/payments/webhook",
                content=body_bytes,
                headers={"X-Razorpay-Signature": signature},
            )
            
            assert response.status_code == 200
            
            # Verify order updated
            db_session.refresh(order)
            assert order.payment_status == PaymentStatus.paid
            assert order.status == OrderStatus.confirmed
            
            # Verify payment updated
            db_session.refresh(payment)
            assert payment.state == PaymentState.captured
    
    def test_webhook_invalid_signature(self, client, db_session: Session):
        """Test webhook with invalid signature is rejected."""
        webhook_body = {
            "event": "payment.captured",
            "payload": {"payment": {"entity": {"id": "pay_test123"}}},
        }
        
        response = client.post(
            "/payments/webhook",
            json=webhook_body,
            headers={"X-Razorpay-Signature": "invalid_signature"},
        )
        
        assert response.status_code == 401
    
    def test_partial_payment_50_percent(self, auth_client, db_session: Session):
        """Test creating 50% advance payment."""
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=2000.0,
            total_price=2000.0,
        )
        db_session.add(order)
        db_session.commit()
        
        with patch("app.services.payment_service.client") as mock_client:
            mock_client.order.create.return_value = {
                "id": "order_test123",
                "amount": 100000,  # 1000 * 100 paise (50% of 2000)
                "currency": "INR",
            }
            
            response = auth_client.post(
                "/payments/create",
                json={
                    "order_id": order.id,
                    "amount_percent": 50,
                },
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["amount"] == 100000  # 50% of 2000
            assert data["amount_percent"] == 50
