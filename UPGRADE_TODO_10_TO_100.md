# Vijetha Digital 10->100 Upgrade TODO (No Feature Deletions)

Goal: upgrade architecture and production readiness while preserving all existing behavior and routes.

Execution policy:
- Keep legacy endpoints working until replacement endpoints are fully tested.
- Add new modules side-by-side first, then switch imports/router wiring.
- Use feature flags or compatibility shims for risky changes.

## 0) Quick Audit Summary (Current Repo)

Already present (partial):
- Auth/login/logout/reset flows exist
- Orders/products/payments/reviews APIs exist
- Alembic migrations exist
- Rate limiter middleware exists
- Dockerfile and docker-compose exist

Major gaps vs MasterPlan:
- DB stack is sync (psycopg2 + sync Session), not async asyncpg
- No app/core/dependencies.py, app/core/exceptions.py
- Missing models: mixins, business profile, address, order file/timeline, notification, coupon, audit log
- Missing schemas: common/business/payment/coupon/admin order views
- Services not fully modularized for plan-level responsibilities
- No .github/workflows CI/CD
- tests are very limited for auth/orders/payments/admin/business
- Empty Makefile and empty pre-commit config

## Completed In This Pass

- [x] Added `app/core/dependencies.py`
- [x] Added `app/core/exceptions.py`
- [x] Added `app/models/mixins.py`
- [x] Added model scaffolds: business profile, address, notification, coupon, audit log, order file, order timeline
- [x] Registered new model imports in `app/models/__init__.py`
- [x] Added staged sync+async DB session support in `app/db/session.py`
- [x] Expanded `app/core/config.py` for production-oriented env contract
- [x] Added `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`
- [x] Populated `Makefile`
- [x] Populated `.pre-commit-config.yaml`
- [x] Added `scripts/seed_admin.py`
- [x] Added initial tests for new foundation utilities
- [x] Added employee pages: `StaffNotifications` and `StaffSchedule` and wired routes/navigation

## 1) Foundation Upgrade (Phase 1)

### 1.1 Config hardening
- [x] Upgrade app/core/config.py to complete MasterPlan env contract
- [x] Add JWT/access/refresh expiries, email token expiries, S3/AWS, mail, redis, sentry, GST/min order/file rules
- [x] Add FIRST_ADMIN_* fields and keep existing ADMIN_* as fallback compatibility
- [x] Ensure .env.example includes all new fields

### 1.2 Security utilities
- [x] Expand app/core/security.py with:
  - [x] is_strong_password
  - [x] create_access_token(subject, extra_claims)
  - [x] create_refresh_token with jti
  - [x] decode_token
  - [x] email verification token helpers
  - [x] password reset token helpers
- [ ] Keep existing token functions as compatibility wrappers until callers are migrated

### 1.3 Async DB session migration (non-breaking)
- [x] Introduce async engine/session in app/db/session.py (asyncpg)
- [ ] Keep legacy sync session helper temporarily under a separate module
- [x] Add transaction-safe get_db with commit/rollback behavior
- [ ] Migrate one router/service area at a time to async

### 1.4 Dependencies module
- [x] Create app/core/dependencies.py with:
  - [ ] get_current_user with token blacklist check in Redis
  - [x] get_current_active_user
  - [x] require_role, require_admin, require_business
  - [x] get_pagination
- [ ] Gradually replace imports from app/core/deps.py and app/api/auth/dependencies.py

### 1.5 Exceptions module
- [x] Create app/core/exceptions.py with all plan exception classes
- [x] Refactor services to raise AppException hierarchy (no raw HTTPException inside services) — auth_service done
- [ ] Keep HTTP mapping in global exception handlers

### 1.6 main.py refactor
- [ ] Convert startup/shutdown to lifespan handlers
- [ ] Add middleware order as per plan (Sentry -> CORS -> TrustedHost -> logging -> rate limit)
- [ ] Add centralized exception handlers
- [ ] Ensure single router registration path and remove duplicate include_router calls
- [ ] Add robust /health with db + redis status fields

## 2) Data Model Completion (Phase 2)

### 2.1 Core mixins
- [x] Create app/models/mixins.py (UUIDMixin, TimestampMixin, SoftDeleteMixin)

### 2.2 New models to add
- [x] business_profile.py
- [x] address.py
- [x] order_file.py
- [x] order_timeline.py
- [x] notification.py
- [x] coupon.py
- [x] audit_log.py

### 2.3 Existing model upgrades
- [x] product.py: slug, specification options, turnaround options, SEO tags
- [ ] user.py: account status, verification timestamps, security tracking, preferences, relations
- [ ] order.py: richer status machine, delivery/tracking/audit timestamps, business order fields
- [ ] order_item.py: product snapshots + print specs + custom specs
- [ ] payment.py: full Razorpay/refund lifecycle fields
- [ ] review.py: moderation flags and relations

### 2.4 Migration discipline
- [x] Generated incremental alembic revision: add_product_slug_seo_fields (also picks up new model tables)
- [ ] Add data backfill scripts where new non-null fields are introduced
- [ ] Maintain backward-compatible defaults for existing rows

## 3) Schema Completion (Phase 3)

