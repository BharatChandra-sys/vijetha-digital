import requests
import json

BASE_URL = 'http://127.0.0.1:5000'

# Login as admin
r = requests.post(f'{BASE_URL}/auth/login', json={
    'email': 'admin@vijetha.com',
    'password': 'admin123'
})

if r.status_code == 200:
    admin_token = r.json().get('access_token')
    headers = {'Authorization': f'Bearer {admin_token}'}
    
    # Get existing products
    r = requests.get(f'{BASE_URL}/products', headers=headers)
    print("Existing products:", r.status_code)
    print(r.text)
    print()
    
    # Add products
    products = [
        {'name': 'Flex Banners', 'category': 'Banners', 'base_price': 50},
        {'name': 'Vinyl Prints', 'category': 'Prints', 'base_price': 75},
        {'name': 'LED Boards', 'category': 'LED Displays', 'base_price': 150},
        {'name': 'Business Cards', 'category': 'Cards', 'base_price': 5},
        {'name': 'Brochures', 'category': 'Documents', 'base_price': 15},
    ]
    
    for product in products:
        r = requests.post(f'{BASE_URL}/admin/products', json=product, headers=headers)
        print(f"Add {product['name']}: {r.status_code}")
        if r.status_code != 200:
            print(f"  Response: {r.text}")
    
    print("\nFinal products list:")
    r = requests.get(f'{BASE_URL}/products', headers=headers)
    print(r.status_code)
    print(json.dumps(r.json(), indent=2))
