import requests

r = requests.post('http://127.0.0.1:8001/auth/login', json={
    'email': 'admin@vijetha.com',
    'password': 'admin123'
})

print("Status:", r.status_code)
print("Response:", r.json())
