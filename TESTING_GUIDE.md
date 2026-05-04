# Testing Guide - Vijetha Digital Backend

Complete guide for testing the Vijetha Digital printing shop backend.

## Quick Start

### 1. Setup Test Environment
```bash
# Copy test environment template
cp .env.test.example .env.test

# Edit with your test credentials
nano .env.test
```

### 2. Install Dependencies
```bash
pip install -r requirements-pinned.txt
```

### 3. Run Tests
```bash
# Run all pytest tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run manual tests (server must be running)
python tests/manual/test_auth_endpoints.py
```

---

## Test Structure

```
tests/
├── README.md                    # Test suite documentation
├── conftest.py                  # Pytest configuration & fixtures
├── unit/                        # Unit tests (isolated)
├── integration/                 # Integration tests (end-to-end)
├── manual/                      # Manual test scripts
│   ├── README.md               # Manual tests documentation
│   ├── test_login.py           # Login endpoint test
│   ├── test_logout.py          # Logout & token blacklist test
│   ├── test_auth_endpoints.py  # Comprehensive auth tests
│   ├── test_cors.py            # CORS headers test
│   └── test_stress.py          # Rate limiter stress test
├── test_auth_api.py            # Auth API tests
├── test_security.py            # Security tests
├── test_iam_system.py          # IAM system tests
└── test_exceptions.py          # Exception handling tests
```

---

## Test Types

### 1. Pytest Tests (Automated)

**Location**: `tests/*.py`, `tests/unit/`, `tests/integration/`

**Purpose**: Automated testing for CI/CD, regression testing, code coverage

**Run**:
```bash
# All tests
pytest tests/ -v

# Specific file
pytest tests/test_auth_api.py -v

# Specific test
pytest tests/test_auth_api.py::test_login -v

# With coverage
pytest tests/ --cov=app --cov-report=term-missing
```

**Features**:
- Uses fixtures from `conftest.py`
- Automatic database rollback after each test
- Mocked external services
- Fast execution

**Example**:
```python
def test_create_order(auth_client):
    """Test order creation"""
    response = auth_client.post("/orders", json={
        "items": [{"product_id": 1, "quantity": 2}]
    })
    assert response.status_code == 201
    assert "id" in response.json()
```

---

### 2. Manual Tests (Interactive)

**Location**: `tests/manual/`

**Purpose**: Quick debugging, visual inspection, demonstration

**Run**:
```bash
# Start server first
python -m uvicorn app.main:app --reload

# In another terminal, run tests
python tests/manual/test_login.py
python tests/manual/test_auth_endpoints.py
python tests/manual/test_stress.py
```

**Features**:
- Standalone Python scripts
- Colored output for readability
- Detailed response logging
- Test against running server

**Example**:
```python
import os
import requests
from dotenv import load_dotenv

load_dotenv(".env.test")

BASE_URL = os.getenv("TEST_API_BASE_URL", "http://127.0.0.1:8000")

response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": os.getenv("TEST_ADMIN_EMAIL"),
    "password": os.getenv("TEST_ADMIN_PASSWORD")
})

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

---

## Environment Configuration

### .env.test File

Create `.env.test` from the example:

```bash
cp .env.test.example .env.test
```

**Required variables**:
```env
# Admin credentials
TEST_ADMIN_EMAIL=admin@vijetha.com
TEST_ADMIN_PASSWORD=admin123

# Regular user credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=SecureTest123!

# API configuration
TEST_API_BASE_URL=http://127.0.0.1:8000

# Database
TEST_DATABASE_URL=postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_db
```

**Security**:
- ✅ `.env.test` is in `.gitignore` (never committed)
- ✅ `.env.test.example` is committed (template only)
- ✅ All tests load from `.env.test` (no hardcoded credentials)

---

## Available Fixtures

From `tests/conftest.py`:

### `db_session`
Database session with automatic rollback after test.

```python
def test_user_creation(db_session):
    user = User(email="test@example.com", ...)
    db_session.add(user)
    db_session.commit()
    # Automatically rolled back after test
```

### `client`
Unauthenticated TestClient for public endpoints.

```python
def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
```

### `auth_client`
TestClient authenticated as regular customer.

```python
def test_get_my_orders(auth_client):
    response = auth_client.get("/orders")
    assert response.status_code == 200
```

### `admin_client`
TestClient authenticated as admin user.

```python
def test_admin_dashboard(admin_client):
    response = admin_client.get("/admin/dashboard")
    assert response.status_code == 200
```

---

## Running Tests

### Local Development

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html

# Run specific category
pytest tests/unit/ -v
pytest tests/integration/ -v

# Run tests matching pattern
pytest tests/ -k "auth" -v

# Run failed tests only
pytest tests/ --lf

# Stop on first failure
pytest tests/ -x
```

### Manual Testing

```bash
# Terminal 1: Start server
python -m uvicorn app.main:app --reload

# Terminal 2: Run manual tests
python tests/manual/test_login.py
python tests/manual/test_logout.py
python tests/manual/test_auth_endpoints.py
python tests/manual/test_cors.py
python tests/manual/test_stress.py
```

### CI/CD (GitHub Actions)

Tests run automatically on:
- Push to main branch
- Pull requests
- Manual workflow dispatch

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    pytest tests/ -v --cov=app --cov-report=xml
```

---

## Test Coverage

### Current Coverage

Check coverage:
```bash
pytest tests/ --cov=app --cov-report=term-missing
```

### Coverage Goals

- **Overall**: >80%
- **Critical paths** (auth, payments, orders): >90%
- **Business logic**: >85%
- **API endpoints**: >80%

### Generate HTML Report

```bash
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html
```

---

## Writing New Tests

### Pytest Test Template

```python
"""
Test module description
"""
import pytest
from tests.conftest import requires_db

