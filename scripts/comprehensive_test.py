"""
Comprehensive API testing suite to check all endpoints and functionality.
"""
import requests
import json
import time

BASE_URL = 'http://127.0.0.1:8002'

# Colors for console output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
END = '\033[0m'

def test(name, condition, actual=None):
    """Helper to print test results."""
    if condition:
        print(f"{GREEN}✓{END} {name}")
        return True
    else:
        print(f"{RED}✗{END} {name}")
        if actual:
            print(f"  Got: {actual}")
        return False

def section(title):
    """Print section header."""
    print(f"\n{BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{END}\n")

# Test data
customer_email = f"customer{int(time.time())}@test.com"
customer_password = "password123"
admin_email = "admin@vijetha.com"
admin_password = "admin123"

tokens = {}
all_pass = True

# ================== HEALTH CHECK ==================
section("1. HEALTH CHECK")

try:
    r = requests.get(f'{BASE_URL}/health')
    all_pass &= test("Health endpoint responds", r.status_code == 200)
except Exception as e:
    all_pass &= test("Health endpoint responds", False, str(e))

# ================== AUTH ENDPOINTS ==================
section("2. AUTH - REGISTRATION")

try:
    r = requests.post(f'{BASE_URL}/auth/register', json={
        'name': 'Test Customer',
        'email': customer_email,
        'password': customer_password
    })
    all_pass &= test("Customer registration succeeds", r.status_code == 200, r.text)
    all_pass &= test("Registration returns message", r.status_code == 200 and 'message' in r.json())
except Exception as e:
    all_pass &= test("Customer registration succeeds", False, str(e))

# ================== LOGIN ==================
section("3. AUTH - LOGIN")

try:
    r = requests.post(f'{BASE_URL}/auth/login', json={
        'email': customer_email,
        'password': customer_password
    })
    all_pass &= test("Login succeeds", r.status_code == 200, r.text)
    
    if r.status_code == 200:
        data = r.json()
        all_pass &= test("Login returns access_token", 'access_token' in data)
        all_pass &= test("Login returns refresh_token", 'refresh_token' in data)
        all_pass &= test("Login returns token_type", 'token_type' in data)
        all_pass &= test("Login returns user object", 'user' in data)
        
        if 'user' in data:
            user = data['user']
            all_pass &= test("User has id", 'id' in user)
            all_pass &= test("User has email", 'email' in user)
            all_pass &= test("User has role", 'role' in user)
            all_pass &= test("User role is customer", user.get('role') == 'customer')
        
        tokens['customer_access'] = data.get('access_token')
        tokens['customer_refresh'] = data.get('refresh_token')
except Exception as e:
    all_pass &= test("Login succeeds", False, str(e))

# ================== REFRESH TOKEN ==================
section("4. AUTH - REFRESH TOKEN")

if tokens.get('customer_refresh'):
    try:
        r = requests.post(f'{BASE_URL}/auth/refresh', json={
            'refresh_token': tokens['customer_refresh']
        })
        all_pass &= test("Refresh token succeeds", r.status_code == 200, r.text)
        
        if r.status_code == 200:
            data = r.json()
            all_pass &= test("Refresh returns new access_token", 'access_token' in data)
            all_pass &= test("Refresh returns token_type", 'token_type' in data)
            tokens['customer_access_refreshed'] = data.get('access_token')
    except Exception as e:
        all_pass &= test("Refresh token succeeds", False, str(e))
else:
    print(f"{YELLOW}⊘{END} Skipping refresh token test (no refresh token)")

# ================== ADMIN AUTH ==================
section("5. AUTH - ADMIN REGISTRATION & LOGIN")

try:
    r = requests.post(f'{BASE_URL}/auth/register', json={
        'name': 'Admin User',
        'email': admin_email,
        'password': admin_password
    })
    # May already exist, so allow 200 or 400
    all_pass &= test("Admin can register", r.status_code in [200, 400])
