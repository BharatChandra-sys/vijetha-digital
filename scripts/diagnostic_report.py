#!/usr/bin/env python
"""
Comprehensive system diagnostic and health check report.
Tests all critical components and generates a summary report.
"""

import requests
import json
from datetime import datetime
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

BASE_URL = 'http://127.0.0.1:8002'

# ANSI Colors
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
CYAN = '\033[96m'
END = '\033[0m'
BOLD = '\033[1m'

def header(title):
    """Print section header."""
    print(f"\n{BLUE}{BOLD}{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}{END}\n")

def status_check(name, passed, details=""):
    """Print status check result."""
    symbol = f"{GREEN}✓{END}" if passed else f"{RED}✗{END}"
    status = f"{GREEN}PASS{END}" if passed else f"{RED}FAIL{END}"
    print(f"{symbol} {name:<50} [{status}]")
    if details:
        print(f"   {YELLOW}→ {details}{END}")

def divider():
    """Print divider line."""
    print(f"{CYAN}{'-'*70}{END}")

# Track results
results = {
    'passed': 0,
    'failed': 0,
    'warnings': 0,
    'tests': []
}

def record(name, passed, details=""):
    """Record test result."""
    status_check(name, passed, details)
    if passed:
        results['passed'] += 1
    else:
        results['failed'] += 1
    results['tests'].append({
        'name': name,
        'passed': passed,
        'details': details
    })

# ============================================================================
# 1. CONNECTIVITY CHECKS
# ============================================================================
header("1. SERVER CONNECTIVITY & HEALTH")

try:
    r = requests.get(f'{BASE_URL}/health', timeout=5)
    record("Server is running", r.status_code == 200, f"Status: {r.status_code}")
except Exception as e:
    record("Server is running", False, f"Error: {str(e)}")
    print(f"\n{RED}SERVER IS NOT RUNNING! Cannot continue tests.{END}\n")
    sys.exit(1)

# ============================================================================
# 2. AUTHENTICATION SYSTEM
# ============================================================================
header("2. AUTHENTICATION SYSTEM")

# Test registration flow
try:
    test_email = f"diag{datetime.now().timestamp()}@test.com"
    r = requests.post(f'{BASE_URL}/auth/register', json={
        'name': 'Diagnostic User',
        'email': test_email,
        'password': 'DiaPassword123'
    })
    record("User registration works", r.status_code == 200)
    
    # Test login
    r = requests.post(f'{BASE_URL}/auth/login', json={
        'email': test_email,
        'password': 'DiaPassword123'
    })
    record("User login works", r.status_code == 200)
    
    if r.status_code == 200:
        data = r.json()
        record("Login response includes tokens", 'access_token' in data and 'refresh_token' in data)
        record("Login response includes user info", 'user' in data)
        
        access_token = data.get('access_token')
        refresh_token = data.get('refresh_token')
        
        # Test token refresh
        r = requests.post(f'{BASE_URL}/auth/refresh', json={
            'refresh_token': refresh_token
        })
        record("Token refresh works", r.status_code == 200)
        
        # Test invalid token rejection
        r = requests.get(f'{BASE_URL}/admin/dashboard', 
                        headers={'Authorization': 'Bearer invalid.token.here'})
        record("Invalid tokens are rejected", r.status_code != 200)
        
except Exception as e:
    record("Authentication flow", False, str(e))

# ============================================================================
# 3. ADMIN ACCESS CONTROL
# ============================================================================
header("3. ADMIN ACCESS CONTROL")

try:
    # Get admin token
    r = requests.post(f'{BASE_URL}/auth/login', json={
        'email': 'admin@vijetha.com',
        'password': 'admin123'
    })
    
    if r.status_code == 200:
        admin_token = r.json().get('access_token')
        
        # Test admin dashboard access
        r = requests.get(f'{BASE_URL}/admin/dashboard',
                        headers={'Authorization': f'Bearer {admin_token}'})
        record("Admin can access /admin/dashboard", r.status_code == 200)
        
        # Test unauthorized access (without token)
        r = requests.get(f'{BASE_URL}/admin/dashboard')
        record("Non-authenticated users rejected", r.status_code == 401)
        
        # Test material management
        r = requests.get(f'{BASE_URL}/admin/materials',
                        headers={'Authorization': f'Bearer {admin_token}'})
        record("Admin can access /admin/materials", r.status_code == 200)
        
    else:
        record("Admin login", False, "Could not authenticate as admin")
        
