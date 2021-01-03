from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
)
from fastapi.responses import Response

from app import models
from app.dependencies import require_user_cookie
from app.models import (
    UserIn_Pydantic,
    User_Pydantic,
)
from app.settings import get_settings

routes = APIRouter(
    tags=['users', ],
)

settings = get_settings()


@routes.post('/users/')
async def add_user(
    user: UserIn_Pydantic,
    response: Response,
):
    user = await models.User.create(**user.dict())
    response.set_cookie(settings.USER_COOKIES_NAME, user.id)
    return await User_Pydantic.from_tortoise_orm(user)


@routes.get('/users/me/')
async def get_user(
    user: UUID = Depends(require_user_cookie)  # noqa
):
    user_obj = await models.User.get(
        id=user
    )
    return await User_Pydantic.from_tortoise_orm(user_obj)
