from functools import lru_cache
from typing import List

from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = 'Planning poker'
    DB_URL: str = 'postgres://poker_dev:123@db:5432/poker_dev'
    REDIS_BROADCAST_URL: str = 'redis://redis:6379/1'

    CORS_DOMAINS: List[str] = ['http://localhost:8000', 'http://localhost:3000']
    USER_COOKIES_NAME: str = 'user'

    # Websocket event types
    WS_PUBLISHED_TASK: str = 'WS_PUBLISHED_TASK'
    WS_CAST_VOTE: str = 'WS_CAST_VOTE'

    class Config:
        env_file = '.env'


@lru_cache()
def get_settings() -> Settings:
    """
    Cache the settings object to prevent loading data from the .env file and therefore increase performance
    """
    return Settings()


TORTOISE_ORM = {
    "connections": {"default": get_settings().DB_URL},
    "apps": {
        "models": {
            "models": ["models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
