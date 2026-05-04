"""
Comprehensive API endpoint testing script.
Tests all authentication endpoints and their error cases.
"""

import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

# Load test environment variables
load_dotenv(".env.test")

BASE_URL = os.getenv("TEST_API_BASE_URL", "http://127.0.0.1:8000")
TEST_EMAIL = f"test_admin_{datetime.now().strftime('%Y%m%d%H%M%S')}@vijetha.com"
TEST_PASSWORD = os.getenv("TEST_USER_PASSWORD", "SecureTest123!")

# ANSI color codes for pretty output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_test(name, status, details=""):
    """Pretty print test results"""
    symbol = "✓" if status else "✗"
    color = GREEN if status else RED
    print(f"{color}{symbol}{RESET} {name}")
    if details:
        print(f"  {YELLOW}→{RESET} {details}")

def test_register():
    """Test user registration"""
    print(f"\n{BLUE}=== Testing Registration ==={RESET}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "name": "Test Admin User",
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
        )
        
        if response.status_code == 200:
            print_test("Register new user", True, f"Created {TEST_EMAIL}")
            return True
        else:
            print_test("Register new user", False, f"Status: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print_test("Register new user", False, str(e))
        return False

def test_login():
    """Test login endpoint"""
    print(f"\n{BLUE}=== Testing Login ==={RESET}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            has_access_token = "access_token" in data
            has_refresh_token = "refresh_token" in data
            has_user = "user" in data
            
            if has_access_token and has_refresh_token and has_user:
                print_test("Login successful", True, f"Got tokens and user info")
                print_test("User object structure", True, 
                          f"IAM roles: {len(data['user'].get('iam_roles', []))} roles")
                return data
            else:
                print_test("Login response", False, "Missing required fields")
                return None
        else:
            print_test("Login", False, f"Status: {response.status_code}, {response.text}")
            return None
    except Exception as e:
        print_test("Login", False, str(e))
        return None

def test_invalid_login():
    """Test login with invalid credentials"""
    print(f"\n{BLUE}=== Testing Invalid Login ==={RESET}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": TEST_EMAIL,
                "password": "WrongPassword123!"
            }
        )
        
        if response.status_code == 401:
            print_test("Invalid login rejected", True, "401 Unauthorized as expected")
            return True
        else:
            print_test("Invalid login", False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_test("Invalid login test", False, str(e))
        return False

def test_refresh_token(refresh_token):
    """Test token refresh endpoint"""
    print(f"\n{BLUE}=== Testing Token Refresh ==={RESET}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/refresh",
            json={
                "refresh_token": refresh_token
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print_test("Token refresh", True, "New access token received")
                return True
            else:
                print_test("Token refresh", False, "No access token in response")
                return False
        else:
            print_test("Token refresh", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test("Token refresh", False, str(e))
        return False

def test_forgot_password():
    """Test forgot password endpoint"""
    print(f"\n{BLUE}=== Testing Forgot Password ==={RESET}")
    
    try:
        # Test with existing email
        response = requests.post(
            f"{BASE_URL}/auth/forgot-password",
            json={
                "email": TEST_EMAIL
            }
        )
        
        if response.status_code == 200:
            print_test("Forgot password (existing email)", True, "Request accepted")
        else:
            print_test("Forgot password", False, f"Status: {response.status_code}")
            return False
        
        # Test with non-existent email (should return same message for security)
        response = requests.post(
            f"{BASE_URL}/auth/forgot-password",
            json={
                "email": "nonexistent@example.com"
            }
        )
        
        if response.status_code == 200:
            print_test("Forgot password (non-existent email)", True, 
                      "Returns generic message (security best practice)")
            return True
        else:
            print_test("Forgot password (non-existent)", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_test("Forgot password", False, str(e))
        return False

def test_reset_password_validation():
    """Test reset password validation"""
    print(f"\n{BLUE}=== Testing Reset Password Validation ==={RESET}")
    
    try:
        # Test with invalid token
        response = requests.post(
            f"{BASE_URL}/auth/reset-password",
            json={
                "token": "invalid_token_12345",
                "new_password": "NewPassword123!"
            }
        )
        
        if response.status_code == 400:
            print_test("Reset with invalid token", True, "Rejected as expected")
            return True
        else:
            print_test("Reset with invalid token", False, 
                      f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        print_test("Reset password validation", False, str(e))
        return False

def test_cors_headers():
    """Test CORS headers"""
    print(f"\n{BLUE}=== Testing CORS ==={RESET}")
    
    try:
        response = requests.options(
            f"{BASE_URL}/auth/login",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST"
            }
        )
        
        has_cors = "access-control-allow-origin" in response.headers
        if has_cors:
            print_test("CORS headers", True, "CORS configured correctly")
            return True
        else:
            print_test("CORS headers", False, "Missing CORS headers")
            return False
    except Exception as e:
        print_test("CORS test", False, str(e))
        return False

def run_all_tests():
    """Run complete test suite"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}AUTHENTICATION ENDPOINT TEST SUITE{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    
    results = []
    
    # Test registration
    results.append(("Registration", test_register()))
    
    # Test login
    login_data = test_login()
    results.append(("Login", login_data is not None))
    
    # Test invalid login
    results.append(("Invalid Login", test_invalid_login()))
    
    # Test token refresh
    if login_data:
        results.append(("Token Refresh", test_refresh_token(login_data.get("refresh_token"))))
    else:
        print_test("Token Refresh", False, "Skipped - no login data")
        results.append(("Token Refresh", False))
    
    # Test forgot password
    results.append(("Forgot Password", test_forgot_password()))
    
    # Test reset password validation
    results.append(("Reset Password Validation", test_reset_password_validation()))
    
    # Test CORS
    results.append(("CORS", test_cors_headers()))
    
    # Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        print_test(name, result)
    
    print(f"\n{BLUE}Results: {GREEN}{passed}/{total} tests passed{RESET}")
    
    if passed == total:
        print(f"\n{GREEN}✓ All tests passed! Endpoints are working correctly.{RESET}")
    else:
        print(f"\n{RED}✗ Some tests failed. Please check the errors above.{RESET}")

if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Tests interrupted by user{RESET}")
    except Exception as e:
        print(f"\n{RED}Test suite error: {e}{RESET}")
