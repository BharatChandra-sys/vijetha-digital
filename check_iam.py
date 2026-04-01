from app.services.iam_readiness_service import IAMReadinessService
from app.db.session import get_db

db = next(get_db())
try:
    report = IAMReadinessService.build_report(db)
    print('IAM Readiness Report:')
    print(f'Status: {report.get("status")}')
    print(f'Message: {report.get("message")}')
    print(f'Details: {report.get("details", {})}')
except Exception as e:
    print(f'Error building IAM report: {e}')