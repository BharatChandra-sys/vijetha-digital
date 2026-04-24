# Vijetha Digital Backend — 10 → 100 Master Plan for GitHub Copilot

## What This Repo Is
FastAPI + SQLAlchemy (async) + PostgreSQL + Razorpay printing shop backend.
Roles: Individual user / Business account / Admin.
Order lifecycle: PLACED → CONFIRMED → PRINTING → QUALITY_CHECK → SHIPPED → DELIVERED / CANCELLED / REFUNDED.

## What Exists (Current State — Incomplete)
- Partial auth (register/login — missing email verification, refresh tokens, logout blacklist)
- Basic user model (missing business profile, address, preferences)
- Basic order model (missing order items, file uploads, timeline/history)
- No payment service (Razorpay stubs only)
- No admin dashboard APIs
- No file upload system
- No email notifications
- No background jobs / Celery
- No rate limiting
- No tests
- No Docker / deployment config
- Frontend folder exists but has no real integration

---

## PHASE 1 — Fix Broken Foundation (Do First)

### 1.1 — Fix `app/core/config.py`
Use `pydantic-settings` `BaseSettings`. Every env var must come from here.
Add these missing vars:
```
JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, AWS_REGION, AWS_S3_BASE_URL
MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM, MAIL_SERVER, MAIL_PORT, MAIL_TLS
REDIS_URL
SENTRY_DSN
GST_PERCENTAGE (default 18.0)
MIN_ORDER_AMOUNT (default 100.0)
MAX_FILE_SIZE_MB (default 50)
ALLOWED_FILE_TYPES = ["pdf","jpg","jpeg","png","tiff","ai","psd","eps","cdr"]
FIRST_ADMIN_EMAIL, FIRST_ADMIN_PASSWORD, FIRST_ADMIN_NAME
```

### 1.2 — Fix `app/core/security.py`
Must have ALL of these functions:
- `hash_password(plain: str) -> str` — bcrypt
- `verify_password(plain: str, hashed: str) -> bool`
- `is_strong_password(password: str) -> bool` — min 8 chars, upper, lower, digit, special
- `create_access_token(subject: str, extra_claims: dict = None) -> str` — 30 min expiry
- `create_refresh_token(subject: str) -> str` — 7 day expiry, includes `jti` (UUID) for blacklisting
- `decode_token(token: str) -> dict` — raises JWTError on invalid
- `create_email_verification_token(email: str) -> str` — 24hr, signed with SECRET_KEY
- `create_password_reset_token(email: str) -> str` — 1hr, signed with SECRET_KEY
- `verify_special_token(token: str, token_type: str) -> str` — returns email or raises

### 1.3 — Fix `app/db/session.py`
Must use `create_async_engine` with `asyncpg`. Include:
- `engine` with `pool_size`, `max_overflow`, `pool_pre_ping=True`
- `AsyncSessionLocal = async_sessionmaker(...)`
- `Base = DeclarativeBase()`
- `async def get_db()` — yields session, commits on success, rolls back on error

### 1.4 — Create `app/core/dependencies.py` (MISSING — MUST CREATE)
```python
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    # decode token, check blacklist in Redis, load user from DB
    # raise 401 if invalid/expired/blacklisted

async def get_current_active_user(user: User = Depends(get_current_user)) -> User:
    # raise 403 if user.status != AccountStatus.ACTIVE

def require_role(*roles: UserRole):
    # returns a dependency that raises 403 if user.role not in roles

async def require_admin(user: User = Depends(get_current_active_user)) -> User:
    # shortcut for require_role(UserRole.ADMIN)

async def require_business(user: User = Depends(get_current_active_user)) -> User:
    # raise 403 if not business or admin

async def get_pagination(page: int = 1, page_size: int = 20) -> dict:
    # validate page >= 1, page_size 1-100, return {"skip": ..., "limit": ...}
```

### 1.5 — Create `app/core/exceptions.py` (MISSING — MUST CREATE)
Create these exception classes all inheriting from `AppException(Exception)`:
- `AppException(message, status_code=500, detail=None)`
- `NotFoundException(resource, identifier=None)` → 404
- `ConflictException(message)` → 409
- `UnauthorizedException(message)` → 401
- `ForbiddenException(message)` → 403
- `ValidationException(message, detail=None)` → 422
- `PaymentException(message, detail=None)` → 402
- `FileException(message)` → 400
- `RateLimitException()` → 429
- `OrderStateException(current, attempted)` → 400

### 1.6 — Fix `app/main.py`
Complete FastAPI app factory. Must include:
```python
app = FastAPI(title="Vijetha Digital API", version="2.0.0")

# Startup: init Redis, run DB migrations check, seed first admin
# Shutdown: close Redis pool

# Middleware (in this order):
# 1. Sentry (if SENTRY_DSN set)
# 2. CORSMiddleware — origins from settings.ALLOWED_HOSTS
# 3. TrustedHostMiddleware
# 4. Custom RequestLoggingMiddleware (log method, path, status, duration)
# 5. SlowAPI rate limiting middleware

# Exception handlers:
# AppException → JSONResponse with {"error": message, "detail": detail}
# RequestValidationError → 422 with field errors
# HTTPException → standard

# Include router: app.include_router(api_router, prefix="/api/v1")
# Health check: GET /health → {"status": "ok", "version": "2.0.0", "db": "ok", "redis": "ok"}
```

---

## PHASE 2 — Complete All Models

### 2.1 — `app/models/mixins.py` (CREATE)
```python
class UUIDMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class SoftDeleteMixin:
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
```

### 2.2 — `app/models/user.py` (REWRITE COMPLETELY)
```python
class UserRole(str, Enum):
    INDIVIDUAL = "individual"
    BUSINESS = "business"
    ADMIN = "admin"

class AccountStatus(str, Enum):
    PENDING_VERIFICATION = "pending_verification"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DEACTIVATED = "deactivated"

class User(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "users"
    
    full_name: str
    email: str (unique, indexed)
    phone: Optional[str] (unique, nullable)
    hashed_password: str
    role: UserRole (default INDIVIDUAL)
    status: AccountStatus (default PENDING_VERIFICATION)
    
    is_email_verified: bool (default False)
    email_verified_at: Optional[datetime]
    
    profile_picture_url: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[str]
    
    # Auth tracking
    last_login_at: Optional[datetime]
    last_login_ip: Optional[str]
    failed_login_attempts: int (default 0)
    locked_until: Optional[datetime]
    
    # Preferences
    notification_email: bool (default True)
    notification_sms: bool (default False)
    
    # Relationships
    business_profile: relationship("BusinessProfile", back_populates="user", uselist=False)
    orders: relationship("Order", back_populates="user")
    addresses: relationship("Address", back_populates="user")
    notifications: relationship("Notification", back_populates="user")
    reviews: relationship("Review", back_populates="user")
```