except Exception as e:
    record("Admin access checks", False, str(e))

# ============================================================================
# 4. DATABASE CONNECTIVITY
# ============================================================================
header("4. DATABASE CONNECTIVITY")

try:
    from app.db.session import SessionLocal
    from sqlalchemy import text
    
    db = SessionLocal()
    result = db.execute(text("SELECT 1")).scalar()
    db.close()
    record("Database connection works", result == 1)
    
    # Check crucial tables exist
    db = SessionLocal()
    from sqlalchemy import inspect
    insp = inspect(db.bind)
    tables = insp.get_table_names()
    
    required_tables = ['users', 'orders', 'products', 'order_items']
    for table in required_tables:
        record(f"Table '{table}' exists", table in tables)
    
    # Check users table has correct schema
    if 'users' in tables:
        cols = insp.get_columns('users')
        col_names = [c['name'] for c in cols]
        for col in ['id', 'email', 'hashed_password', 'role']:
            record(f"  Column '{col}' in users table", col in col_names)
    
    db.close()
except Exception as e:
    record("Database checks", False, str(e))

# ============================================================================
# 5. CONFIGURATION & ENVIRONMENT
# ============================================================================
header("5. CONFIGURATION & ENVIRONMENT")

try:
    from app.core.config import settings
    
    record("Config file loads", settings is not None)
    record("DATABASE_URL configured", len(settings.DATABASE_URL) > 0, 
           "PostgreSQL" if "postgresql" in settings.DATABASE_URL else "Other DB")
    record("JWT_SECRET_KEY configured", len(settings.JWT_SECRET_KEY) > 0)
    record("ADMIN_EMAIL configured", len(settings.ADMIN_EMAIL) > 0)
    record("RAZORPAY keys configured", 
           len(settings.RAZORPAY_KEY_ID) > 0 and len(settings.RAZORPAY_KEY_SECRET) > 0)
    record("Cloudinary keys configured", 
           len(settings.CLOUDINARY_API_KEY) > 0 and len(settings.CLOUDINARY_CLOUD_NAME) > 0)
           
except Exception as e:
    record("Configuration", False, str(e))

# ============================================================================
# 6. CRITICAL IMPORTS
# ============================================================================
header("6. CRITICAL IMPORTS")

imports_to_test = [
    'app.main',
    'app.api.auth.router',
    'app.api.admin.router',
    'app.api.orders.router',
    'app.api.products.router',
    'app.api.payments.router',
    'app.services.auth_service',
    'app.services.order_service',
    'app.services.payment_service',
    'app.models.user',
    'app.models.order',
    'app.core.security',
]

for import_path in imports_to_test:
    try:
        __import__(import_path)
        record(f"Import {import_path}", True)
    except Exception as e:
        record(f"Import {import_path}", False, str(e))

# ============================================================================
# 7. MIGRATION STATUS
# ============================================================================
header("7. DATABASE MIGRATIONS")

try:
    from alembic.config import Config
    from alembic.script import ScriptDirectory
    from app.db.session import engine
    
    alembic_cfg = Config("alembic.ini")
    script = ScriptDirectory.from_config(alembic_cfg)
    
    # Get head revision
    heads = script.get_heads()
    record("Alembic migrations configured", len(heads) > 0)
    
    if heads:
        head_revision = heads[0]
        print(f"   {YELLOW}→ Head revision: {head_revision}{END}")
        
except Exception as e:
    record("Migration checks", False, str(e))

# ============================================================================
# SUMMARY
# ============================================================================
header("FINAL REPORT")

total_tests = results['passed'] + results['failed']
percentage = (results['passed'] / total_tests * 100) if total_tests > 0 else 0

print(f"\n{BOLD}Tests Passed:{END} {GREEN}{results['passed']}/{total_tests}{END}")
print(f"{BOLD}Tests Failed:{END} {RED}{results['failed']}{END}")
print(f"{BOLD}Success Rate:{END} {percentage:.1f}%\n")

if results['failed'] == 0:
    print(f"{GREEN}{BOLD}✓ ALL CHECKS PASSED - SYSTEM IS HEALTHY!{END}\n")
    overall_status = "HEALTHY"
else:
    print(f"{RED}{BOLD}✗ {results['failed']} CHECKS FAILED - REVIEW ABOVE FOR DETAILS{END}\n")
    overall_status = "NEEDS ATTENTION"

print(f"{BOLD}Overall Status: {overall_status}{END}")
print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
