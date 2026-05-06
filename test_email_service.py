#!/usr/bin/env python3
"""
Test script for Brevo email service.
Run this to verify email configuration is working.

Usage:
    python test_email_service.py
"""

import sys
import asyncio
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.brevo_email_service import brevo_email_service
from app.core.config import settings


async def test_welcome_email():
    """Test welcome email."""
    print("\n" + "="*60)
    print("Testing Welcome Email")
    print("="*60)
    
    result = brevo_email_service.send_welcome_email(
        to_email="bc833498@gmail.com",
        user_name="Test User"
    )
    
    if result:
        print("✅ Welcome email sent successfully!")
        print("📧 Check your inbox: bc833498@gmail.com")
    else:
        print("❌ Failed to send welcome email")
        print("Check the logs above for errors")
    
    return result


async def test_order_confirmation():
    """Test order confirmation email."""
    print("\n" + "="*60)
    print("Testing Order Confirmation Email")
    print("="*60)
    
    result = brevo_email_service.send_order_confirmation(
        to_email="bc833498@gmail.com",
        user_name="Test User",
        order_id="TEST-12345",
        order_total=2500.00,
        items_count=3
    )
    
    if result:
        print("✅ Order confirmation email sent successfully!")
        print("📧 Check your inbox: bc833498@gmail.com")
    else:
        print("❌ Failed to send order confirmation email")
        print("Check the logs above for errors")
    
    return result


async def test_order_shipped():
    """Test order shipped email."""
    print("\n" + "="*60)
    print("Testing Order Shipped Email")
    print("="*60)
    
    result = brevo_email_service.send_order_shipped(
        to_email="bc833498@gmail.com",
        user_name="Test User",
        order_id="TEST-12345",
        tracking_number="TRACK123456789",
        tracking_url="https://example.com/track/TRACK123456789"
    )
    
    if result:
        print("✅ Order shipped email sent successfully!")
        print("📧 Check your inbox: bc833498@gmail.com")
    else:
        print("❌ Failed to send order shipped email")
        print("Check the logs above for errors")
    
    return result


async def test_password_reset():
    """Test password reset email."""
    print("\n" + "="*60)
    print("Testing Password Reset Email")
    print("="*60)
    
    result = brevo_email_service.send_password_reset(
        to_email="bc833498@gmail.com",
        user_name="Test User",
        reset_token="test-reset-token-123456"
    )
    
    if result:
        print("✅ Password reset email sent successfully!")
        print("📧 Check your inbox: bc833498@gmail.com")
    else:
        print("❌ Failed to send password reset email")
        print("Check the logs above for errors")
    
    return result


async def test_payment_success():
    """Test payment success email."""
    print("\n" + "="*60)
    print("Testing Payment Success Email")
    print("="*60)
    
    result = brevo_email_service.send_payment_success(
        to_email="bc833498@gmail.com",
        user_name="Test User",
        order_id="TEST-12345",
        amount=2500.00,
        payment_id="pay_test123456"
    )
    
    if result:
        print("✅ Payment success email sent successfully!")
        print("📧 Check your inbox: bc833498@gmail.com")
    else:
        print("❌ Failed to send payment success email")
        print("Check the logs above for errors")
    
    return result


async def main():
    """Run all email tests."""
    print("\n" + "="*60)
    print("BREVO EMAIL SERVICE TEST")
    print("="*60)
    print(f"\n📧 Sender: {brevo_email_service.from_name} <{brevo_email_service.from_email}>")
    print(f"📬 Recipient: bc833498@gmail.com")
    print(f"🔑 API Key: {'✅ Configured' if brevo_email_service.api_key else '❌ Missing'}")
    print(f"🌐 Frontend URL: {settings.FRONTEND_URL}")
    
    if not brevo_email_service.api_key:
        print("\n❌ ERROR: BREVO_API_KEY not configured!")
        print("Please set BREVO_API_KEY in your .env file")
        return
    
    print("\n⏳ Sending test emails...")
    print("(This will take about 10-15 seconds)")
    
    results = []
    
    # Test all email types
    results.append(await test_welcome_email())
    await asyncio.sleep(2)  # Rate limiting
    
    results.append(await test_order_confirmation())
    await asyncio.sleep(2)
    
    results.append(await test_order_shipped())
    await asyncio.sleep(2)
    
    results.append(await test_password_reset())
    await asyncio.sleep(2)
    
    results.append(await test_payment_success())
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    total = len(results)
    passed = sum(results)
    failed = total - passed
    
    print(f"\n📊 Results:")
    print(f"   Total:  {total}")
    print(f"   ✅ Passed: {passed}")
    print(f"   ❌ Failed: {failed}")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        print("📧 Check your inbox: bc833498@gmail.com")
        print("📱 Check spam folder if you don't see them")
        print("\n✅ Email service is working correctly!")
    else:
        print(f"\n⚠️  {failed} test(s) failed")
        print("Check the error messages above")
        print("\nCommon issues:")
        print("  - Invalid API key")
        print("  - Sender email not verified in Brevo")
        print("  - Rate limiting (wait a few minutes)")
        print("  - Network connectivity issues")
    
    print("\n" + "="*60)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
