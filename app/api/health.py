from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def site_status():
    """Public endpoint — frontend checks this on load to detect maintenance mode."""
    from app.core.maintenance import is_maintenance_active, get_maintenance_message
    return {
        "maintenance": is_maintenance_active(),
        "message": get_maintenance_message() if is_maintenance_active() else None,
    }