- [x] Create app/schemas/common.py (paginated/message/error)
- [ ] Expand auth schemas for refresh/verify/reset/change flows
- [ ] Expand user/admin user view schemas
- [ ] Add business schemas
- [ ] Add product calculate-price request/response schemas
- [ ] Expand order schemas (status update/admin order view/timeline)
- [ ] Add payment schemas (create/verify/refund)

## 4) Service Layer Completion (Phase 4)

### 4.1 Auth service
- [ ] Move to full token lifecycle with Redis jti store + access blacklist
- [ ] Add login lockout policy and failed attempt counters
- [ ] Add verify_email, forgot_password, reset_password, change_password workflows

### 4.2 User/business services
- [ ] Create/upgrade user_service and business_service according to plan
- [ ] Add business verification workflow and admin approval/rejection

### 4.3 Product/pricing services
- [ ] Ensure pricing_service is canonical for all price calculations
- [ ] Add quantity breaks + business-tier discounts + coupon interactions

### 4.4 Order service (critical)
- [ ] Implement draft -> submit -> payment -> fulfillment transitions with strict map validation
- [ ] Add timeline records on every status transition
- [ ] Add admin notes + tracking updates + transition audit logs
- [ ] Add invoice generation storage via OrderFile

### 4.5 Payment service
- [ ] Complete signature/webhook/refund flow with idempotency checks
- [ ] Link payment status transitions to order status transitions safely

### 4.6 File/email/notification/coupon/admin services
- [ ] file_service with file validation and S3 upload/presigned URLs
- [ ] email_service with templates and background sending
- [ ] notification_service with DB + Redis pub/sub + read/unread APIs
- [ ] coupon_service validation/usage/stats
- [ ] admin_service dashboard metrics and exports

## 5) API Completion (Phase 5)

### 5.1 Auth/User/Business
- [ ] Add missing endpoints from plan while keeping existing endpoints active
- [ ] Mark legacy endpoints as deprecated after new routes are verified

### 5.2 Products/Orders/Payments/Coupons
- [ ] Add calculate-price endpoint behavior parity with pricing service
- [ ] Add order files, timeline, cancel, review, invoice streaming
- [ ] Add payment create/verify/webhook retrieval endpoints
- [ ] Add coupon validate endpoint

### 5.3 Admin APIs
- [ ] Dashboard/reports exports
- [ ] Full order moderation/status/refund APIs
- [ ] User and business verification management
- [ ] Product and coupon moderation APIs
- [ ] Review moderation APIs

### 5.4 WebSocket
- [ ] Add notifications websocket endpoint with token auth

## 6) Infra and Production Hardening (Phase 6)

- [ ] Complete SlowAPI route-level limits exactly as plan
- [ ] Create app/middleware/logging.py with request-id and response-time headers
- [ ] Update alembic env for full model import coverage and migration safety
- [x] Add scripts/seed_admin.py for idempotent bootstrap
- [ ] Add celery worker/beat tasks and schedules
- [ ] Upgrade Dockerfile to multi-stage and add compose services (api, worker, beat, flower, db, redis, nginx)
- [ ] Add nginx config for HTTPS, websocket upgrades, upload size
- [x] Add GitHub Actions: lint/test/coverage and deploy workflow
- [ ] Add Prometheus metrics endpoint and Sentry integration hooks

## 7) Testing Expansion (Phase 7)

- [ ] Rework tests/conftest.py for isolated test DB + dependency overrides
- [ ] Unit tests: security, pricing, coupon
- [ ] Integration tests: auth, orders, payments, admin orders, business verification, products, notifications
- [ ] Add minimum coverage gate in CI

## 8) Safe Cleanup (Phase 8)

Do not delete features now; deprecate first:
- [ ] Move ad-hoc scripts/docs into docs/archive with migration notes
- [ ] Replace root ad-hoc test scripts with pytest coverage equivalents
- [x] Fill Makefile with dev/test/migrate/seed/docker/lint tasks
- [x] Fill .pre-commit-config.yaml (black/isort/flake8/mypy)

## 9) Suggested Execution Sprints (Practical)

Sprint A (Foundation):
- [ ] config + security + dependencies + exceptions + main lifespan

Sprint B (Data):
- [ ] model additions + alembic revisions + backfills

Sprint C (Core flows):
- [ ] auth token lifecycle + order transition engine + payment webhook idempotency

Sprint D (Business/admin):
- [ ] business verification + admin dashboard/report APIs + coupons

Sprint E (Ops):
- [ ] CI/CD + celery + metrics + hardened docker/nginx

Sprint F (Quality):
- [ ] complete test matrix + deprecate legacy endpoints/scripts safely

## 10) Non-Deletion Compatibility Checklist

- [ ] Keep current route prefixes and response shapes where frontend depends on them
- [ ] Add versioned/extended endpoints instead of replacing in place when risky
- [ ] Keep legacy token decode path until all clients use new claims
- [ ] Keep current sync DB path temporarily while async migration is phased
- [ ] Add migration/rollback notes per release

---
Owner note: This backlog is intentionally upgrade-first. Nothing here requires removing existing working features; changes are additive, staged, and backward compatible until cutover.