### 2.3 — `app/models/business_profile.py` (CREATE NEW)
```python
class BusinessStatus(str, Enum):
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED = "verified"
    REJECTED = "rejected"
    SUSPENDED = "suspended"

class BusinessProfile(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "business_profiles"
    
    user_id: str (FK → users.id, unique)
    
    company_name: str
    gst_number: Optional[str] (unique when provided)
    pan_number: Optional[str]
    business_type: str  # "proprietorship", "partnership", "pvt_ltd", "llp"
    industry: Optional[str]
    website: Optional[str]
    
    # Address
    registered_address: str
    city: str
    state: str
    pincode: str
    country: str (default "India")
    
    # Verification
    status: BusinessStatus (default PENDING_VERIFICATION)
    verified_at: Optional[datetime]
    verified_by: Optional[str] (FK → users.id, admin who verified)
    rejection_reason: Optional[str]
    
    # Documents
    gst_certificate_url: Optional[str]
    pan_card_url: Optional[str]
    
    # Business settings
    credit_limit: float (default 0.0)  # for post-paid orders
    credit_used: float (default 0.0)
    payment_terms_days: int (default 0)  # 0 = no credit
    
    # Bulk pricing tier: "standard", "silver", "gold", "platinum"
    pricing_tier: str (default "standard")
    discount_percentage: float (default 0.0)
    
    # Relationships
    user: relationship("User", back_populates="business_profile")
```

### 2.4 — `app/models/product.py` (REWRITE)
```python
class ProductCategory(str, Enum):
    BUSINESS_CARDS = "business_cards"
    FLYERS = "flyers"
    BANNERS = "banners"
    BROCHURES = "brochures"
    POSTERS = "posters"
    LETTERHEADS = "letterheads"
    ENVELOPES = "envelopes"
    STICKERS = "stickers"
    FLEX_PRINTING = "flex_printing"
    DIGITAL_PRINTING = "digital_printing"
    OFFSET_PRINTING = "offset_printing"
    PACKAGING = "packaging"
    CUSTOM = "custom"

class Product(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "products"
    
    name: str
    slug: str (unique, indexed)
    category: ProductCategory
    description: str
    short_description: Optional[str]
    
    # Pricing
    base_price: float  # per unit at minimum qty
    price_per_unit: float
    minimum_quantity: int (default 1)
    
    # Business bulk pricing tiers (JSON)
    # {"silver": 5.0, "gold": 10.0, "platinum": 15.0} = % discount
    bulk_pricing_tiers: dict (JSON column)
    
    # Quantity pricing breaks (JSON)
    # [{"min_qty": 100, "price": 8.0}, {"min_qty": 500, "price": 6.5}]
    quantity_breaks: list (JSON column)
    
    # Specifications options (JSON) — what user selects
    # {"sizes": ["A4","A5","A6"], "paper_types": ["glossy","matte"], "finishes": ["lamination","uv"]}
    specification_options: dict (JSON column)
    
    # Turnaround times (JSON)
    # [{"days": 1, "label": "Express", "extra_charge": 200}, {"days": 3, "label": "Standard", "extra_charge": 0}]
    turnaround_options: list (JSON column)
    
    # Display
    thumbnail_url: Optional[str]
    gallery_urls: list (JSON column, default [])
    
    # State
    is_active: bool (default True)
    is_featured: bool (default False)
    display_order: int (default 0)
    
    # GST
    gst_percentage: float (default 18.0)
    hsn_code: Optional[str]
    
    # SEO
    meta_title: Optional[str]
    meta_description: Optional[str]
    tags: list (JSON column, default [])
```

### 2.5 — `app/models/order.py` (REWRITE COMPLETELY)
```python
class OrderStatus(str, Enum):
    DRAFT = "draft"                    # saved but not submitted
    PLACED = "placed"                  # submitted by user, payment pending
    PAYMENT_PENDING = "payment_pending"
    PAYMENT_FAILED = "payment_failed"
    CONFIRMED = "confirmed"            # payment received, accepted by shop
    DESIGN_REVIEW = "design_review"   # admin reviewing uploaded files
    DESIGN_APPROVED = "design_approved"
    DESIGN_REJECTED = "design_rejected"  # files need revision
    PRINTING = "printing"
    QUALITY_CHECK = "quality_check"
    READY_FOR_DISPATCH = "ready_for_dispatch"
    SHIPPED = "shipped"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUND_INITIATED = "refund_initiated"
    REFUNDED = "refunded"

# Valid transitions map — used in order_service.py
ORDER_TRANSITIONS = {
    OrderStatus.DRAFT: [OrderStatus.PLACED, OrderStatus.CANCELLED],
    OrderStatus.PLACED: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
    OrderStatus.PAYMENT_PENDING: [OrderStatus.CONFIRMED, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED],
    OrderStatus.PAYMENT_FAILED: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
    OrderStatus.CONFIRMED: [OrderStatus.DESIGN_REVIEW, OrderStatus.CANCELLED],
    OrderStatus.DESIGN_REVIEW: [OrderStatus.DESIGN_APPROVED, OrderStatus.DESIGN_REJECTED],
    OrderStatus.DESIGN_APPROVED: [OrderStatus.PRINTING],
    OrderStatus.DESIGN_REJECTED: [OrderStatus.DESIGN_REVIEW, OrderStatus.CANCELLED],
    OrderStatus.PRINTING: [OrderStatus.QUALITY_CHECK],
    OrderStatus.QUALITY_CHECK: [OrderStatus.READY_FOR_DISPATCH, OrderStatus.PRINTING],
    OrderStatus.READY_FOR_DISPATCH: [OrderStatus.SHIPPED],
    OrderStatus.SHIPPED: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED],
    OrderStatus.OUT_FOR_DELIVERY: [OrderStatus.DELIVERED],
    OrderStatus.DELIVERED: [OrderStatus.REFUND_INITIATED],
    OrderStatus.CANCELLED: [OrderStatus.REFUND_INITIATED],
    OrderStatus.REFUND_INITIATED: [OrderStatus.REFUNDED],
}

class Order(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "orders"
    
    order_number: str (unique, indexed) # "VD-2024-000001"
    user_id: str (FK → users.id, indexed)
    
    status: OrderStatus (default DRAFT)
    
    # Delivery
    delivery_address_id: str (FK → addresses.id)
    delivery_type: str  # "standard", "express", "pickup"
    estimated_delivery_date: Optional[date]
    actual_delivery_date: Optional[date]
    
    # Pricing breakdown
    subtotal: float
    discount_amount: float (default 0.0)
    coupon_code: Optional[str]
    coupon_discount: float (default 0.0)
    gst_amount: float
    delivery_charge: float (default 0.0)
    total_amount: float
    
    # Special instructions
    special_instructions: Optional[str]
    admin_notes: Optional[str]  # internal, not shown to user
    
    # Tracking
    tracking_number: Optional[str]
    tracking_url: Optional[str]
    courier_name: Optional[str]
    
    # Business order fields
    purchase_order_number: Optional[str]  # PO number from business client
    
    # Timestamps
    placed_at: Optional[datetime]
    confirmed_at: Optional[datetime]
    printing_started_at: Optional[datetime]
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    cancelled_at: Optional[datetime]
    cancellation_reason: Optional[str]
    
    # Relationships
    user: relationship("User", back_populates="orders")
    items: relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    timeline: relationship("OrderTimeline", back_populates="order", order_by="OrderTimeline.created_at")
    payment: relationship("Payment", back_populates="order", uselist=False)
    files: relationship("OrderFile", back_populates="order")
    review: relationship("Review", back_populates="order", uselist=False)
    delivery_address: relationship("Address")
```

