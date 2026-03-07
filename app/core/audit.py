import logging

logger = logging.getLogger("audit")
logging.basicConfig(level=logging.INFO)


def log_admin_action(admin_id: int, action: str, details: str = ""):
    logger.info(
        f"[ADMIN ACTION] admin_id={admin_id} action={action} details={details}"
    )