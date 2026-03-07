import requests, time

url='http://127.0.0.1:8001'
for _ in range(5):
    try:
        r=requests.get(url+'/health')
        print('health',r.status_code)
        break
    except Exception as e:
        print('waiting',e)
        time.sleep(1)

print('registering')
# registration requires name, email, and password
register_data={'name':'Test User','email':'test@example.com','password':'secret123'}
try:
    r=requests.post(url+'/auth/register',json=register_data)
    print('register',r.status_code,r.text)
except Exception as e:
    print('register exception',e)

# attempt login using same credentials
login_data={'email':'test@example.com','password':'secret123'}
try:
    r=requests.post(url+'/auth/login',json=login_data)
    print('login',r.status_code,r.text)
    if r.status_code==200:
        tok=r.json().get('refresh_token')
        print('refresh token',tok)
        r2=requests.post(url+'/auth/refresh',json={'refresh_token':tok})
        print('refresh',r2.status_code,r2.text)
except Exception as e:
    print('login exception',e)

# admin user flow
print('\nadmin flow')
admin_email = 'admin@vijetha.com'
admin_data = {'name':'Admin User','email':admin_email,'password':'admin123'}

r = requests.post(url+'/auth/register', json=admin_data)
print('admin register', r.status_code, r.text)
r = requests.post(url+'/auth/login', json={'email':admin_email,'password':'admin123'})
print('admin login', r.status_code, r.text)
if r.status_code == 200:
    token = r.json().get('access_token')
    h = {'Authorization': f'Bearer {token}'}
    r2 = requests.get(url+'/admin/dashboard', headers=h)
    print('admin dashboard', r2.status_code, r2.text)