### 2.6 — `app/models/order_item.py` (CREATE NEW)
```python
class OrderItem(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "order_items"
    
    order_id: str (FK → orders.id, indexed)
    product_id: str (FK → products.id)
    
    product_name: str  # snapshot at time of order
    product_category: str
    
    quantity: int
    unit_price: float  # price at time of order
    total_price: float
    
    # Print specifications — what user selected
    size: Optional[str]            # "A4", "A5", "custom: 10x15cm"
    paper_type: Optional[str]      # "glossy", "matte", "uncoated"
    paper_weight: Optional[str]    # "90gsm", "130gsm", "300gsm"
    finish: Optional[str]          # "lamination", "uv_coating", "none"
    sides: Optional[str]           # "single", "double"
    color_mode: Optional[str]      # "cmyk", "black_white", "spot_color"
    turnaround_days: int (default 3)
    
    # Custom specifications JSON for anything not in above fields
    custom_specs: dict (JSON column, default {})
    
    # Design notes
    design_notes: Optional[str]
    
    # Relationships
    order: relationship("Order", back_populates="items")
    product: relationship("Product")
    files: relationship("OrderFile", back_populates="order_item")
```

### 2.7 — `app/models/order_file.py` (CREATE NEW)
```python
class FileType(str, Enum):
    DESIGN_FILE = "design_file"
    PROOF = "proof"             # uploaded by admin
    INVOICE = "invoice"
    DELIVERY_PROOF = "delivery_proof"

class OrderFile(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "order_files"
    
    order_id: str (FK → orders.id, indexed)
    order_item_id: Optional[str] (FK → order_items.id, nullable)
    uploaded_by: str (FK → users.id)
    
    file_type: FileType
    original_filename: str
    stored_filename: str  # UUID-based name on S3
    file_url: str         # S3 URL
    file_size_bytes: int
    mime_type: str
    
    # Admin review
    is_approved: Optional[bool]  # null = not reviewed, True/False = reviewed
    reviewed_by: Optional[str] (FK → users.id)
    review_notes: Optional[str]
    reviewed_at: Optional[datetime]
    
    # Relationships
    order: relationship("Order", back_populates="files")
    order_item: relationship("OrderItem", back_populates="files")
```

### 2.8 — `app/models/order_timeline.py` (CREATE NEW)
```python
class OrderTimeline(UUIDMixin, Base):
    __tablename__ = "order_timeline"
    
    order_id: str (FK → orders.id, indexed)
    changed_by: Optional[str] (FK → users.id)  # null = system
    
    from_status: Optional[OrderStatus]
    to_status: OrderStatus
    note: Optional[str]           # shown to customer
    internal_note: Optional[str]  # admin only
    
    created_at: datetime (server_default func.now())
    
    # Relationships
    order: relationship("Order", back_populates="timeline")
```

### 2.9 — `app/models/payment.py` (REWRITE)
```python
class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUND_INITIATED = "refund_initiated"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"

class PaymentMethod(str, Enum):
    UPI = "upi"
    CARD = "card"
    NET_BANKING = "net_banking"
    WALLET = "wallet"
    CREDIT = "credit"   # business account credit

class Payment(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "payments"
    
    order_id: str (FK → orders.id, unique, indexed)
    user_id: str (FK → users.id)
    
    status: PaymentStatus (default PENDING)
    method: Optional[PaymentMethod]
    amount: float
    currency: str (default "INR")
    
    # Razorpay fields
    razorpay_order_id: Optional[str] (unique)
    razorpay_payment_id: Optional[str] (unique)
    razorpay_signature: Optional[str]
    
    # Refund fields
    refund_amount: float (default 0.0)
    refund_reason: Optional[str]
    razorpay_refund_id: Optional[str]
    refunded_at: Optional[datetime]
    
    # Webhook tracking
    webhook_received_at: Optional[datetime]
    payment_captured_at: Optional[datetime]
    failure_reason: Optional[str]
    
    # Relationships
    order: relationship("Order", back_populates="payment")
```

### 2.10 — `app/models/address.py` (CREATE NEW)
```python
class Address(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "addresses"
    
    user_id: str (FK → users.id, indexed)
    
    label: str  # "Home", "Office", "Warehouse"
    recipient_name: str
    recipient_phone: str
    
    address_line_1: str
    address_line_2: Optional[str]
    city: str
    state: str
    pincode: str
    country: str (default "India")
    
    is_default: bool (default False)
    
    # Relationships
    user: relationship("User", back_populates="addresses")
```

### 2.11 — `app/models/notification.py` (CREATE NEW)
```python
class NotificationType(str, Enum):
    ORDER_PLACED = "order_placed"
    ORDER_CONFIRMED = "order_confirmed"
    DESIGN_REVIEW = "design_review"
    DESIGN_APPROVED = "design_approved"
    DESIGN_REJECTED = "design_rejected"
    PRINTING_STARTED = "printing_started"
    ORDER_SHIPPED = "order_shipped"
    ORDER_DELIVERED = "order_delivered"
    ORDER_CANCELLED = "order_cancelled"
    PAYMENT_RECEIVED = "payment_received"
    PAYMENT_FAILED = "payment_failed"
    REFUND_INITIATED = "refund_initiated"
    REFUND_COMPLETED = "refund_completed"
    ACCOUNT_VERIFIED = "account_verified"
    BUSINESS_APPROVED = "business_approved"
    BUSINESS_REJECTED = "business_rejected"
    GENERAL = "general"

class Notification(UUIDMixin, Base):
    __tablename__ = "notifications"
    
    user_id: str (FK → users.id, indexed)
    type: NotificationType
    title: str
    message: str
    data: dict (JSON, default {})   # extra context e.g. {"order_id": "..."}
    is_read: bool (default False)
    read_at: Optional[datetime]
    created_at: datetime (server_default func.now())
    
    # Relationships
    user: relationship("User", back_populates="notifications")
```

### 2.12 — `app/models/coupon.py` (CREATE NEW)
```python
class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"

class Coupon(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "coupons"
    
    code: str (unique, indexed, uppercase)
    description: str
    
    discount_type: DiscountType
    discount_value: float   # 10 = 10% or ₹10
    max_discount_amount: Optional[float]  # cap for percentage discounts
    
    min_order_amount: float (default 0.0)
    max_uses: Optional[int]   # null = unlimited
    uses_per_user: int (default 1)
    
    # Eligibility
    applicable_roles: list (JSON, e.g. ["individual", "business"])
    applicable_product_categories: list (JSON, [] = all)
    
    valid_from: datetime
    valid_until: Optional[datetime]
    is_active: bool (default True)
    
    # Relationships
    usages: relationship("CouponUsage", back_populates="coupon")

class CouponUsage(UUIDMixin, Base):
    __tablename__ = "coupon_usages"
    
    coupon_id: str (FK → coupons.id, indexed)
    user_id: str (FK → users.id, indexed)
    order_id: str (FK → orders.id)
    discount_applied: float
    used_at: datetime (server_default func.now())
    
    # Relationships
    coupon: relationship("Coupon", back_populates="usages")
```

