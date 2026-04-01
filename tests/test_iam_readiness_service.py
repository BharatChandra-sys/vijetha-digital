from app.db.session import SessionLocal
from app.services.iam_readiness_service import IAMReadinessService


def test_iam_readiness_report_shape():
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
