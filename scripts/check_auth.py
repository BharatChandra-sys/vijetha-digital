import requests

# Try accessing admin dashboard without token
r = requests.get('http://127.0.0.1:8002/admin/dashboard')
print(f"Status code: {r.status_code}")
print(f"Response: {r.text}")