### 2.13 — `app/models/review.py` (CREATE NEW)
```python
class Review(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "reviews"
    
    order_id: str (FK → orders.id, unique)
    user_id: str (FK → users.id, indexed)
    
    rating: int  # 1-5, check constraint
    title: Optional[str]
    comment: Optional[str]
    
    # Admin moderation
    is_approved: bool (default False)
    is_featured: bool (default False)
    moderated_by: Optional[str] (FK → users.id)
    
    # Relationships
    order: relationship("Order", back_populates="review")
    user: relationship("User", back_populates="reviews")
```

### 2.14 — `app/models/audit_log.py` (CREATE NEW)
```python
class AuditLog(UUIDMixin, Base):
    __tablename__ = "audit_logs"
    
    actor_id: Optional[str] (FK → users.id)  # null = system
    action: str   # "order.status_changed", "user.suspended", "product.updated"
    resource_type: str   # "order", "user", "product"
    resource_id: Optional[str]
    
    old_value: Optional[dict] (JSON)
    new_value: Optional[dict] (JSON)
    
    ip_address: Optional[str]
    user_agent: Optional[str]
    notes: Optional[str]
    
    created_at: datetime (server_default func.now())
```

---

## PHASE 3 — Complete All Schemas (Pydantic)

### 3.1 — `app/schemas/common.py` (CREATE)
```python
class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool

class MessageResponse(BaseModel):
    message: str
    success: bool = True

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[Any] = None
    status_code: int
```

### 3.2 — `app/schemas/auth.py`
```python
RegisterRequest:
    full_name: str (min 2, max 100)
    email: EmailStr
    phone: Optional[str] — validate Indian mobile (10 digits, starts 6-9)
    password: str — validate with is_strong_password()
    role: UserRole (only INDIVIDUAL or BUSINESS allowed on register)

LoginRequest:
    email: EmailStr
    password: str

TokenResponse:
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds

RefreshTokenRequest:
    refresh_token: str

ForgotPasswordRequest:
    email: EmailStr

ResetPasswordRequest:
    token: str
    new_password: str

ChangePasswordRequest:
    current_password: str
    new_password: str

VerifyEmailRequest:
    token: str
```

### 3.3 — `app/schemas/user.py`
```python
UserPublic: id, full_name, email, phone, role, status, profile_picture_url, created_at
UserProfile: extends UserPublic + is_email_verified, notification_email, notification_sms
UpdateProfileRequest: full_name, phone, date_of_birth, gender, notification_email, notification_sms
AdminUserView: full UserPublic + last_login_at, failed_login_attempts, business_profile summary
UserListItem: id, full_name, email, role, status, created_at
```

### 3.4 — `app/schemas/business.py`
```python
BusinessProfileCreate:
    company_name, gst_number (optional), pan_number (optional)
    business_type, industry, website (optional)
    registered_address, city, state, pincode

BusinessProfileResponse:
    all fields + status, pricing_tier, discount_percentage, credit_limit, credit_used

AdminBusinessVerify:
    action: "approve" | "reject"
    rejection_reason: Optional[str]  # required if action = reject
```

### 3.5 — `app/schemas/product.py`
```python
ProductCreate (admin only):
    all product fields with validation

ProductUpdate (admin only):
    all optional fields

ProductResponse:
    all fields

ProductListItem:
    id, name, slug, category, base_price, thumbnail_url, is_active, is_featured

PriceCalculateRequest:
    product_id, quantity, size, paper_type, finish, turnaround_days, coupon_code (optional)

PriceCalculateResponse:
    unit_price, quantity, subtotal, discount_amount, gst_amount, total_amount, estimated_delivery_date
```

### 3.6 — `app/schemas/order.py`
```python
OrderItemCreate:
    product_id, quantity
    size, paper_type, paper_weight, finish, sides, color_mode, turnaround_days
    custom_specs, design_notes

OrderCreate:
    items: List[OrderItemCreate]
    delivery_address_id
    delivery_type
    special_instructions
    coupon_code (optional)
    purchase_order_number (optional, for business)

OrderResponse:
    all order fields + items (OrderItemResponse list) + payment summary + timeline (last 5 events)

OrderListItem:
    order_number, status, total_amount, placed_at, item_count, estimated_delivery_date

OrderStatusUpdate (admin):
    status: OrderStatus
    note: Optional[str]
    internal_note: Optional[str]
    tracking_number (optional)
    tracking_url (optional)
    courier_name (optional)

AdminOrderView:
    extends OrderResponse + user info + admin_notes + full timeline
```

### 3.7 — `app/schemas/payment.py`
```python
CreatePaymentOrderRequest:
    order_id: str

RazorpayOrderResponse:
    razorpay_order_id, amount, currency, order_id

VerifyPaymentRequest:
    order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature

RefundRequest (admin):
    order_id, amount (optional, full if omitted), reason

PaymentResponse:
    all payment fields
```

---

## PHASE 4 — Complete All Services

### 4.1 — `app/services/auth_service.py` (REWRITE COMPLETELY)
All methods are `async`. Inject `AsyncSession` + `Redis`.

```
register(data: RegisterRequest) -> User:
    - check email not taken (ConflictException if exists)
    - check phone not taken if provided
    - validate password strength
    - hash password
    - create User with status PENDING_VERIFICATION
    - generate email verification token
    - send verification email (background task)
    - return created user

login(data: LoginRequest, ip: str) -> TokenResponse:
    - find user by email (NotFoundException if not found → always return 401, don't leak)
    - check if account is locked (locked_until > now → 401 with time remaining)
    - verify password
    - if wrong: increment failed_login_attempts, lock if >= 5, raise 401
    - if correct: reset failed_login_attempts, update last_login_at + last_login_ip
    - check status == ACTIVE (if PENDING_VERIFICATION → 401 "verify your email")
    - create access_token with {"sub": user.id, "role": user.role}
    - create refresh_token with jti
    - store refresh token jti in Redis (key: f"refresh:{user.id}:{jti}", value: "valid", ex=7days)
    - return TokenResponse

logout(user_id: str, access_token: str, refresh_token: str):
    - decode refresh_token to get jti
    - delete from Redis: f"refresh:{user_id}:{jti}"
    - blacklist access_token in Redis (key: f"blacklist:{access_token}", value: "1", ex=ACCESS_TOKEN_EXPIRE_MINUTES*60)

refresh_tokens(refresh_token: str) -> TokenResponse:
    - decode refresh_token
    - check type == "refresh"
    - check jti exists in Redis
    - load user
    - delete old jti from Redis
    - create new access_token + refresh_token with new jti
    - store new jti in Redis
    - return new TokenResponse

verify_email(token: str):
    - verify_special_token(token, "email_verify")
    - find user by email
    - set is_email_verified=True, email_verified_at=now, status=ACTIVE
    - send welcome email

forgot_password(email: str):
    - find user (but always return 200 to prevent email enumeration)
    - if found: generate reset token, store in Redis (key: f"pwd_reset:{email}", ex=3600)
    - send password reset email

reset_password(data: ResetPasswordRequest):
    - verify_special_token(token, "password_reset")
    - check token exists in Redis (prevents replay)
    - validate new password strength
    - hash and save new password
    - delete token from Redis
    - invalidate all refresh tokens for this user (delete pattern f"refresh:{user_id}:*")

change_password(user: User, data: ChangePasswordRequest):
    - verify current password
    - validate new password strength
    - hash and save new password
    - invalidate all refresh tokens (logout everywhere)
```

