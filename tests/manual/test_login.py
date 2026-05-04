"""Test login endpoint"""
import os
import requests
import json
from dotenv import load_dotenv

# Load test environment variables
load_dotenv(".env.test")

# Try different possible ports and paths
endpoints = [
    ("http://localhost:8000", "/auth/login"),
    ("http://localhost:8000", "/api/auth/login"),
    ("http://localhost:5000", "/auth/login"),
    ("http://localhost:5000", "/api/auth/login"),
]

# Test data from environment variables
login_data = {
    "email": os.getenv("TEST_ADMIN_EMAIL", "admin@vijetha.com"),
    "password": os.getenv("TEST_ADMIN_PASSWORD", "admin123")
}

print("="*60)
print("TESTING LOGIN ENDPOINT")
print("="*60)
print(f"Email: {login_data['email']}")
print(f"Password: {login_data['password']}\n")

for base_url, path in endpoints:
    url = base_url + path
    print(f"Trying: {url}")
    
    try:
        response = requests.post(url, json=login_data, timeout=5)
        print(f"  Status: {response.status_code}")
        if response.status_code == 200:
            print("  ✓ LOGIN SUCCESSFUL!")
            print(f"  Response: {json.dumps(response.json(), indent=4)}")
            break
        elif response.status_code == 401:
            print(f"  ✗ Authentication failed: {response.json().get('detail', '')}")
        else:
            try:
                print(f"  Response: {response.json()}")
            except:
                print(f"  Response text: {response.text}")
    except requests.exceptions.ConnectionError:
        print(f"  ✗ Connection refused")
    except requests.exceptions.Timeout:
        print(f"  ✗ Timeout")
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")


