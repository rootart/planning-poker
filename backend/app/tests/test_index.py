from fastapi import FastAPI
from httpx import AsyncClient
import pytest


@pytest.mark.asyncio
async def test_index_page(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