### 4.2 — `app/services/user_service.py` (REWRITE)
```
get_profile(user_id: str) -> User
update_profile(user_id: str, data: UpdateProfileRequest) -> User
upload_profile_picture(user_id: str, file: UploadFile) -> str  # returns URL
get_user_orders(user_id: str, pagination) -> PaginatedResponse[OrderListItem]
get_user_notifications(user_id: str, pagination) -> PaginatedResponse[Notification]
mark_notifications_read(user_id: str, notification_ids: List[str])
get_unread_notification_count(user_id: str) -> int

# Admin methods
list_users(filters: dict, pagination) -> PaginatedResponse[AdminUserView]
get_user_detail(user_id: str) -> AdminUserView
suspend_user(user_id: str, admin_id: str, reason: str)
reactivate_user(user_id: str, admin_id: str)
change_user_role(user_id: str, new_role: UserRole, admin_id: str)
```

### 4.3 — `app/services/business_service.py` (CREATE NEW)
```
create_business_profile(user_id: str, data: BusinessProfileCreate) -> BusinessProfile:
    - user must have role INDIVIDUAL (upgrade to BUSINESS) or already BUSINESS
    - validate GST format if provided: [0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}
    - validate PAN format: [A-Z]{5}[0-9]{4}[A-Z]{1}
    - create BusinessProfile with status PENDING_VERIFICATION
    - update user.role = BUSINESS
    - notify admin (create admin notification)

upload_verification_document(user_id: str, doc_type: str, file: UploadFile) -> str
get_my_business_profile(user_id: str) -> BusinessProfile

# Admin methods
list_pending_verifications(pagination) -> PaginatedResponse[BusinessProfile]
verify_business(business_id: str, admin_id: str, data: AdminBusinessVerify):
    - if approve: set status VERIFIED, set pricing_tier based on company size, notify user
    - if reject: set status REJECTED, rejection_reason, notify user

set_credit_limit(business_id: str, admin_id: str, limit: float)
set_pricing_tier(business_id: str, admin_id: str, tier: str, discount: float)
```

### 4.4 — `app/services/product_service.py` (REWRITE)
```
list_products(category, is_active, search, pagination) -> PaginatedResponse[ProductListItem]
get_product_by_slug(slug: str) -> Product
get_product_by_id(product_id: str) -> Product
calculate_price(data: PriceCalculateRequest, user: User) -> PriceCalculateResponse:
    - get product
    - find applicable quantity break price
    - apply business tier discount if user is BUSINESS
    - calculate GST
    - apply coupon if provided (validate via coupon_service)
    - calculate estimated delivery date based on turnaround_days (skip Sundays)
    - return full breakdown

# Admin methods
create_product(data: ProductCreate, admin_id: str) -> Product:
    - auto-generate slug from name
    - upload thumbnail if provided
create_update_product(product_id: str, data: ProductUpdate) -> Product
toggle_product_active(product_id: str, admin_id: str) -> Product
toggle_product_featured(product_id: str, admin_id: str) -> Product
delete_product(product_id: str, admin_id: str)  # soft delete
```

### 4.5 — `app/services/order_service.py` (REWRITE — MOST CRITICAL)
```
create_draft_order(user: User, data: OrderCreate, db) -> Order:
    - validate all product_ids exist and are active
    - validate delivery_address belongs to user
    - calculate pricing for each item using pricing_service
    - validate + apply coupon via coupon_service
    - generate order_number: "VD-{YEAR}-{6-digit-sequence}"
    - create Order with status DRAFT
    - create OrderItems
    - create initial OrderTimeline entry
    - return order

submit_order(order_id: str, user_id: str) -> Order:
    - load order, verify belongs to user, status must be DRAFT
    - create Razorpay order via payment_service
    - transition order: DRAFT → PLACED
    - add timeline entry
    - return order with razorpay_order_id

get_order(order_id: str, user_id: str) -> Order:
    - load order with all relationships
    - verify belongs to user (or user is admin)
    - return

list_user_orders(user_id: str, status_filter, pagination) -> PaginatedResponse[OrderListItem]

cancel_order(order_id: str, user_id: str, reason: str):
    - load order, verify belongs to user
    - check cancellable statuses: DRAFT, PLACED, PAYMENT_PENDING, CONFIRMED, DESIGN_REVIEW, DESIGN_REJECTED
    - transition to CANCELLED
    - if payment was captured: initiate refund via payment_service
    - add timeline entry
    - send cancellation email + notification

# Admin methods
admin_update_order_status(order_id: str, admin_id: str, data: OrderStatusUpdate):
    - validate transition is allowed via ORDER_TRANSITIONS map (raise OrderStateException if not)
    - update order status + relevant timestamp field
    - update tracking fields if provided
    - create OrderTimeline entry (note + internal_note)
    - create Notification for user
    - send email based on new status
    - log to AuditLog

admin_list_orders(filters: dict, pagination) -> PaginatedResponse[AdminOrderView]:
    - filters: status, user_id, date_from, date_to, search (order_number / user email)

admin_add_note(order_id: str, admin_id: str, note: str)

approve_design(order_id: str, admin_id: str, proof_url: Optional[str]):
    - transition DESIGN_REVIEW → DESIGN_APPROVED
    - if proof_url: create OrderFile with type PROOF
    - notify user

reject_design(order_id: str, admin_id: str, reason: str):
    - transition DESIGN_REVIEW → DESIGN_REJECTED
    - create OrderTimeline with reason
    - notify user with reason

generate_invoice(order_id: str) -> bytes:
    - generate PDF invoice using reportlab or weasyprint
    - include: order details, items, pricing breakdown, GST, company info
    - store as OrderFile with type INVOICE
    - return PDF bytes
```

### 4.6 — `app/services/file_service.py` (CREATE NEW)
```
upload_file(file: UploadFile, folder: str) -> dict:
    - validate file extension in ALLOWED_FILE_TYPES
    - validate file size <= MAX_FILE_SIZE_MB
    - validate MIME type matches extension
    - generate unique filename: f"{uuid4()}.{extension}"
    - upload to S3: bucket/folder/filename
    - return {"url": s3_url, "stored_filename": ..., "size_bytes": ..., "mime_type": ...}

delete_file(stored_filename: str, folder: str):
    - delete from S3

upload_order_design_files(order_id: str, item_id: str, user_id: str, files: List[UploadFile]) -> List[OrderFile]:
    - validate order belongs to user
    - validate order status allows file upload (PLACED, CONFIRMED, DESIGN_REJECTED)
    - upload each file to S3 folder "orders/{order_id}/designs/"
    - create OrderFile records
    - if all items have files: optionally auto-trigger DESIGN_REVIEW transition

get_presigned_download_url(stored_filename: str, folder: str, expiry_seconds: int = 3600) -> str:
    - generate S3 presigned URL for secure download
```

