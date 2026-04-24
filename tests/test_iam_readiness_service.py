import os

import pytest


def _db_available() -> bool:
    try:
        import re

        import psycopg2
        url = os.environ.get("DATABASE_URL", "")
        m = re.match(r"postgresql\+psycopg2://([^:]+):([^@]+)@([^:/]+):?(\d+)?/(.+)", url)
        if not m:
            return False
        user, password, host, port, dbname = m.groups()
        conn = psycopg2.connect(
            host=host, port=int(port or 5432),
            user=user, password=password, dbname=dbname,
            connect_timeout=2,
        )
        conn.close()
        return True
    except Exception:
        return False


@pytest.mark.skipif(not _db_available(), reason="PostgreSQL not available")
def test_iam_readiness_report_shape():
    from app.db.session import SessionLocal
    from app.services.iam_readiness_service import IAMReadinessService

    db = SessionLocal()
    try:
        report = IAMReadinessService.build_report(db)
    finally:
        db.close()

    assert report["status"] in {"healthy", "warning"}
    assert isinstance(report["checks"], dict)
    assert isinstance(report["failedChecks"], list)
    assert isinstance(report["metrics"], dict)
    assert isinstance(report["missing"], dict)
    assert "roles" in report["missing"]
    assert "tables" in report["missing"]
