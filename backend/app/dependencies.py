from typing import Optional
from uuid import UUID

from broadcaster import Broadcast
from fastapi import Cookie, HTTPException

from app.settings import get_settings

settings = get_settings()


async def require_user_cookie(
    user: Optional[UUID] = Cookie(None)  # noqa
):
    """
    Dependency checks the incoming requests and retrieve cookies information
    from there which should be a valid UUID. An Exception with Unauthorized
    status code will be raised otherwise.
    """
    if not user:
        raise HTTPException(status_code=401)
    yield user


# Pluggable backend to handle broadcasting of the message to the multiple consumers
# Redis Pub/Sub is being used in this case https://redis.io/topics/pubsub
broadcast = Broadcast(settings.REDIS_BROADCAST_URL)