### 4.7 — `app/services/payment_service.py` (CREATE NEW — COMPLETE RAZORPAY)
```
create_razorpay_order(order: Order) -> dict:
    - import razorpay; client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))
    - amount_paise = int(order.total_amount * 100)
    - rzp_order = client.order.create({
        "amount": amount_paise, "currency": "INR",
        "receipt": order.order_number,
        "notes": {"order_id": order.id, "user_id": order.user_id}
      })
    - create Payment record: status PENDING, razorpay_order_id = rzp_order["id"]
    - return rzp_order

verify_payment_signature(data: VerifyPaymentRequest) -> bool:
    - generate HMAC SHA256: hmac(KEY_SECRET, f"{rzp_order_id}|{rzp_payment_id}")
    - compare with razorpay_signature (use hmac.compare_digest)
    - if valid: update Payment status → CAPTURED, razorpay_payment_id, payment_captured_at
    - transition order: PAYMENT_PENDING → CONFIRMED
    - create OrderTimeline entry
    - send payment confirmation email
    - return True / raise PaymentException

handle_webhook(payload: bytes, signature: str):
    - verify webhook signature: hmac(WEBHOOK_SECRET, payload)
    - parse event type
    - "payment.captured" → call verify_payment_logic if not already captured
    - "payment.failed" → update Payment FAILED, order PAYMENT_FAILED, notify user
    - "refund.processed" → update Payment REFUNDED, order REFUNDED, notify user
    - log all events to AuditLog

initiate_refund(order: Order, amount: Optional[float], reason: str, admin_id: str):
    - load payment
    - if amount not provided: full refund
    - call razorpay refund API
    - update Payment: status REFUND_INITIATED, refund_amount, refund_reason, razorpay_refund_id
    - transition order: → REFUND_INITIATED
    - notify user
    - log to AuditLog
```

### 4.8 — `app/services/email_service.py` (CREATE NEW)
```
Use fastapi-mail + Jinja2 templates (app/templates/email/).

Templates needed (HTML + text versions):
- welcome.html
- verify_email.html
- password_reset.html
- order_placed.html
- order_confirmed.html
- design_approved.html
- design_rejected.html
- order_shipped.html
- order_delivered.html
- order_cancelled.html
- payment_received.html
- payment_failed.html
- refund_initiated.html
- business_approved.html
- business_rejected.html

All templates include:
- Vijetha Digital branding header
- Dynamic content
- CTA button
- Footer with unsubscribe link

Email functions (all async, all called as BackgroundTask):
send_welcome_email(email, name)
send_verification_email(email, name, verification_url)
send_password_reset_email(email, name, reset_url)
send_order_confirmation_email(email, name, order)
send_order_status_email(email, name, order, new_status, note)
send_payment_confirmation_email(email, name, order, payment)
send_refund_email(email, name, order, refund_amount)
```

### 4.9 — `app/services/notification_service.py` (CREATE NEW)
```
create_notification(user_id, type, title, message, data={}) -> Notification:
    - insert to DB
    - publish to Redis pub/sub channel f"notifications:{user_id}" for real-time

get_user_notifications(user_id, page, page_size) -> PaginatedResponse[Notification]
mark_as_read(user_id, notification_ids: List[str])
mark_all_as_read(user_id)
get_unread_count(user_id) -> int
delete_notification(user_id, notification_id)

WebSocket endpoint: /ws/notifications/{user_id}
    - authenticate via token query param
    - subscribe to Redis channel f"notifications:{user_id}"
    - stream new notifications as JSON in real-time
```

### 4.10 — `app/services/coupon_service.py` (CREATE NEW)
```
validate_coupon(code: str, user: User, order_amount: float, product_categories: List[str]) -> Coupon:
    - find coupon by code (case insensitive)
    - check is_active = True
    - check valid_from <= now <= valid_until (if set)
    - check max_uses not exceeded
    - check user role in applicable_roles
    - check product categories overlap if restricted
    - check min_order_amount
    - check uses_per_user limit for this user
    - return coupon or raise ValidationException

calculate_discount(coupon: Coupon, order_amount: float) -> float:
    - if PERCENTAGE: min(order_amount * discount_value / 100, max_discount_amount or inf)
    - if FIXED: min(discount_value, order_amount)

record_usage(coupon_id, user_id, order_id, discount_applied):
    - create CouponUsage record

# Admin methods
create_coupon(data) -> Coupon
update_coupon(coupon_id, data) -> Coupon
deactivate_coupon(coupon_id)
get_coupon_stats(coupon_id) -> dict  # total uses, total discount given, revenue impact
```

### 4.11 — `app/services/pricing_service.py` (CREATE NEW)
```
calculate_item_price(product: Product, quantity: int, specs: dict, user: User) -> dict:
    - find applicable quantity break price
    - if user is BUSINESS: apply tier discount from business_profile.discount_percentage
    - return {"unit_price": ..., "subtotal": ...}

calculate_order_total(items_prices: list, delivery_charge: float, coupon_discount: float) -> dict:
    - sum subtotals
    - apply coupon discount
    - calculate GST on (subtotal - coupon_discount)
    - add delivery charge (not GST'd if it's a separate line)
    - return {"subtotal", "coupon_discount", "gst_amount", "delivery_charge", "total"}

calculate_delivery_charge(order_total: float, delivery_type: str) -> float:
    - "standard": free above ₹500, else ₹50
    - "express": ₹150 always
    - "pickup": ₹0

calculate_estimated_delivery(turnaround_days: int, placed_at: datetime) -> date:
    - skip Sundays in counting
    - return business days from now
```

### 4.12 — `app/services/admin_service.py` (CREATE NEW)
```
get_dashboard_stats() -> dict:
    - total orders today / this week / this month
    - revenue today / this week / this month
    - order status breakdown (pie chart data)
    - pending tasks: orders in DESIGN_REVIEW, unverified business accounts, pending refunds
    - new users today / this week
    - top products by order count this month
    - recent 10 orders

get_revenue_report(date_from, date_to, group_by: "day"|"week"|"month") -> list:
    - aggregate payments.amount by time period

get_order_status_report(date_from, date_to) -> dict:
    - count by status

get_product_performance_report(date_from, date_to) -> list:
    - order count, total revenue per product

export_orders_csv(filters: dict) -> bytes:
    - generate CSV with all order details for given filter

export_users_csv() -> bytes
```

---

## PHASE 5 — Complete All API Endpoints

### 5.1 — Auth endpoints (`/api/v1/auth/`)
```
POST /register               → RegisterRequest → UserPublic + 201
POST /login                  → LoginRequest → TokenResponse
POST /logout                 → Bearer required → MessageResponse
POST /refresh                → RefreshTokenRequest → TokenResponse
POST /verify-email           → VerifyEmailRequest → MessageResponse
POST /resend-verification    → {email} → MessageResponse (rate limited: 1/min)
POST /forgot-password        → ForgotPasswordRequest → MessageResponse
POST /reset-password         → ResetPasswordRequest → MessageResponse
POST /change-password        → Bearer required → ChangePasswordRequest → MessageResponse
GET  /me                     → Bearer required → UserProfile
```

