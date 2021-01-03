import uuid

from fastapi import FastAPI
from httpx import AsyncClient
import pytest

from app.models import User
from app.settings import get_settings

settings = get_settings()


@pytest.mark.asyncio
async def test_users_me_endpoint_unauthorized(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test/") as ac:
        response = await ac.get("/users/me/")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_users_me_endpoint_with_invalid_cookies(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test/") as ac:
        response = await ac.get("/users/me/", cookies={
            settings.USER_COOKIES_NAME: 'invalid-value'
        })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_users_me_endpoint_with_uuid_cookies(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test/") as ac:
        response = await ac.get("/users/me/", cookies={
            settings.USER_COOKIES_NAME: str(uuid.uuid4())
        })
    assert response.status_code == 404

    user_id = uuid.uuid4()
    user = await User.create(
        id=user_id,
        name='Demo',
    )

    async with AsyncClient(app=app, base_url="http://test/") as ac:
        response = await ac.get("/users/me/", cookies={
            settings.USER_COOKIES_NAME: str(user.id)
        })
    assert response.status_code == 200
    content = response.json()
    assert content['id'] == str(user_id)
    assert content['name'] == 'Demo'
    assert 'created' in content


@pytest.mark.asyncio
async def test_user_creation(app: FastAPI, subtests):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/users/", json={
            'name': 'Demo',
        })
        assert response.status_code == 200
        response_fields = ['id', 'name', 'created', ]
        for field in response_fields:
            with subtests.test(msg=f'test {field}', field=field):
                assert field in response.json()

        # ensure that cookies for user were set
        assert response.cookies.get('user') == response.json().get('id')
