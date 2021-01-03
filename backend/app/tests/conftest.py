import os

from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import AsyncClient
import pytest
from tortoise.contrib.test import (
    finalizer,
    initializer,
)

from app.main import app as pocker_app


@pytest.fixture
def app() -> FastAPI:
    return pocker_app


@pytest.fixture(autouse=True)
def run_around_tests():
    db_url = os.environ.get("TORTOISE_TEST_DB", "sqlite://:memory:")
    initializer(['app.models'], db_url=db_url)
    yield
    finalizer()


@pytest.fixture
async def client(app: FastAPI) -> AsyncClient:
    async with LifespanManager(app):
        async with AsyncClient(
            app=app,
            base_url="http://testserver",
            headers={"Content-Type": "application/json"}
        ) as client:
            yield client
