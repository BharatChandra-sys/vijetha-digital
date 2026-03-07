import os
print('cwd inside script', os.getcwd())
from app.db.session import SessionLocal
from sqlalchemy import inspect
with SessionLocal() as db:
    insp = inspect(db.bind)
    cols = insp.get_columns('users')
    for c in cols:
        print(c['name'], c['type'], 'nullable=%s' % c['nullable'])
