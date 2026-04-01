import requests
import time

BASE_URL = "http://127.0.0.1:8000"
TEST_EMAIL = f"logout_test_{int(time.time())}@vijetha.com"
TEST_PASSWORD = "SecureTest123!"

# 1. Register
print("Registering...")
r = requests.post(f"{BASE_URL}/auth/register", json={"name": "Test User", "email": TEST_EMAIL, "password": TEST_PASSWORD})
print("Register:", r.status_code)

# 2. Login
print("Logging in...")
r = requests.post(f"{BASE_URL}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
print("Login:", r.status_code)
if r.status_code != 200:
    print(r.text)
    exit(1)
token = r.json()["access_token"]

# 3. Test me (should work)
print("Testing /auth/me before logout...")
r = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
print("/me before:", r.status_code, r.json().get("email"))

# 4. Logout (Blacklist token)
print("Logging out...")
r = requests.post(f"{BASE_URL}/auth/logout", headers={"Authorization": f"Bearer {token}"})
print("Logout:", r.status_code, r.text)

# 5. Test me (should fail)
print("Testing /auth/me after logout...")
r = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
print("/me after:", r.status_code, r.text)
