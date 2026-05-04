"""
Business service for business account management and verification.
"""
from datetime import datetime
from typing import Dict, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException, ValidationException
from app.models.business_profile import BusinessProfile, BusinessStatus
from app.models.user import User
from app.tasks.email_tasks import (
    send_business_approved_email_task,
    send_business_rejected_email_task,
)


def create_business_profile(
    db: Session,
    user_id: int,
    company_name: str,
    gst_number: str,
    business_type: str,
    address: str,
    city: str,
    state: str,
    pincode: str,
    phone: str,
) -> BusinessProfile:
    """
    Create a business profile for a user.
    
    Args:
        db: Database session
        user_id: User ID
        company_name: Company name
        gst_number: GST number
        business_type: Type of business
        address: Business address
        city: City
        state: State
        pincode: Pincode
        phone: Phone number
        
    Returns:
        Created business profile
        
    Raises:
        ValidationException: If user already has a business profile
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException("User", str(user_id))
    
    # Check if business profile already exists
    existing = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == user_id
    ).first()
    if existing:
        raise ValidationException("Business profile already exists for this user")
    
    # Create business profile
    profile = BusinessProfile(
        user_id=user_id,
        company_name=company_name,
        gst_number=gst_number,
        business_type=business_type,
        address=address,
        city=city,
        state=state,
        pincode=pincode,
        phone=phone,
        status=BusinessStatus.PENDING_VERIFICATION,
    )
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return profile


def get_business_profile(db: Session, user_id: int) -> Optional[BusinessProfile]:
    """
    Get business profile for a user.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        Business profile or None
    """
    return db.query(BusinessProfile).filter(
        BusinessProfile.user_id == user_id
    ).first()


def approve_business_verification(
    db: Session,
    profile_id: int,
    admin_id: int,
    credit_limit: float = 50000.0,
    payment_terms_days: int = 30,
    discount_percentage: float = 5.0,
) -> Dict:
    """
    Approve business verification and set credit terms.
    
    Args:
        db: Database session
        profile_id: Business profile ID
        admin_id: Admin user ID performing approval
        credit_limit: Credit limit in INR
        payment_terms_days: Payment terms in days
        discount_percentage: Discount percentage
        
    Returns:
        Success message dict
        
    Raises:
        NotFoundException: If profile not found
        ValidationException: If already verified
    """
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.id == profile_id
    ).first()
    
    if not profile:
        raise NotFoundException("BusinessProfile", str(profile_id))
    
    if profile.status == BusinessStatus.VERIFIED:
        raise ValidationException("Business profile is already verified")
    
    # Update profile
    profile.status = BusinessStatus.VERIFIED
    profile.verified_at = datetime.utcnow()
    profile.verified_by = admin_id
    profile.credit_limit = credit_limit
    profile.payment_terms_days = payment_terms_days
    profile.discount_percentage = discount_percentage
    
    db.commit()
    db.refresh(profile)
    
    # Send approval email (async task)
    user = profile.user
    send_business_approved_email_task.delay(
        to_email=user.email,
        user_name=user.full_name,
        company_name=profile.company_name,
        credit_limit=credit_limit,
        payment_terms_days=payment_terms_days,
        discount_percentage=discount_percentage,
    )
    
    return {
        "message": "Business verification approved",
        "profile_id": profile.id,
        "company_name": profile.company_name,
    }


def reject_business_verification(
    db: Session,
    profile_id: int,
    admin_id: int,
    rejection_reason: str,
) -> Dict:
    """
    Reject business verification.
    
    Args:
        db: Database session
        profile_id: Business profile ID
        admin_id: Admin user ID performing rejection
        rejection_reason: Reason for rejection
        
    Returns:
        Success message dict
        
    Raises:
        NotFoundException: If profile not found
    """
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.id == profile_id
    ).first()
    
    if not profile:
        raise NotFoundException("BusinessProfile", str(profile_id))
    
    # Update profile
    profile.status = BusinessStatus.REJECTED
    profile.rejection_reason = rejection_reason
    profile.verified_by = admin_id
    
    db.commit()
    db.refresh(profile)
    
    # Send rejection email (async task)
    user = profile.user
    send_business_rejected_email_task.delay(
        to_email=user.email,
        user_name=user.full_name,
        company_name=profile.company_name,
        rejection_reason=rejection_reason,
    )
    
    return {
        "message": "Business verification rejected",
        "profile_id": profile.id,
        "company_name": profile.company_name,
    }


def list_pending_verifications(db: Session) -> list[BusinessProfile]:
    """
    List all pending business verifications.
    
    Args:
        db: Database session
        
    Returns:
        List of pending business profiles
    """
    return db.query(BusinessProfile).filter(
        BusinessProfile.status == BusinessStatus.PENDING_VERIFICATION
    ).order_by(BusinessProfile.created_at.desc()).all()


def update_credit_limit(
    db: Session,
    profile_id: int,
    credit_limit: float,
    admin_id: int,
) -> Dict:
    """
    Update credit limit for a business.
    
    Args:
        db: Database session
        profile_id: Business profile ID
        credit_limit: New credit limit
        admin_id: Admin user ID
        
    Returns:
        Success message dict
        
    Raises:
        NotFoundException: If profile not found
        ValidationException: If not verified
    """
    profile = db.query(BusinessProfile).filter(
        BusinessProfile.id == profile_id
    ).first()
    
    if not profile:
        raise NotFoundException("BusinessProfile", str(profile_id))
    
    if profile.status != BusinessStatus.VERIFIED:
        raise ValidationException("Can only update credit limit for verified businesses")
    
    profile.credit_limit = credit_limit
    db.commit()
    
    return {
        "message": "Credit limit updated",
        "profile_id": profile.id,
        "new_credit_limit": credit_limit,
    }