### 5.2 — User endpoints (`/api/v1/users/`)
```
GET    /profile              → UserProfile
PATCH  /profile              → UpdateProfileRequest → UserProfile
POST   /profile/picture      → multipart/form-data file → {"url": ...}
GET    /addresses            → List[Address]
POST   /addresses            → AddressCreate → Address + 201
PUT    /addresses/{id}       → AddressUpdate → Address
DELETE /addresses/{id}       → MessageResponse
PATCH  /addresses/{id}/set-default → MessageResponse
GET    /orders               → query: status, page, page_size → PaginatedResponse[OrderListItem]
GET    /notifications        → query: is_read, page → PaginatedResponse[Notification]
GET    /notifications/count  → {"unread": int}
PATCH  /notifications/read   → {"ids": [...]} → MessageResponse
PATCH  /notifications/read-all → MessageResponse
DELETE /notifications/{id}   → MessageResponse
```

### 5.3 — Business endpoints (`/api/v1/business/`)
```
POST   /profile              → BusinessProfileCreate → BusinessProfile + 201
GET    /profile              → BusinessProfile (require BUSINESS or ADMIN)
PUT    /profile              → BusinessProfileUpdate → BusinessProfile
POST   /documents/gst        → file upload → {"url": ...}
POST   /documents/pan        → file upload → {"url": ...}
GET    /credit               → {"limit": float, "used": float, "available": float}
```

### 5.4 — Product endpoints (`/api/v1/products/`)
```
GET  /                       → query: category, search, page → PaginatedResponse[ProductListItem]
GET  /{slug}                 → ProductResponse
GET  /categories             → List of categories with counts
POST /calculate-price        → PriceCalculateRequest → PriceCalculateResponse
```

### 5.5 — Order endpoints (`/api/v1/orders/`)
```
POST   /                     → OrderCreate → OrderResponse + 201
GET    /                     → query: status, page → PaginatedResponse[OrderListItem]
GET    /{order_id}           → OrderResponse
POST   /{order_id}/submit    → submit draft → {razorpay_order_id, amount, currency}
POST   /{order_id}/files     → multipart, files: List[UploadFile], item_id: str → List[OrderFile]
GET    /{order_id}/files     → List[OrderFile] (presigned URLs)
GET    /{order_id}/invoice   → PDF download (StreamingResponse)
POST   /{order_id}/cancel    → {"reason": str} → MessageResponse
POST   /{order_id}/review    → ReviewCreate → Review + 201
GET    /{order_id}/timeline  → List[OrderTimeline]
```

### 5.6 — Payment endpoints (`/api/v1/payments/`)
```
POST /create-order           → {order_id} → RazorpayOrderResponse
POST /verify                 → VerifyPaymentRequest → MessageResponse
POST /webhook                → raw body (no auth, verify signature) → 200
GET  /{order_id}             → PaymentResponse
```

### 5.7 — Coupon endpoints (`/api/v1/coupons/`)
```
POST /validate               → {code, order_amount, product_categories} → {valid, discount_amount, message}
```

### 5.8 — Admin endpoints (`/api/v1/admin/`) — ALL require ADMIN role

#### Dashboard
```
GET /dashboard               → dashboard stats dict
GET /dashboard/revenue       → query: date_from, date_to, group_by → revenue report
GET /dashboard/orders        → order status report
GET /dashboard/products      → product performance report
```

#### Order Management
```
GET    /orders               → query: status, user_id, date_from, date_to, search, page → PaginatedResponse[AdminOrderView]
GET    /orders/{id}          → AdminOrderView
PATCH  /orders/{id}/status   → OrderStatusUpdate → AdminOrderView
POST   /orders/{id}/notes    → {"note": str} → MessageResponse
POST   /orders/{id}/approve-design → {"proof_url": optional str} → MessageResponse
POST   /orders/{id}/reject-design  → {"reason": str} → MessageResponse
POST   /orders/{id}/refund   → RefundRequest → MessageResponse
GET    /orders/export        → CSV download query: filters → CSV StreamingResponse
```

#### User Management
```
GET    /users                → query: role, status, search, page → PaginatedResponse[AdminUserView]
GET    /users/{id}           → AdminUserView
PATCH  /users/{id}/suspend   → {"reason": str} → MessageResponse
PATCH  /users/{id}/reactivate → MessageResponse
PATCH  /users/{id}/role      → {"role": UserRole} → MessageResponse
```

#### Business Verification
```
GET    /business/pending     → PaginatedResponse[BusinessProfile]
POST   /business/{id}/verify → AdminBusinessVerify → MessageResponse
PATCH  /business/{id}/credit → {"limit": float} → MessageResponse
PATCH  /business/{id}/tier   → {"tier": str, "discount": float} → MessageResponse
```

#### Product Management
```
POST   /products             → ProductCreate → ProductResponse + 201
PUT    /products/{id}        → ProductUpdate → ProductResponse
DELETE /products/{id}        → MessageResponse (soft delete)
PATCH  /products/{id}/toggle-active   → MessageResponse
PATCH  /products/{id}/toggle-featured → MessageResponse
```

#### Coupon Management
```
GET    /coupons              → PaginatedResponse[Coupon]
POST   /coupons              → CouponCreate → Coupon + 201
PUT    /coupons/{id}         → CouponUpdate → Coupon
DELETE /coupons/{id}         → MessageResponse
GET    /coupons/{id}/stats   → coupon usage stats
```

#### Review Moderation
```
GET    /reviews              → query: is_approved, page → PaginatedResponse[Review]
PATCH  /reviews/{id}/approve → MessageResponse
PATCH  /reviews/{id}/reject  → MessageResponse
PATCH  /reviews/{id}/feature → MessageResponse
```

#### Reports & Exports
```
GET /reports/orders          → CSV
GET /reports/users           → CSV
GET /reports/revenue         → CSV
GET /reports/products        → CSV
```

### 5.9 — WebSocket (`/ws/`)
```
WS /notifications/{user_id}  → ?token=... → real-time notification stream
```

---

## PHASE 6 — Infrastructure & Production Hardening

### 6.1 — Rate Limiting (SlowAPI)
Apply to these endpoints:
```python
@limiter.limit("5/minute")   # POST /auth/login
@limiter.limit("3/minute")   # POST /auth/forgot-password
@limiter.limit("1/minute")   # POST /auth/resend-verification
@limiter.limit("60/minute")  # all other endpoints (global)
```

### 6.2 — Request Logging Middleware (CREATE `app/middleware/logging.py`)
```python
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        # bind: method, path, user-agent, request-id (X-Request-ID header or uuid4)
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        # log: status_code, duration_ms
        # add response header: X-Request-ID, X-Response-Time
        return response
```

