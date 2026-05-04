# Manual Test Scripts

These are standalone Python scripts for manual testing and debugging. They test against a running server instance.

## Prerequisites

1. **Server must be running**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

2. **Environment variables configured**:
   ```bash
   cp .env.test.example .env.test
   # Edit .env.test with your credentials
   ```

3. **Dependencies installed**:
   ```bash
   pip install requests python-dotenv
   ```

## Available Tests

### 🔐 Authentication Tests

#### `test_login.py`
Tests login endpoint with multiple URL variations.

**Usage**:
```bash
python tests/manual/test_login.py
```

**What it tests**:
- Tries multiple base URLs (localhost:8000, localhost:5000)
- Tries multiple paths (/auth/login, /api/auth/login)
- Uses credentials from `.env.test`
- Shows detailed response on success

**Expected output**:
```
============================================================
TESTING LOGIN ENDPOINT
============================================================
Email: admin@vijetha.com
Password: admin123

Trying: http://localhost:8000/auth/login
  Status: 200
  ✓ LOGIN SUCCESSFUL!
  Response: {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": {...}
  }
```

---

#### `test_login_quick.py`
Quick login test for rapid debugging.

**Usage**:
```bash
python tests/manual/test_login_quick.py
```

**What it tests**:
- Single endpoint test
- Minimal output
- Fast execution

---

#### `test_logout.py`
Tests logout functionality and token blacklisting.

**Usage**:
```bash
python tests/manual/test_logout.py
```

**What it tests**:
1. Register new user
2. Login and get token
3. Access `/auth/me` with token (should work)
4. Logout (blacklist token)
5. Access `/auth/me` with same token (should fail)

**Expected output**:
```
Registering...
Register: 200
Logging in...
Login: 200
Testing /auth/me before logout...
/me before: 200 logout_test_1234@vijetha.com
Logging out...
Logout: 200
Testing /auth/me after logout...
/me after: 401 Token has been revoked
```

---

#### `test_auth_endpoints.py`
Comprehensive authentication endpoint test suite.

**Usage**:
```bash
python tests/manual/test_auth_endpoints.py
```

**What it tests**:
- ✓ User registration
- ✓ Login with valid credentials
- ✓ Login with invalid credentials (should fail)
- ✓ Token refresh
- ✓ Forgot password
- ✓ Reset password validation
- ✓ CORS headers

**Expected output**:
```
============================================================
AUTHENTICATION ENDPOINT TEST SUITE
============================================================

=== Testing Registration ===
✓ Register new user
  → Created test_admin_20260504123456@vijetha.com

=== Testing Login ===
✓ Login successful
  → Got tokens and user info
✓ User object structure
  → IAM roles: 1 roles

=== Testing Invalid Login ===
✓ Invalid login rejected
  → 401 Unauthorized as expected

=== Testing Token Refresh ===
✓ Token refresh
  → New access token received

=== Testing Forgot Password ===
✓ Forgot password (existing email)
  → Request accepted
✓ Forgot password (non-existent email)
  → Returns generic message (security best practice)

=== Testing Reset Password Validation ===
✓ Reset with invalid token
  → Rejected as expected

=== Testing CORS ===
✓ CORS headers
  → CORS configured correctly

============================================================
TEST SUMMARY
============================================================
✓ Registration
✓ Login
✓ Invalid Login
✓ Token Refresh
✓ Forgot Password
✓ Reset Password Validation
✓ CORS

Results: 7/7 tests passed

✓ All tests passed! Endpoints are working correctly.
```

---

### 🚀 Performance Tests

#### `test_stress.py`
Stress test for rate limiter.

**Usage**:
```bash
python tests/manual/test_stress.py
```

**What it tests**:
- Sends 1000 concurrent requests
- Tests rate limiter effectiveness
- Measures response time
- Counts success vs blocked requests

