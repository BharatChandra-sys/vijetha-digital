"""
Integration tests for auth endpoints — uses TestClient with DB override.
"""
import pytest


class TestRegisterEndpoint:
    def test_register_success(self, client):
        resp = client.post("/auth/register", json={
            "name": "New User",
            "email": "newuser@example.com",
            "password": "Password1!",
        })
        assert resp.status_code in (200, 201), resp.text
        data = resp.json()
        assert "user_id" in data or "message" in data

    def test_register_duplicate_email(self, client):
        payload = {"name": "Dup", "email": "dup@example.com", "password": "Password1!"}
        client.post("/auth/register", json=payload)
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 409

    def test_register_missing_fields(self, client):
        resp = client.post("/auth/register", json={"email": "x@x.com"})
        assert resp.status_code == 422


class TestLoginEndpoint:
    def test_login_wrong_password(self, client):
        client.post("/auth/register", json={
            "name": "Login Test",
            "email": "logintest@example.com",
            "password": "Correct1!",
        })
        resp = client.post("/auth/login", json={
            "email": "logintest@example.com",
            "password": "WrongPass1!",
        })
        assert resp.status_code == 401

    def test_login_nonexistent_user(self, client):
        resp = client.post("/auth/login", json={
            "email": "nobody@example.com",
            "password": "Whatever1!",
        })
        assert resp.status_code == 401


class TestProfileEndpoint:
    def test_get_profile_requires_auth(self, client):
        resp = client.get("/auth/me")
        assert resp.status_code == 401

    def test_get_profile_authenticated(self, auth_client):
        resp = auth_client.get("/auth/me")
        assert resp.status_code == 200
        data = resp.json()
        assert "email" in data
        assert "role" in data


class TestRefreshEndpoint:
    def test_refresh_missing_token(self, client):
        resp = client.post("/auth/refresh", json={})
        assert resp.status_code == 400

    def test_refresh_invalid_token(self, client):
        resp = client.post("/auth/refresh", json={"refresh_token": "bad.token.here"})
        assert resp.status_code == 401
