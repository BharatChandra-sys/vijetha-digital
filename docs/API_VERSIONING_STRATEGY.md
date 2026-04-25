# API Versioning Strategy

## Overview

This document outlines the API versioning strategy for Vijetha Digital to ensure backward compatibility and smooth transitions for clients.

## Current Status

- **Current Version**: v1
- **Base Path**: `/api/v1/`
- **Legacy Endpoints**: Direct paths (e.g., `/orders`, `/products`)

## Versioning Approach

### 1. URL Path Versioning

We use URL path versioning for major API changes:

```
/api/v1/orders      # Version 1
/api/v2/orders      # Version 2 (future)
```

### 2. Backward Compatibility Rules

#### Breaking Changes (Require New Version)
- Removing fields from responses
- Changing field types
- Removing endpoints
- Changing authentication methods
- Modifying error response formats

#### Non-Breaking Changes (Same Version)
- Adding new optional fields
- Adding new endpoints
- Adding new query parameters (optional)
- Deprecating fields (with warning headers)
- Performance improvements

### 3. Deprecation Process

When deprecating an endpoint or field:

1. **Announce** (3 months before removal)
   - Add deprecation notice to API docs
   - Add `Deprecation` header to responses
   - Send email to API consumers

2. **Warn** (1 month before removal)
   - Add `Sunset` header with removal date
   - Log warnings for deprecated endpoint usage
   - Update documentation

3. **Remove** (After deprecation period)
   - Remove endpoint in new major version
   - Keep old version running for 6 months
   - Redirect to new endpoint with 301

### 4. Response Headers

All API responses include versioning headers:

```http
X-API-Version: 1.0.0
X-API-Deprecated: false
X-API-Sunset: 2025-12-31  # If deprecated
```

### 5. Version Support Policy

- **Current Version**: Full support, all features
- **Previous Version**: Security updates only (6 months)
- **Older Versions**: No support, recommend upgrade

## Implementation

### Current Endpoints

#### Legacy (No Version Prefix)
```
GET  /orders
POST /orders
GET  /products
POST /auth/login
```

**Status**: Maintained for backward compatibility
**Recommendation**: Migrate to `/api/v1/` endpoints

#### Version 1 (Recommended)
```
GET  /api/v1/admin/orders
GET  /api/v1/admin/users
GET  /api/v1/admin/dashboard/stats
```

**Status**: Current, fully supported
**Features**: All new features

### Migration Path

#### Phase 1: Dual Support (Current)
- Legacy endpoints remain active
- New endpoints under `/api/v1/`
- Both return same data

#### Phase 2: Deprecation Warnings (3 months)
- Add deprecation headers to legacy endpoints
- Update documentation
- Notify API consumers

#### Phase 3: Redirect (6 months)
- Legacy endpoints return 301 redirect
- Include `Location` header to new endpoint
- Still functional

#### Phase 4: Removal (12 months)
- Legacy endpoints return 410 Gone
- Only `/api/v1/` endpoints active

## Version 2 Planning

### Potential Changes for v2

1. **Unified Response Format**
   ```json
   {
     "data": {...},
     "meta": {
       "version": "2.0.0",
       "timestamp": "2024-01-01T00:00:00Z"
     }
   }
   ```

2. **Consistent Error Format**
   ```json
   {
     "error": {
       "code": "ORDER_NOT_FOUND",
       "message": "Order not found",
       "details": {...}
     }
   }
   ```

3. **GraphQL Support**
   - Add `/api/v2/graphql` endpoint
   - Maintain REST for simple operations

4. **Async Operations**
   - Long-running operations return job ID
   - Poll `/api/v2/jobs/{id}` for status

## Client Migration Guide

### For Frontend Developers

1. **Check Current Usage**
   ```javascript
   // Old (deprecated)
   fetch('/orders')
   
   // New (recommended)
   fetch('/api/v1/admin/orders')
   ```

2. **Update Base URL**
   ```javascript
   const API_BASE = '/api/v1';
   ```

3. **Handle Version Headers**
   ```javascript
   const response = await fetch('/api/v1/orders');
   const version = response.headers.get('X-API-Version');
   const deprecated = response.headers.get('X-API-Deprecated');
   ```

### For Mobile Apps

1. **Version in Config**
   ```kotlin
   const val API_VERSION = "v1"
   const val BASE_URL = "https://api.vijetha.com/api/$API_VERSION"
   ```

2. **Version Checking**
   ```kotlin
   if (response.headers["X-API-Deprecated"] == "true") {
       showUpdateDialog()
   }
   ```

## Testing Strategy

### Version Compatibility Tests

```python
def test_v1_backward_compatibility():
    """Ensure v1 endpoints maintain compatibility."""
    response = client.get("/api/v1/orders")
    assert "id" in response.json()[0]
    assert "status" in response.json()[0]
    # All expected fields present

def test_legacy_endpoint_redirect():
    """Ensure legacy endpoints redirect properly."""
    response = client.get("/orders", follow_redirects=False)
    assert response.status_code == 301
    assert "/api/v1/orders" in response.headers["Location"]
```

## Monitoring

### Metrics to Track

1. **Version Usage**
   - Requests per version
   - Unique clients per version
   - Deprecated endpoint usage

2. **Migration Progress**
   - % of traffic on latest version
   - Clients still using deprecated endpoints

3. **Error Rates**
   - Errors by version
   - Breaking change detection

### Alerts

- Alert when deprecated endpoint usage increases
- Alert when old version traffic > 20%
- Alert on version-specific error spikes

## Documentation

### API Docs Structure

```
/docs/api/
  ├── v1/
  │   ├── authentication.md
  │   ├── orders.md
  │   ├── products.md
  │   └── admin.md
  ├── v2/  # Future
  └── migration-guides/
      └── v1-to-v2.md
```

### Changelog

Maintain detailed changelog:

```markdown
## v1.2.0 (2024-01-15)
### Added
- New `/api/v1/admin/dashboard/stats` endpoint
- Business verification workflow

### Deprecated
- `/orders` (use `/api/v1/admin/orders`)

### Fixed
- Order status transition validation
```

## Best Practices

### For API Developers

1. **Always Add, Never Remove**
   - Add new fields as optional
   - Keep old fields until next major version

2. **Use Feature Flags**
   - Test new features behind flags
   - Gradual rollout to users

3. **Document Everything**
   - Every change in changelog
   - Migration guides for breaking changes

4. **Communicate Early**
   - Announce deprecations 3+ months ahead
   - Provide migration examples

### For API Consumers

1. **Use Latest Version**
   - Always use `/api/v1/` endpoints
   - Monitor deprecation headers

2. **Handle Errors Gracefully**
   - Check for version mismatch errors
   - Implement retry logic

3. **Test Regularly**
   - Test against staging API
   - Monitor for deprecation warnings

## Future Considerations

### Version 3 (2025+)

Potential features:
- Full async/await support
- WebSocket-first for real-time data
- GraphQL as primary interface
- gRPC for internal services
- OpenAPI 3.1 specification

### Long-term Strategy

- Major version every 12-18 months
- Support 2 major versions simultaneously
- Automated migration tools
- Version negotiation via headers

## Contact

For questions about API versioning:
- Email: api@vijetha.com
- Slack: #api-versioning
- Docs: https://docs.vijetha.com/api/versioning

---

**Last Updated**: 2024-01-01  
**Version**: 1.0  
**Status**: Active
