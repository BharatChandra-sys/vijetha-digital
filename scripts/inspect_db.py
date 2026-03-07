from app.db.session import SessionLocal
from sqlalchemy import inspect

with SessionLocal() as db:
    insp = inspect(db.bind)
    cols = insp.get_columns('users')
    print('users columns:')
    for c in cols:
        print(c['name'], c['type'], 'nullable=%s' % c['nullable'])
