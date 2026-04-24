from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import User, UserRole, UserStatus


def seed_admin() -> None:
  db: Session = SessionLocal()
  try:
    email = settings.FIRST_ADMIN_EMAIL or settings.ADMIN_EMAIL
    password = settings.FIRST_ADMIN_PASSWORD or settings.ADMIN_PASSWORD
    name = settings.FIRST_ADMIN_NAME or "Super Admin"

    existing = db.query(User).filter(User.email == email).first()
    if existing:
      print(f"Admin already exists: {email}")
      return

    admin = User(
      email=email,
      hashed_password=hash_password(password),
      full_name=name,
      role=UserRole.ADMIN,
      status=UserStatus.ACTIVE,
      email_verified=True,
    )
    db.add(admin)
    db.commit()
    print(f"Created admin user: {email}")
  finally:
    db.close()


if __name__ == "__main__":
  seed_admin()