@requires_db
def test_something(auth_client):
    """Test description"""
    # Arrange
    data = {"key": "value"}
    
    # Act
    response = auth_client.post("/endpoint", json=data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["key"] == "value"
```

### Manual Test Template

```python
"""
Manual test description
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv(".env.test")

BASE_URL = os.getenv("TEST_API_BASE_URL", "http://127.0.0.1:8000")

def test_something():
    """Test description"""
    print("Testing something...")
    
    response = requests.get(f"{BASE_URL}/endpoint")
    
    if response.status_code == 200:
        print("✓ Test passed")
        print(f"Response: {response.json()}")
    else:
        print("✗ Test failed")
        print(f"Status: {response.status_code}")

if __name__ == "__main__":
    try:
        test_something()
    except Exception as e:
        print(f"Error: {e}")
```

---

## Common Test Scenarios

### Test Authentication

```python
def test_login_success(client):
    """Test successful login"""
    response = client.post("/auth/login", json={
        "email": "admin@vijetha.com",
        "password": "admin123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    """Test login with wrong password"""
    response = client.post("/auth/login", json={
        "email": "admin@vijetha.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
```

### Test Authorization

```python
def test_admin_only_endpoint(client, admin_client):
    """Test admin-only endpoint"""
    # Unauthenticated - should fail
    response = client.get("/admin/users")
    assert response.status_code == 401
    
    # Authenticated as admin - should work
    response = admin_client.get("/admin/users")
    assert response.status_code == 200
```

### Test Database Operations

```python
def test_create_and_retrieve(db_session):
    """Test creating and retrieving a record"""
    # Create
    user = User(email="test@example.com", full_name="Test User")
    db_session.add(user)
    db_session.commit()
    
    # Retrieve
    retrieved = db_session.query(User).filter_by(email="test@example.com").first()
    assert retrieved is not None
    assert retrieved.full_name == "Test User"
```

### Test Error Handling

```python
def test_validation_error(client):
    """Test validation error response"""
    response = client.post("/orders", json={
        "items": []  # Empty items should fail
    })
    assert response.status_code == 422
    assert "detail" in response.json()
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string
cat .env.test | grep DATABASE_URL

# Test connection
psql -U postgres -d vijetha_db -c "SELECT 1;"
```

### Import Errors

```bash
# Install dependencies
pip install -r requirements-pinned.txt

# Install in development mode
pip install -e .

# Check Python path
python -c "import sys; print('\n'.join(sys.path))"
```

### Server Not Running (Manual Tests)

```bash
# Check if server is running
curl http://localhost:8000/health

# Start server
python -m uvicorn app.main:app --reload

# Check port
lsof -i :8000
```

### Environment Variables Not Loading

```bash
# Check .env.test exists
ls -la .env.test

# Verify content
cat .env.test

# Test loading
python -c "from dotenv import load_dotenv; import os; load_dotenv('.env.test'); print(os.getenv('TEST_ADMIN_EMAIL'))"
```

### Tests Failing After Code Changes

```bash
# Run specific failing test with verbose output
pytest tests/test_auth_api.py::test_login -vv

# Check for database migrations
alembic upgrade head

# Clear pytest cache
rm -rf .pytest_cache
pytest tests/ -v
```

---

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use fixtures with rollback for database tests
- Don't rely on test execution order

### 2. Clear Naming
```python
# Good
def test_user_cannot_access_admin_endpoint():
    ...

# Bad
def test_endpoint():
    ...
```

### 3. One Assertion Per Test
```python
# Good
def test_login_returns_access_token(client):
    response = client.post("/auth/login", json=credentials)
    assert "access_token" in response.json()

def test_login_returns_user_info(client):
    response = client.post("/auth/login", json=credentials)
    assert "user" in response.json()

# Bad
def test_login(client):
    response = client.post("/auth/login", json=credentials)
    assert "access_token" in response.json()
    assert "user" in response.json()
    assert response.status_code == 200
```

### 4. Use Descriptive Assertions
```python
# Good
assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

# Bad
assert response.status_code == 200
```

### 5. Mock External Services
```python
from unittest.mock import patch

def test_payment_processing(auth_client):
    with patch('app.services.payment_service.razorpay_client') as mock_razorpay:
        mock_razorpay.payment.capture.return_value = {"status": "captured"}
        
        response = auth_client.post("/payments/capture", json={"payment_id": "pay_123"})
        assert response.status_code == 200
```

### 6. Keep Tests Fast
- Unit tests: <100ms each
- Integration tests: <1s each
- Use mocks for slow operations

### 7. Document Complex Tests
```python
def test_complex_order_workflow(auth_client, db_session):
    """
    Test complete order workflow:
    1. Create order with multiple items
    2. Apply coupon discount
    3. Process payment
    4. Verify order status
    5. Check inventory deduction
    """
    # Test implementation...
```

---

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/14/orm/session_transaction.html)
- [Requests Library](https://requests.readthedocs.io/)
- [Python Dotenv](https://pypi.org/project/python-dotenv/)

---

## Summary

### For Quick Testing
```bash
# Run all automated tests
pytest tests/ -v

# Run manual test suite
python tests/manual/test_auth_endpoints.py
```

### For Development
```bash
# Run tests with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test during debugging
pytest tests/test_auth_api.py::test_login -vv
```

### For CI/CD
```bash
# Run all tests with coverage report
pytest tests/ -v --cov=app --cov-report=xml
```

---

**Need help?** Check the detailed documentation:
- `tests/README.md` - Full test suite documentation
- `tests/manual/README.md` - Manual test scripts guide
