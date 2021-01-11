import json
import uuid
from asyncio import Future
from typing import Optional
from unittest.mock import AsyncMock

from fastapi import FastAPI, Cookie
from fastapi.encoders import jsonable_encoder
from httpx import AsyncClient
import pytest

from app.dependencies import require_user_cookie
from app.models import User, Game, ComplexityTypes, Task
from app.settings import get_settings

settings = get_settings()


async def require_user_cookie_mock(
    user: Optional[uuid.UUID] = Cookie(None)  # noqa
):
    user = await User.create(
        id=str(uuid.uuid4()),
        name='Demo',
    )
    return user.id


@pytest.fixture
async def game_fixture():
    user = await User.create(
        id=str(uuid.uuid4()),
        name='Game user',
    )
    return await Game.create(**{"name": "Sprint planning"}, author_id=user.id)


@pytest.mark.asyncio
async def test_add_game(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test/") as ac:
        app.dependency_overrides[require_user_cookie] = require_user_cookie_mock
        response = await ac.post("/games/", json={
            "name": "Sprint planning"
        })
        app.dependency_overrides = {}
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_mocked_broadcast(app: FastAPI, game_fixture, mocker):
    async with AsyncClient(app=app, base_url="http://test/") as ac:
        mock_broadcast = AsyncMock(return_value=Future())
        mocker.patch('app.routers.game.broadcast.publish', new=mock_broadcast)
        app.dependency_overrides[require_user_cookie] = require_user_cookie_mock
        await ac.post(f"/game/{game_fixture.id}/tasks", json={
            "content": "Sprint planning",
            "complexity": ComplexityTypes.ZERO.value,
        })
        task = await Task.get()
        user = await User.filter(name='Demo').first()

        mock_broadcast.assert_awaited_once_with(
            channel=f'game-{game_fixture.id}',
            message=json.dumps(
                jsonable_encoder({
                    'type': settings.WS_PUBLISHED_TASK,
                    'content': task.content,
                    'task_id': task.id,
                    'game_uuid': game_fixture.id,
                    'user': user.id,
                }))
        )
        app.dependency_overrides = {}
