"""
Integration tests for complete order flow.
Tests: create order -> payment -> status transitions -> invoice
"""
import pytest
from sqlalchemy.orm import Session

from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.product import Product
from app.schemas.order import CreateOrderRequest, OrderItemRequest


@pytest.mark.usefixtures("db_session")
class TestOrderFlow:
    """Test complete order lifecycle."""
    
    def test_create_order_with_products(self, auth_client, db_session: Session):
        """Test creating an order with standard products."""
        # Create a test product
        product = Product(
            name="Test Banner",
            category="banner",
            base_price=500.0,
            is_active=True,
        )
        db_session.add(product)
        db_session.commit()
        db_session.refresh(product)
        
        # Create order
        response = auth_client.post(
            "/orders",
            json={
                "items": [
                    {
                        "product_id": product.id,
                        "quantity": 2,
                    }
                ]
            },
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == OrderStatus.placed.value
        assert data["payment_status"] == PaymentStatus.pending.value
        assert float(data["total_price"]) == 1000.0  # 500 * 2
        
        # Verify order in database
        order = db_session.query(Order).filter(Order.id == data["id"]).first()
        assert order is not None
        assert len(order.items) == 1
        assert order.items[0].quantity == 2
    
    def test_create_order_with_custom_signage(self, auth_client, db_session: Session):
        """Test creating an order with custom signage (pricing engine)."""
        response = auth_client.post(
            "/orders",
            json={
                "items": [
                    {
                        "width_ft": 10.0,
                        "height_ft": 5.0,
                        "material": "flex",
                        "quantity": 1,
                        "lamination": True,
                        "frame": False,
                    }
                ]
            },
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == OrderStatus.placed.value
        assert float(data["total_price"]) > 0
    
    def test_get_user_orders(self, auth_client, db_session: Session):
        """Test retrieving user's orders."""
        # Create an order first
        product = Product(
            name="Test Product",
            category="banner",
            base_price=100.0,
            is_active=True,
        )
        db_session.add(product)
        db_session.commit()
        
        auth_client.post(
            "/orders",
            json={
                "items": [{"product_id": product.id, "quantity": 1}]
            },
        )
        
        # Get orders
        response = auth_client.get("/orders")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["status"] == OrderStatus.placed.value
    
    def test_order_status_transition_validation(self, admin_client, db_session: Session):
        """Test that invalid status transitions are rejected."""
        # Create order
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=100.0,
            total_price=100.0,
        )
        db_session.add(order)
        db_session.commit()
        
        # Try invalid transition: placed -> delivered (should fail)
        response = admin_client.put(
            f"/api/v1/admin/orders/{order.id}/status",
            json={"status": "delivered", "note": "Invalid transition"},
        )
        
        assert response.status_code == 400
        assert "Invalid status transition" in response.json()["error"]
    
    def test_order_status_valid_transition(self, admin_client, db_session: Session):
        """Test valid status transition."""
        # Create order
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=100.0,
            total_price=100.0,
        )
        db_session.add(order)
        db_session.commit()
        
        # Valid transition: placed -> confirmed
        response = admin_client.put(
            f"/api/v1/admin/orders/{order.id}/status",
            json={"status": "confirmed", "note": "Order confirmed"},
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == OrderStatus.confirmed.value
        
        # Verify timeline entry was created
        db_session.refresh(order)
        assert len(order.timeline) >= 1
    
    def test_cancel_order(self, auth_client, db_session: Session):
        """Test order cancellation."""
        # Create order
        product = Product(
            name="Test Product",
            category="banner",
            base_price=100.0,
            is_active=True,
        )
        db_session.add(product)
        db_session.commit()
        
        create_response = auth_client.post(
            "/orders",
            json={
                "items": [{"product_id": product.id, "quantity": 1}]
            },
        )
        order_id = create_response.json()["id"]
        
        # Cancel order
        response = auth_client.post(f"/orders/{order_id}/cancel")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == OrderStatus.cancelled.value
    
    def test_cannot_cancel_shipped_order(self, auth_client, db_session: Session):
        """Test that shipped orders cannot be cancelled."""
        from app.models.user import User
        user = db_session.query(User).first()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.shipped,
            payment_status=PaymentStatus.paid,
            subtotal=100.0,
            total_price=100.0,
        )
        db_session.add(order)
        db_session.commit()
        
        response = auth_client.post(f"/orders/{order.id}/cancel")
        
        assert response.status_code == 400
