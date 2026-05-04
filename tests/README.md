# Test Suite Organization

This directory contains all tests for the Vijetha Digital Backend.

## Directory Structure

```
tests/
├── conftest.py              # Pytest configuration and fixtures
├── unit/                    # Unit tests (isolated component tests)
├── integration/             # Integration tests (multiple components)
├── manual/                  # Manual test scripts (run directly with Python)
│   ├── test_login.py       # Test login endpoint with multiple URLs
│   ├── test_login_quick.py # Quick login test
│   ├── test_logout.py      # Test logout and token blacklist
│   ├── test_cors.py        # Test CORS headers
│   ├── test_stress.py      # Stress test rate limiter
│   └── test_auth_endpoints.py  # Comprehensive auth endpoint tests
├── test_auth_api.py        # Auth API tests (pytest)
├── test_exceptions.py      # Exception handling tests
├── test_iam_system.py      # IAM system tests
├── test_iam_readiness_service.py  # IAM readiness tests
├── test_pagination_dependency.py  # Pagination tests
└── test_security.py        # Security tests

```

## Test Types

### 1. Unit Tests (`unit/`)
- Test individual functions and classes in isolation
- Fast execution
- No external dependencies (mocked)
- Run with: `pytest tests/unit/ -v`

### 2. Integration Tests (`integration/`)
- Test multiple components working together
- May use real database connections
- Test API endpoints end-to-end
- Run with: `pytest tests/integration/ -v`

### 3. Manual Tests (`manual/`)
- Standalone Python scripts
- Test against running server
- Useful for debugging and manual verification
- Run directly: `python tests/manual/test_login.py`

## Running Tests

### Run All Tests
```bash
pytest tests/ -v
```

### Run Specific Test Category
```bash
# Unit tests only
pytest tests/unit/ -v

# Integration tests only
pytest tests/integration/ -v

# Specific test file
pytest tests/test_auth_api.py -v

# Specific test function
pytest tests/test_auth_api.py::test_login -v
```

### Run Manual Tests
```bash
# Make sure server is running first
python -m uvicorn app.main:app --reload

# In another terminal, run manual tests
python tests/manual/test_login.py
python tests/manual/test_auth_endpoints.py
python tests/manual/test_stress.py
```

### Run with Coverage
```bash
pytest tests/ --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

## Environment Setup

### For Pytest Tests
Tests use `tests/conftest.py` which loads environment variables from `.env.test`:

```bash
# Copy example file
cp .env.test.example .env.test

# Edit with your test credentials
nano .env.test
```

### For Manual Tests
Manual tests also load from `.env.test`:

```env
TEST_ADMIN_EMAIL=admin@vijetha.com
TEST_ADMIN_PASSWORD=admin123
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=SecureTest123!
TEST_API_BASE_URL=http://127.0.0.1:8000
TEST_DATABASE_URL=postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_db
```

## Test Fixtures

Available fixtures from `conftest.py`:

- `db_session` - Database session with rollback after test
- `client` - Unauthenticated TestClient
- `auth_client` - TestClient authenticated as customer
- `admin_client` - TestClient authenticated as admin

Example usage:
```python
def test_get_orders(auth_client):
    response = auth_client.get("/orders")
    assert response.status_code == 200
```

## Writing New Tests

### Unit Test Example
```python
# tests/unit/test_security.py
from app.core.security import hash_password, verify_password

def test_password_hashing():
    password = "SecurePass123!"
    hashed = hash_password(password)
    assert verify_password(password, hashed)
    assert not verify_password("WrongPass", hashed)
```

### Integration Test Example
```python
# tests/integration/test_orders.py
import pytest
from tests.conftest import requires_db

@requires_db
def test_create_order(auth_client):
    response = auth_client.post("/orders", json={
        "items": [{"product_id": 1, "quantity": 2}]
    })
    assert response.status_code == 201
    assert "id" in response.json()
```

### Manual Test Example
```python
# tests/manual/test_custom.py
import os
import requests
from dotenv import load_dotenv

load_dotenv(".env.test")

BASE_URL = os.getenv("TEST_API_BASE_URL", "http://127.0.0.1:8000")

def test_endpoint():
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_endpoint()
```

## CI/CD Integration

Tests run automatically on:
- Every push to main branch
- Every pull request
- Pre-commit hooks (optional)

GitHub Actions workflow:
```yaml
- name: Run tests
  run: |
    pytest tests/ -v --cov=app
```

## Test Coverage Goals

- **Overall**: >80%
- **Critical paths** (auth, payments, orders): >90%
- **Business logic**: >85%
- **API endpoints**: >80%

Check current coverage:
```bash
pytest tests/ --cov=app --cov-report=term-missing
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string in .env.test
cat .env.test | grep DATABASE_URL
```

### Import Errors
```bash
# Install test dependencies
pip install -r requirements-pinned.txt

# Install in development mode
pip install -e .
```

### Manual Tests Fail
```bash
# Ensure server is running
curl http://localhost:8000/health

# Check .env.test exists
ls -la .env.test

# Verify credentials
python -c "from dotenv import load_dotenv; import os; load_dotenv('.env.test'); print(os.getenv('TEST_ADMIN_EMAIL'))"
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use fixtures with rollback for database tests
3. **Naming**: Use descriptive test names (`test_user_cannot_access_admin_endpoint`)
4. **Assertions**: One logical assertion per test
5. **Mocking**: Mock external services (payment gateways, email, etc.)
6. **Speed**: Keep unit tests fast (<100ms each)
7. **Documentation**: Add docstrings to complex tests

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/14/orm/session_transaction.html)
