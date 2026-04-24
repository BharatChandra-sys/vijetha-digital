from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def site_status():
    """Public endpoint — frontend checks this on load to detect maintenance mode."""
    from app.core.maintenance import get_maintenance_message, is_maintenance_active
    return {
        "maintenance": is_maintenance_active(),
        "message": get_maintenance_message() if is_maintenance_active() else None,
    }