**Expected output**:
```
🚀 Blasting 1000 concurrent POST requests to http://127.0.0.1:8000/auth/login...

⏱️  Finished in 12.34 seconds.
----------------------------------------
✅ Success (200 OK): 0 requests
🚫 Blocked (429 Too Many Requests): 950 requests
⚠️ Other (401): 50 requests
----------------------------------------
🛡️  Rate limiter is WORKING! Most concurrent requests were blocked.
```

**Configuration**:
Edit the script to adjust:
- `total_requests`: Number of requests (default: 1000)
- `max_workers`: Concurrent threads (default: 50)

---

### 🌐 Network Tests

#### `test_cors.py`
Tests CORS preflight requests.

**Usage**:
```bash
python tests/manual/test_cors.py
```

**What it tests**:
- OPTIONS request (CORS preflight)
- Access-Control headers
- Origin validation

**Expected output**:
```
Preflight Status: 200

CORS Response Headers:
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Methods: POST, GET, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  Access-Control-Allow-Credentials: true
```

---

## Environment Variables

All tests load from `.env.test`:

```env
# Admin credentials
TEST_ADMIN_EMAIL=admin@vijetha.com
TEST_ADMIN_PASSWORD=admin123

# Regular user credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=SecureTest123!

# API configuration
TEST_API_BASE_URL=http://127.0.0.1:8000

# Database (for pytest tests)
TEST_DATABASE_URL=postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_db
```

## Troubleshooting

### Connection Refused
```bash
# Check if server is running
curl http://localhost:8000/health

# Start server if not running
python -m uvicorn app.main:app --reload
```

### Authentication Failed
```bash
# Verify credentials in .env.test
cat .env.test | grep TEST_ADMIN

# Check if admin user exists in database
psql -U postgres -d vijetha_db -c "SELECT email FROM users WHERE role='admin';"
```

### Import Errors
```bash
# Install required packages
pip install requests python-dotenv

# Or install all dependencies
pip install -r requirements-pinned.txt
```

### Wrong Port
Edit the test file or set environment variable:
```bash
# Option 1: Edit .env.test
echo "TEST_API_BASE_URL=http://127.0.0.1:5000" >> .env.test

# Option 2: Set environment variable
export TEST_API_BASE_URL=http://127.0.0.1:5000
python tests/manual/test_login.py
```

## Creating New Manual Tests

Template for new manual test:

```python
"""
Description of what this test does
"""
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.test")

BASE_URL = os.getenv("TEST_API_BASE_URL", "http://127.0.0.1:8000")

def test_something():
    """Test description"""
    print("Testing something...")
    
    response = requests.get(f"{BASE_URL}/endpoint")
    
    if response.status_code == 200:
        print("✓ Test passed")
        print(f"Response: {response.json()}")
    else:
        print("✗ Test failed")
        print(f"Status: {response.status_code}")
        print(f"Error: {response.text}")

if __name__ == "__main__":
    try:
        test_something()
    except Exception as e:
        print(f"Error: {e}")
```

## Best Practices

1. **Always load from .env.test**: Don't hardcode credentials
2. **Use descriptive output**: Help debugging with clear messages
3. **Handle errors gracefully**: Catch exceptions and show helpful errors
4. **Test one thing**: Keep tests focused on specific functionality
5. **Document expected behavior**: Add comments explaining what should happen
6. **Clean up after tests**: Delete test data if needed

## When to Use Manual Tests vs Pytest

**Use Manual Tests when**:
- Quick debugging during development
- Testing against remote server
- Visual inspection of responses needed
- Demonstrating functionality to team

**Use Pytest when**:
- Automated CI/CD pipeline
- Regression testing
- Code coverage measurement
- Testing with fixtures and mocks

## Running All Manual Tests

Create a script to run all tests:

```bash
#!/bin/bash
# run_manual_tests.sh

echo "Starting manual test suite..."
echo ""

python tests/manual/test_login.py
echo ""

python tests/manual/test_logout.py
echo ""

python tests/manual/test_auth_endpoints.py
echo ""

python tests/manual/test_cors.py
echo ""

echo "Manual tests complete!"
```

Make it executable:
```bash
chmod +x run_manual_tests.sh
./run_manual_tests.sh
```
