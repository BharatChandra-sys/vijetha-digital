"""Quick login test"""
import requests
import json

url = "http://localhost:5000/auth/login"
data = {
    "email": "admin@vijetha.com",
    "password": "admin123"
}

try:
    response = requests.post(url, json=data, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
