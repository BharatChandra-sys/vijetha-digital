"""Test CORS preflight"""
import requests

# Test CORS preflight
url = "http://localhost:5000/auth/login"
headers = {
    "Origin": "http://localhost:5173",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "Content-Type"
}

response = requests.options(url, headers=headers)
print(f"Preflight Status: {response.status_code}")
print(f"\nCORS Response Headers:")
for key, value in response.headers.items():
    if "Access-Control" in key or "access-control" in key:
        print(f"  {key}: {value}")
