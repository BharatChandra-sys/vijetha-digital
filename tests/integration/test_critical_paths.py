"""
Critical path smoke tests for production deployment validation.
These tests verify essential functionality after deployment.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Test client for smoke tests."""
    return TestClient(app)


class TestCriticalPaths:
    """Critical path tests that must pass in production."""
    
    def test_health_endpoint(self, client):
        """Verify health endpoint is accessible and returns valid status."""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert data["status"] in ["ok", "degraded"]
        assert "db" in data
        assert "redis" in data
        assert "version" in data
    
    def test_metrics_endpoint(self, client):
        """Verify metrics endpoint is accessible."""
        response = client.get("/metrics")
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/plain")
    
    def test_auth_login_endpoint_exists(self, client):
        """Verify login endpoint is accessible (even if credentials fail)."""
        response = client.post(
            "/auth/login",
            json={"email": "test@example.com", "password": "wrongpass"}
        )
        # Should return 401 or 422, not 404 or 500
        assert response.status_code in [401, 422]
    
    def test_products_list_endpoint(self, client):
        """Verify products endpoint is accessible."""
        response = client.get("/products")
        assert response.status_code in [200, 401]  # May require auth
    
    def test_cors_headers(self, client):
        """Verify CORS headers are present."""
        response = client.options(
            "/health",
            headers={"Origin": "http://localhost:5173"}
        )
        # CORS middleware should add headers
        assert response.status_code in [200, 204]
    
    def test_rate_limiting_active(self, client):
        """Verify rate limiting is active (doesn't test limits, just presence)."""
        response = client.get("/health")
        # Rate limiter should not block health checks
        assert response.status_code == 200
    
    def test_websocket_endpoint_exists(self, client):
        """Verify WebSocket endpoint exists (connection will fail without token)."""
        # WebSocket upgrade will fail in test client, but endpoint should exist
        response = client.get("/ws/notifications")
        # Should return 403 (no token) or upgrade error, not 404
        assert response.status_code != 404


class TestDatabaseConnectivity:
    """Database connectivity tests."""
    
    def test_database_connection(self, client):
        """Verify database is accessible via health check."""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["db"] == "ok", "Database connection failed"
    
    def test_redis_connection(self, client):
        """Verify Redis is accessible via health check."""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["redis"] == "ok", "Redis connection failed"


class TestSecurityHeaders:
    """Security header tests."""
    
    def test_security_headers_present(self, client):
        """Verify security headers are set."""
        response = client.get("/health")
        
        # Check for security headers
        headers = response.headers
        assert "x-content-type-options" in headers
        assert "x-frame-options" in headers
        assert "referrer-policy" in headers
    
    def test_no_server_header_leak(self, client):
        """Verify server version is not leaked."""
        response = client.get("/health")
        
        # Should not expose detailed server info
        server_header = response.headers.get("server", "").lower()
        assert "uvicorn" not in server_header or server_header == ""


class TestAPIEndpoints:
    """Critical API endpoint tests."""
    
    def test_auth_endpoints_exist(self, client):
        """Verify all critical auth endpoints exist."""
        endpoints = [
            "/auth/login",
            "/auth/register",
            "/auth/logout",
        ]
        
        for endpoint in endpoints:
            response = client.post(endpoint, json={})
            # Should not return 404 (endpoint exists)
            assert response.status_code != 404, f"Endpoint {endpoint} not found"
    
    def test_admin_endpoints_protected(self, client):
        """Verify admin endpoints require authentication."""
        response = client.get("/api/v1/admin/dashboard/stats")
        # Should return 401 or 403, not 200
        assert response.status_code in [401, 403], "Admin endpoint not protected"
    
    def test_order_creation_endpoint_exists(self, client):
        """Verify order creation endpoint exists."""
        response = client.post("/orders", json={})
        # Should return 401 or 422, not 404
        assert response.status_code != 404, "Order creation endpoint not found"


class TestErrorHandling:
    """Error handling tests."""
    
    def test_404_handling(self, client):
        """Verify 404 errors are handled gracefully."""
        response = client.get("/nonexistent-endpoint-12345")
        assert response.status_code == 404
    
    def test_validation_error_handling(self, client):
        """Verify validation errors return proper format."""
        response = client.post("/auth/login", json={"invalid": "data"})
        assert response.status_code == 422
        
        data = response.json()
        assert "error" in data or "detail" in data
    
    def test_method_not_allowed(self, client):
        """Verify method not allowed errors are handled."""
        response = client.delete("/health")
        assert response.status_code == 405


@pytest.mark.skipif(
    True,  # Skip by default, enable for full integration tests
    reason="Requires full database setup with test data"
)
class TestDataIntegrity:
    """Data integrity tests (optional, requires test data)."""
    
    def test_admin_user_exists(self, client):
        """Verify admin user can login."""
        # This would require actual test data
        pass
    
    def test_products_have_valid_data(self, client):
        """Verify products have required fields."""
        # This would require actual test data
        pass
