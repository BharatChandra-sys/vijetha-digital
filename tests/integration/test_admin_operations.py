"""
Integration tests for admin operations.
Tests: user management, order management, revenue reports
"""
import pytest
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.user import User, UserRole, UserStatus


@pytest.mark.usefixtures("db_session")
class TestAdminOperations:
    """Test admin-only operations."""
    
    def test_get_all_orders(self, admin_client, db_session: Session):
        """Test admin can view all orders."""
        # Create test users and orders
        user1 = User(
            email="user1@test.com",
            full_name="User One",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        user2 = User(
            email="user2@test.com",
            full_name="User Two",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add_all([user1, user2])
        db_session.commit()
        
        order1 = Order(
            user_id=user1.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            subtotal=100.0,
            tax=0.0,
            discount=0.0,
            shipping=0.0,
            total_price=100.0,
        )
        order2 = Order(
            user_id=user2.id,
            status=OrderStatus.confirmed,
            payment_status=PaymentStatus.paid,
            subtotal=200.0,
            tax=0.0,
            discount=0.0,
            shipping=0.0,
            total_price=200.0,
            paid_at=datetime.utcnow(),
        )
        db_session.add_all([order1, order2])
        db_session.commit()
        
        # Admin gets all orders
        response = admin_client.get("/api/v1/admin/orders")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
    
    def test_update_order_status_as_admin(self, admin_client, db_session: Session):
        """Test admin can update order status."""
        user = db_session.query(User).filter(User.role == UserRole.CUSTOMER).first()
        if not user:
            user = User(
                email="customer@test.com",
                full_name="Customer",
                hashed_password="hashed",
                role=UserRole.CUSTOMER,
                status=UserStatus.ACTIVE,
            )
            db_session.add(user)
            db_session.commit()
        
        order = Order(
            user_id=user.id,
            status=OrderStatus.placed,
            payment_status=PaymentStatus.pending,
            total_price=100.0,
        )
        db_session.add(order)
        db_session.commit()
        
        response = admin_client.put(
            f"/api/v1/admin/orders/{order.id}/status",
            json={"status": "confirmed", "note": "Admin confirmed"},
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == OrderStatus.confirmed.value
    
    def test_get_revenue_stats(self, admin_client, db_session: Session):
        """Test admin can view revenue statistics."""
        response = admin_client.get("/api/v1/admin/revenue/stats")
        
        assert response.status_code == 200
        data = response.json()
        assert "total_revenue" in data
        assert "total_orders" in data
        assert "paid_orders" in data
    
    def test_get_revenue_trend(self, admin_client, db_session: Session):
        """Test admin can view revenue trend."""
        response = admin_client.get("/api/v1/admin/revenue/trend?days=30")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_users(self, admin_client, db_session: Session):
        """Test admin can list all users."""
        response = admin_client.get("/api/v1/admin/users")
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
    
    def test_update_user_status(self, admin_client, db_session: Session):
        """Test admin can update user status."""
        user = User(
            email="testuser@example.com",
            full_name="Test User",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        response = admin_client.put(
            f"/api/v1/admin/users/{user.id}/status",
            json={"status": "suspended"},
        )
        
        assert response.status_code == 200
        
        # Verify status updated
        db_session.refresh(user)
        assert user.status == UserStatus.SUSPENDED
    
    def test_soft_delete_user(self, admin_client, db_session: Session):
        """Test admin can soft delete a user."""
        user = User(
            email="deleteme@example.com",
            full_name="Delete Me",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        response = admin_client.delete(f"/api/v1/admin/users/{user.id}")
        
        assert response.status_code == 200
        
        # Verify soft delete
        db_session.refresh(user)
        assert user.is_deleted is True
    
    def test_unlock_user_account(self, admin_client, db_session: Session):
        """Test admin can unlock a locked user account."""
        from datetime import datetime, timedelta
        
        user = User(
            email="locked@example.com",
            full_name="Locked User",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
            failed_login_attempts=5,
            account_locked_until=datetime.utcnow() + timedelta(minutes=30),
        )
        db_session.add(user)
        db_session.commit()
        
        response = admin_client.post(f"/api/v1/admin/users/{user.id}/unlock")
        
        assert response.status_code == 200
        
        # Verify unlock
        db_session.refresh(user)
        assert user.failed_login_attempts == 0
        assert user.account_locked_until is None
    
    def test_non_admin_cannot_access_admin_endpoints(self, auth_client):
        """Test that regular users cannot access admin endpoints."""
        response = auth_client.get("/api/v1/admin/orders")
        
        assert response.status_code == 403
    
    def test_assign_role_to_user(self, admin_client, db_session: Session):
        """Test admin can assign IAM roles to users."""
        from app.models.iam import Role
        
        # Create a test role
        role = Role(
            name="Test Manager",
            slug="test-manager",
            description="Test role",
            is_active=True,
        )
        db_session.add(role)
        
        user = User(
            email="roletest@example.com",
            full_name="Role Test",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        response = admin_client.post(
            f"/api/v1/admin/users/{user.id}/roles/{role.id}"
        )
        
        assert response.status_code == 200
        
        # Verify role assigned
        db_session.refresh(user)
        assert len(user.roles_assigned) == 1
        assert user.roles_assigned[0].id == role.id
    
    def test_revoke_role_from_user(self, admin_client, db_session: Session):
        """Test admin can revoke IAM roles from users."""
        from app.models.iam import Role
        
        role = Role(
            name="Test Role",
            slug="test-role",
            description="Test",
            is_active=True,
        )
        db_session.add(role)
        
        user = User(
            email="revoketest@example.com",
            full_name="Revoke Test",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        user.roles_assigned.append(role)
        db_session.add(user)
        db_session.commit()
        
        response = admin_client.delete(
            f"/api/v1/admin/users/{user.id}/roles/{role.id}"
        )
        
        assert response.status_code == 200
        
        # Verify role revoked
        db_session.refresh(user)
        assert len(user.roles_assigned) == 0
