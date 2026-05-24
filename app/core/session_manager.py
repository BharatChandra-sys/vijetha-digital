from datetime import datetime

# In production you would store this in Redis or DB
active_sessions: dict[str, dict] = {}


def register_session(user_id: int, token: str):
    active_sessions[token] = {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }


def revoke_session(token: str):
    if token in active_sessions:
        del active_sessions[token]


def is_session_active(token: str) -> bool:
    return token in active_sessions
