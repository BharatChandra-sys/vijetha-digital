"""Check current enum values in the database"""
from app.db.session import engine

conn = engine.raw_connection()
cur = conn.cursor()

# Check action_type_enum
cur.execute("""
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'action_type_enum') 
    ORDER BY enumsortorder
""")
action_types = [r[0] for r in cur.fetchall()]
print('Current ACTION TYPES:', action_types)

# Check resource_type_enum
cur.execute("""
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'resource_type_enum') 
    ORDER BY enumsortorder
""")
resource_types = [r[0] for r in cur.fetchall()]
print('Current RESOURCE TYPES:', resource_types)

conn.close()
