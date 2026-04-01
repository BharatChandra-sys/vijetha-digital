from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
with engine.connect() as conn:
    # Check if staff table exists
    result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='staff'"))
    staff_exists = result.fetchone()
    print(f'Staff table exists: {staff_exists is not None}')

    # Check roles table
    result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='roles'"))
    roles_exists = result.fetchone()
    print(f'Roles table exists: {roles_exists is not None}')

    # Check if there are any staff records
    if staff_exists:
        result = conn.execute(text('SELECT COUNT(*) FROM staff'))
        count = result.fetchone()[0]
        print(f'Staff records count: {count}')

    # Check if there are any roles
    if roles_exists:
        result = conn.execute(text('SELECT COUNT(*) FROM roles'))
        count = result.fetchone()[0]
        print(f'Roles records count: {count}')

conn.close()