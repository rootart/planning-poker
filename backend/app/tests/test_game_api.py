import uuid
from typing import Optional

from fastapi import FastAPI, Cookie
from httpx import AsyncClient
import pytest

from app.dependencies import require_user_cookie
from app.models import User


async def require_user_cookie_mock(
    user: Optional[uuid.UUID] = Cookie(None)  # noqa
):
    user = await User.create(
        id=str(uuid.uuid4()),
        name='Demo',
    )
    return user.id


@pytest.mark.asyncio
async def test_add_game(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test/") as ac:
        app.dependency_overrides[require_user_cookie] = require_user_cookie_mock
        response = await ac.post("/games/", json={
            "name": "Sprint planning"
        })
        app.dependency_overrides = {}
    assert response.status_code == 200
