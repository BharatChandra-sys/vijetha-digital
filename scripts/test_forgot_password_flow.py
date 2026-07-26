#!/usr/bin/env python3
"""
Test the complete forgot password flow with Brevo email service.
Usage: python scripts/test_forgot_password_flow.py
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import requests
from time import sleep

# Configuration
BASE_URL = "https://vijetha-digital-backend.onrender.com"  # Change to production URL
TEST_EMAIL = "bc833498@gmail.com"  # Your test email

def test_forgot_password_flow():
    """Test the complete forgot password flow"""
    
    print("=" * 60)
    print("Testing Forgot Password Flow with Brevo Email Service")
    print("=" * 60)
    
    # Step 1: Send OTP
    print("\n[Step 1] Sending OTP to", TEST_EMAIL)
    response = requests.post(
        f"{BASE_URL}/auth/send-otp",
        json={"email": TEST_EMAIL},
        timeout=30
    )
    
    if response.status_code == 200:
        print("✅ OTP sent successfully!")
        print(f"   Response: {response.json()}")
    else:
        print(f"❌ Failed to send OTP: {response.status_code}")
        print(f"   Error: {response.text}")
        return False
    
    # Step 2: Get OTP from user
    print("\n[Step 2] Check your email for the OTP code")
    otp = input("Enter the 6-digit OTP you received: ").strip()
    
    if len(otp) != 6 or not otp.isdigit():
        print("❌ Invalid OTP format. Must be 6 digits.")
        return False
    
    # Step 3: Verify OTP
    print("\n[Step 3] Verifying OTP...")
    response = requests.post(
        f"{BASE_URL}/auth/verify-otp",
        json={"email": TEST_EMAIL, "otp": otp},
        timeout=30
    )
    
    if response.status_code == 200:
        print("✅ OTP verified successfully!")
        print(f"   Response: {response.json()}")
    else:
        print(f"❌ OTP verification failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return False
    
    # Step 4: Reset Password
    print("\n[Step 4] Resetting password...")
    new_password = "TestPassword123!"
    response = requests.post(
        f"{BASE_URL}/auth/reset-password-otp",
        json={
            "email": TEST_EMAIL,
            "otp": otp,
            "new_password": new_password
        },
        timeout=30
    )
    
    if response.status_code == 200:
        print("✅ Password reset successfully!")
        print(f"   Response: {response.json()}")
    else:
        print(f"❌ Password reset failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    print("\nForgot password flow is working correctly with Brevo email service!")
    return True

def test_production_health():
    """Check if production backend is healthy"""
    print("\n[Health Check] Checking backend health...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is healthy")
            return True
        else:
            print(f"⚠️  Backend returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend is unreachable: {e}")
        return False

if __name__ == "__main__":
    print("\n🚀 Starting Forgot Password Flow Test\n")
    
    if not test_production_health():
        print("\n❌ Backend health check failed. Please check if the backend is running.")
        sys.exit(1)
    
    try:
        success = test_forgot_password_flow()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
