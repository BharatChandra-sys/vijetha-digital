"""
WebSocket endpoint for real-time notifications.
Supports authentication via token query parameter.
"""
import json

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections for real-time notifications."""

    def __init__(self):
        # Map user_id -> list of WebSocket connections
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Remove a WebSocket connection."""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        """Send a message to all connections for a specific user."""
        if user_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.append(connection)

            # Clean up disconnected connections
            for conn in disconnected:
                self.disconnect(conn, user_id)

    async def broadcast(self, message: dict):
        """Broadcast a message to all connected users."""
        for user_id, _connections in list(self.active_connections.items()):
            await self.send_personal_message(message, user_id)


# Global connection manager
manager = ConnectionManager()


def get_user_from_token(token: str, db: Session) -> User:
    """
    Authenticate user from JWT token.

    Args:
        token: JWT access token
        db: Database session

    Returns:
        Authenticated user

    Raises:
        Exception if token is invalid
    """
    payload = decode_access_token(token)
    if not payload:
        raise Exception("Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise Exception("Invalid token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise Exception("User not found")

    return user


@router.websocket("/ws/notifications")
async def websocket_notifications(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(get_db),
):
    """
    WebSocket endpoint for real-time notifications.

    Usage:
        ws://localhost:8000/ws/notifications?token=YOUR_JWT_TOKEN

    Message format:
        {
            "type": "notification",
            "data": {
                "id": 123,
                "title": "New Order",
                "message": "You have a new order #456",
                "type": "info",
                "created_at": "2024-01-01T00:00:00Z"
            }
        }
    """
    try:
        # Authenticate user
        user = get_user_from_token(token, db)

        # Connect WebSocket
        await manager.connect(websocket, user.id)

        # Send connection confirmation
        await websocket.send_json({
            "type": "connected",
            "data": {
                "user_id": user.id,
                "message": "Connected to notification stream",
            }
        })

        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Receive messages from client (ping/pong for keepalive)
                data = await websocket.receive_text()
                message = json.loads(data)

                # Handle ping
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})

                # Handle mark as read
                elif message.get("type") == "mark_read":
                    notification_id = message.get("notification_id")
                    if notification_id:
                        from app.models.notification import Notification
                        notification = db.query(Notification).filter(
                            Notification.id == notification_id,
                            Notification.user_id == user.id,
                        ).first()
                        if notification:
                            notification.is_read = True
                            db.commit()
                            await websocket.send_json({
                                "type": "marked_read",
                                "data": {"notification_id": notification_id}
                            })

            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "data": {"message": "Invalid JSON"}
                })
            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "data": {"message": str(e)}
                })

    except Exception as e:
        # Authentication failed
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=str(e))

    finally:
        # Disconnect
        if 'user' in locals():
            manager.disconnect(websocket, user.id)


# Export manager for use in notification service
__all__ = ["router", "manager"]
