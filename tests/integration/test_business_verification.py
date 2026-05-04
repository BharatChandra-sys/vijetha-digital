"""
Integration tests for business verification workflow.
"""
import pytest
from sqlalchemy.orm import Session

from app.models.business_profile import BusinessProfile, BusinessStatus
from app.models.user import User, UserRole, UserStatus


@pytest.mark.usefixtures("db_session")
class TestBusinessVerification:
    """Test business verification workflow."""
    
    def test_create_business_profile(self, auth_client, db_session: Session):
        """Test creating a business profile."""
        response = auth_client.post(
            "/business/profile",
            json={
                "company_name": "Test Company Ltd",
                "gst_number": "29ABCDE1234F1Z5",
                "business_type": "manufacturing",
                "address": "123 Business St",
                "city": "Hyderabad",
                "state": "Telangana",
                "pincode": "500001",
                "phone": "+91-9876543210",
            },
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["company_name"] == "Test Company Ltd"
        assert data["verification_status"] == VerificationStatus.pending.value
    
    def test_list_pending_verifications(self, admin_client, db_session: Session):
        """Test admin can list pending verifications."""
        # Create a business profile
        user = db_session.query(User).filter(User.role == UserRole.CUSTOMER).first()
        if not user:
            user = User(
                email="business@test.com",
                full_name="Business User",
                hashed_password="hashed",
                role=UserRole.CUSTOMER,
                status=UserStatus.ACTIVE,
            )
            db_session.add(user)
            db_session.commit()
        
        profile = BusinessProfile(
            user_id=user.id,
            company_name="Pending Company",
            gst_number="29ABCDE1234F1Z5",
            business_type="retail",
            address="123 St",
            city="Hyderabad",
            state="Telangana",
            pincode="500001",
            phone="+91-9876543210",
            verification_status=VerificationStatus.pending,
        )
        db_session.add(profile)
        db_session.commit()
        
        response = admin_client.get("/api/v1/admin/business/pending")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(p["company_name"] == "Pending Company" for p in data)
    
    def test_approve_business_verification(self, admin_client, db_session: Session):
        """Test admin can approve business verification."""
        user = User(
            email="approve@test.com",
            full_name="Approve User",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        profile = BusinessProfile(
            user_id=user.id,
            company_name="Approve Company",
            gst_number="29ABCDE1234F1Z5",
            business_type="retail",
            address="123 St",
            city="Hyderabad",
            state="Telangana",
            pincode="500001",
            phone="+91-9876543210",
            verification_status=VerificationStatus.pending,
        )
        db_session.add(profile)
        db_session.commit()
        
        response = admin_client.post(
            f"/api/v1/admin/business/{profile.id}/approve",
            json={
                "credit_limit": 100000.0,
                "payment_terms_days": 45,
                "discount_percentage": 10.0,
            },
        )
        
        assert response.status_code == 200
        
        # Verify profile updated
        db_session.refresh(profile)
        assert profile.verification_status == VerificationStatus.verified
        assert profile.credit_limit == 100000.0
        assert profile.payment_terms_days == 45
        assert profile.discount_percentage == 10.0
    
    def test_reject_business_verification(self, admin_client, db_session: Session):
        """Test admin can reject business verification."""
        user = User(
            email="reject@test.com",
            full_name="Reject User",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        profile = BusinessProfile(
            user_id=user.id,
            company_name="Reject Company",
            gst_number="29ABCDE1234F1Z5",
            business_type="retail",
            address="123 St",
            city="Hyderabad",
            state="Telangana",
            pincode="500001",
            phone="+91-9876543210",
            verification_status=VerificationStatus.pending,
        )
        db_session.add(profile)
        db_session.commit()
        
        response = admin_client.post(
            f"/api/v1/admin/business/{profile.id}/reject",
            json={
                "rejection_reason": "Incomplete documentation",
            },
        )
        
        assert response.status_code == 200
        
        # Verify profile updated
        db_session.refresh(profile)
        assert profile.verification_status == VerificationStatus.rejected
        assert profile.rejection_reason == "Incomplete documentation"
    
    def test_update_credit_limit(self, admin_client, db_session: Session):
        """Test admin can update credit limit for verified business."""
        user = User(
            email="credit@test.com",
            full_name="Credit User",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        profile = BusinessProfile(
            user_id=user.id,
            company_name="Credit Company",
            gst_number="29ABCDE1234F1Z5",
            business_type="retail",
            address="123 St",
            city="Hyderabad",
            state="Telangana",
            pincode="500001",
            phone="+91-9876543210",
            verification_status=VerificationStatus.verified,
            credit_limit=50000.0,
        )
        db_session.add(profile)
        db_session.commit()
        
        response = admin_client.put(
            f"/api/v1/admin/business/{profile.id}/credit-limit",
            json={"credit_limit": 150000.0},
        )
        
        assert response.status_code == 200
        
        # Verify credit limit updated
        db_session.refresh(profile)
        assert profile.credit_limit == 150000.0
    
    def test_business_discount_in_pricing(self, db_session: Session):
        """Test that verified businesses get discount in pricing."""
        from app.services.pricing_service import calculate_price
        from app.models.pricing import MaterialRate
        
        # Create material rate
        material = MaterialRate(name="flex", rate_per_sqft=50.0)
        db_session.add(material)
        
        # Create verified business user
        user = User(
            email="discount@test.com",
            full_name="Discount User",
            hashed_password="hashed",
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
        )
        db_session.add(user)
        db_session.commit()
        
        profile = BusinessProfile(
            user_id=user.id,
            company_name="Discount Company",
            gst_number="29ABCDE1234F1Z5",
            business_type="retail",
            address="123 St",
            city="Hyderabad",
            state="Telangana",
            pincode="500001",
            phone="+91-9876543210",
            verification_status=VerificationStatus.verified,
            discount_percentage=10.0,
        )
        db_session.add(profile)
        db_session.commit()
        
        # Calculate price with business discount
        price = calculate_price(
            db=db_session,
            width_ft=10.0,
            height_ft=5.0,
            material="flex",
            quantity=1,
            user_id=user.id,
        )
        
        assert price["business_discount_pct"] == 10.0
        assert price["business_discount"] > 0
        assert price["total_price"] < price["subtotal"]