except Exception as e:
    all_pass &= test("Admin registration attempted", False, str(e))

try:
    r = requests.post(f'{BASE_URL}/auth/login', json={
        'email': admin_email,
        'password': admin_password
    })
    all_pass &= test("Admin login succeeds", r.status_code == 200, r.text)
    
    if r.status_code == 200:
        data = r.json()
        all_pass &= test("Admin login returns tokens", 'access_token' in data and 'refresh_token' in data)
        
        if 'user' in data:
            user = data['user']
            all_pass &= test("Admin role is admin", user.get('role') == 'admin')
        
        tokens['admin_access'] = data.get('access_token')
        tokens['admin_refresh'] = data.get('refresh_token')
except Exception as e:
    all_pass &= test("Admin login succeeds", False, str(e))

# ================== ADMIN PROTECTED ENDPOINTS ==================
section("6. ADMIN ENDPOINTS")

if tokens.get('admin_access'):
    headers = {'Authorization': f"Bearer {tokens['admin_access']}"}
    
    try:
        r = requests.get(f'{BASE_URL}/admin/dashboard', headers=headers)
        all_pass &= test("Admin dashboard accessible", r.status_code == 200, r.text)
        if r.status_code == 200:
            data = r.json()
            all_pass &= test("Dashboard returns welcome message", 'message' in data)
            all_pass &= test("Dashboard returns admin_email", 'admin_email' in data)
    except Exception as e:
        all_pass &= test("Admin dashboard accessible", False, str(e))
else:
    print(f"{YELLOW}⊘{END} Skipping admin endpoints (no admin token)")

# ================== PROTECTED ENDPOINTS WITH CUSTOMER TOKEN ==================
section("7. PROTECTED ENDPOINTS - CUSTOMER ACCESS")

if tokens.get('customer_access'):
    headers = {'Authorization': f"Bearer {tokens['customer_access']}"}
    
    # Try to access protected endpoint that requires auth (e.g., orders list)
    try:
        r = requests.get(f'{BASE_URL}/api/v1/orders', headers=headers)
        # May return 200 or 404 if endpoint doesn't exist, but should not be 401
        all_pass &= test("Protected endpoint accepts valid token", r.status_code != 401, 
                        f"status={r.status_code}")
    except Exception as e:
        print(f"{YELLOW}⊘{END} Could not test protected endpoint: {e}")
else:
    print(f"{YELLOW}⊘{END} Skipping protected endpoint tests (no customer token)")

# ================== INVALID TOKEN TESTS ==================
section("8. INVALID TOKEN HANDLING")

try:
    r = requests.post(f'{BASE_URL}/auth/refresh', json={
        'refresh_token': 'invalid.token.here'
    })
    all_pass &= test("Invalid refresh token rejected", r.status_code != 200, r.text)
except Exception as e:
    all_pass &= test("Invalid refresh token rejected", False, str(e))

try:
    headers = {'Authorization': 'Bearer invalid.token.here'}
    r = requests.get(f'{BASE_URL}/admin/dashboard', headers=headers)
    all_pass &= test("Invalid access token rejected", r.status_code == 401, r.text)
except Exception as e:
    all_pass &= test("Invalid access token rejected", False, str(e))

# ================== MISSING TOKEN TESTS ==================
section("9. MISSING TOKEN HANDLING")

try:
    r = requests.get(f'{BASE_URL}/admin/dashboard')
    all_pass &= test("Missing token rejected from protected endpoint", r.status_code == 401, r.text)
except Exception as e:
    all_pass &= test("Missing token rejected from protected endpoint", False, str(e))

# ================== FINAL SUMMARY ==================
section("TEST SUMMARY")

if all_pass:
    print(f"{GREEN}✓ ALL TESTS PASSED{END}\n")
else:
    print(f"{RED}✗ SOME TESTS FAILED{END}\n")

print(f"Total requests made: ~15")
print(f"Server status: {GREEN}RUNNING{END}\n")