### 6.3 — Database Migrations (Alembic)
```
alembic/env.py must:
- use DATABASE_URL_SYNC (sync engine for migrations)
- import ALL models so alembic detects them
- use target_metadata = Base.metadata

Run order:
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head

Script: scripts/seed_admin.py
- create first admin user from settings.FIRST_ADMIN_EMAIL
- skip if already exists
```

### 6.4 — Background Tasks & Celery
```
app/worker.py:
    celery = Celery("vijetha", broker=REDIS_URL, backend=REDIS_URL)

app/tasks/email_tasks.py:
    @celery.task(bind=True, max_retries=3, default_retry_delay=60)
    def send_email_task(self, to, subject, template, context):
        # retry on SMTP failure

app/tasks/order_tasks.py:
    @celery.task
    def auto_confirm_order_task(order_id):  # triggered 30min after payment if still PLACED
    
    @celery.task
    def generate_invoice_task(order_id):
    
    @celery.task
    def send_order_reminder_task():  # periodic: remind orders stuck in DESIGN_REVIEW > 24h
    
    @celery.beat_schedule:
    "send-daily-digest": runs every day at 9AM → admin summary email
    "cleanup-expired-tokens": runs every hour → clean Redis token keys
```

### 6.5 — Docker Setup
```dockerfile
# Dockerfile (multi-stage)
FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS production
COPY . .
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]

# docker-compose.yml services:
# - api (FastAPI, port 8000)
# - worker (Celery worker)
# - beat (Celery beat scheduler)
# - flower (Celery monitoring, port 5555)
# - db (PostgreSQL 16, volume)
# - redis (Redis 7, volume)
# - nginx (reverse proxy, SSL termination)
```

### 6.6 — Nginx Config
```nginx
# nginx/nginx.conf
upstream api {
    server api:8000;
}
server {
    listen 80;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    client_max_body_size 60M;  # allow large file uploads
    
    location /api/ {
        proxy_pass http://api;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /ws/ {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 6.7 — GitHub Actions CI/CD (`.github/workflows/`)
```yaml
# ci.yml — on push to any branch
jobs:
  lint:
    - black --check app/
    - isort --check app/
    - flake8 app/
    - mypy app/
  test:
    - services: postgres, redis
    - pytest tests/ --cov=app --cov-report=xml
    - upload coverage to codecov

# deploy.yml — on push to main
jobs:
  deploy:
    - build docker image
    - push to registry
    - SSH to server, docker compose pull + up -d
```

### 6.8 — Health Check & Monitoring
```
GET /health returns:
{
    "status": "ok",
    "version": "2.0.0",
    "db": "ok" | "error",
    "redis": "ok" | "error",
    "timestamp": "ISO datetime"
}

GET /metrics → Prometheus metrics (via prometheus-fastapi-instrumentator)
    - http_request_duration_seconds
    - http_requests_total
    - active_db_connections

Sentry: init in main.py if SENTRY_DSN is set
    - capture_unhandled_exceptions = True
    - traces_sample_rate = 0.1 (prod), 1.0 (dev)
```

---

## PHASE 7 — Tests

### 7.1 — Test Setup (`tests/conftest.py`)
```python
@pytest_asyncio.fixture
async def db_session():
    # use SQLite in-memory or test PostgreSQL
    # run migrations, yield session, rollback after each test

@pytest_asyncio.fixture
async def client(db_session):
    # TestClient with overridden get_db dependency

@pytest_asyncio.fixture
async def user_token(client):
    # register + login, return headers

@pytest_asyncio.fixture
async def admin_token(client):
    # seed admin, login, return headers
```

### 7.2 — Tests to Write
```
tests/unit/
    test_security.py         → hash_password, verify, token create/decode, is_strong_password
    test_pricing_service.py  → price calculations, GST, quantity breaks, discounts
    test_coupon_service.py   → validation rules, discount calc

tests/integration/
    test_auth.py             → register, login, logout, refresh, verify email, reset password
    test_orders.py           → create, submit, file upload, status transitions, cancel
    test_payments.py         → create razorpay order, verify signature, webhook handling
    test_admin_orders.py     → status updates, design review, refund
    test_business.py         → create profile, document upload, admin verification
    test_products.py         → CRUD (admin), price calculator, public listing
    test_notifications.py    → create, mark read, count
```

---

## PHASE 8 — What to Clean Up (Remove / Fix)

```
DELETE: check_admin.py, check_admin_simple.py, check_db.py, check_enums.py, check_iam.py
DELETE: add_tracking_columns.py (migrate to alembic instead)
DELETE: test_auth_endpoints.py, test_cors.py, test_login.py, test_login_quick.py, test_logout.py, test_stress.py
    → replace all of these with proper pytest tests in tests/ folder

FIX: mailmap.txt → belongs in .git/info/mailmap not root
FIX: .pre-commit-config.yaml → ensure black, isort, flake8, mypy hooks are correct
FIX: Makefile → add targets: dev, test, migrate, seed, docker-up, docker-down, lint
FIX: BUG_FIXES_APPLIED.md, ENDPOINT_VERIFICATION_SUMMARY.md, ADMIN_DASHBOARD_CHECKLIST.md
    → archive these into docs/ folder, keep only README.md at root
```

---

## PHASE 9 — Missing `.env.example` Fields to Add
```
# Add these to existing .env.example:
REDIS_URL=redis://localhost:6379/0
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=vijetha-digital-uploads
AWS_S3_BASE_URL=https://your-bucket.s3.ap-south-1.amazonaws.com
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=noreply@vijethadigital.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_TLS=true
SENTRY_DSN=
RAZORPAY_WEBHOOK_SECRET=
GST_PERCENTAGE=18.0
MIN_ORDER_AMOUNT=100.0
MAX_FILE_SIZE_MB=50
FIRST_ADMIN_EMAIL=admin@vijethadigital.com
FIRST_ADMIN_PASSWORD=ChangeThisImmediately!123
FIRST_ADMIN_NAME=Super Admin
```

---

## Implementation Order (Tell Copilot to do in this sequence)
1. Phase 1 — Fix Foundation (config, security, session, dependencies, exceptions, main)
2. Phase 2 — All Models (run alembic migration after)
3. Phase 3 — All Schemas
4. Phase 4 — Services (pricing_service first, then order_service uses it)
5. Phase 5 — API Endpoints
6. Phase 6 — Infrastructure (Docker, nginx, CI/CD)
7. Phase 7 — Tests
8. Phase 8 — Cleanup

---

## Key Rules for Copilot to Follow
- Every DB query must use `async with session` — no sync SQLAlchemy calls
- Every service method raises specific exceptions from `app/core/exceptions.py` — never bare `HTTPException` inside services
- All timestamps stored in UTC with timezone=True
- Never return `hashed_password` in any schema response
- File URLs served as presigned S3 URLs (expire 1 hour), not direct S3 URLs
- Order status transitions ALWAYS validated against ORDER_TRANSITIONS map
- Payment webhook endpoint has NO auth middleware — only signature verification
- Admin endpoints log every action to AuditLog table
- Emails sent as BackgroundTask — never block the request
- Redis used for: token blacklist, refresh token store, rate limit counters, notification pub/sub, response caching for product listings (5 min TTL)
```