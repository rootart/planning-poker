import json
from typing import List
from uuid import UUID

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from tortoise import exceptions

from app import models
from app.dependencies import require_user_cookie, broadcast
from app.models import (
    Task_Pydantic,
    TaskIn_Pydantic,
    Game_Pydantic,
    GameIn_Pydantic,
    ComplexityTypes,
)
from app.settings import get_settings

routes = APIRouter(
    tags=['game', ],
)

settings = get_settings()


class GameDetails(Game_Pydantic):
    tasks: List[Task_Pydantic]


class Vote_Pydantic(BaseModel):
    complexity: ComplexityTypes


@routes.post('/games/')
async def add_game(
    game: GameIn_Pydantic,
    user: UUID = Depends(require_user_cookie)  # noqa
):
    if user:
        game = await models.Game.create(**game.dict(), author_id=user)
        return await Game_Pydantic.from_tortoise_orm(game)
    raise HTTPException(status_code=401)


@routes.get('/games/')
async def list_games(
    user: UUID = Depends(require_user_cookie)  # noqa
):
    return await Game_Pydantic.from_queryset(models.Game.filter(author_id=user))


@routes.get('/game/{game_uuid}/', response_model=GameDetails)
async def game_details(
    game_uuid: UUID,
    user: UUID = Depends(require_user_cookie)  # noqa
):
    game = await models.Game.get(
        id=game_uuid
    )
    return await GameDetails.from_tortoise_orm(game)


@routes.post('/game/{game_uuid}/join/')
async def join_game(
    game_uuid: UUID,
    user: UUID = Depends(require_user_cookie)  # noqa
):
    game = await models.Game.get(
        id=game_uuid
    )
    return await models.Player.create(game=game, user_id=user, )


@routes.post('/game/{game_uuid}/tasks/')
async def add_task(
    game_uuid: UUID,
    task: TaskIn_Pydantic,
    user: UUID = Depends(require_user_cookie)  # noqa
):
    task = await models.Task.create(
        **task.dict(),
        author_id=user,
        game_id=game_uuid,
    )
    await broadcast.publish(
        channel=f'game-{game_uuid}',
        message=json.dumps(
            jsonable_encoder({
                'type': settings.WS_PUBLISHED_TASK,
                'content': task.content,
                'task_id': task.id,
                'game_uuid': game_uuid,
                'user': user,
            }))
    )
    return task


@routes.get('/game/{game_uuid}/task/{task_id}/')
async def task_vote_distribution(
    game_uuid: UUID,
    task_id: int,
    user: UUID = Depends(require_user_cookie)  # noqa
):
    task = await models.Task.get(
        game_id=game_uuid,
        id=task_id
    )
    result = await Task_Pydantic.from_tortoise_orm(task)
    result = result.dict()
    result['vote_distribution'] = await task.vote_distribution()
    return result


@routes.post('/game/{game_uuid}/task/{task_id}/vote/')
async def task_vote(
    game_uuid: UUID,
    task_id: int,
    vote: Vote_Pydantic,
    user: UUID = Depends(require_user_cookie)  # noqa

):
    prev_vote = None
    try:
        task = await models.Task.get(
            id=task_id,
            game_id=game_uuid,
        )
    except exceptions.DoesNotExist:
        raise HTTPException(status_code=404)
    try:
        vote_obj = await models.Vote.get(
            user_id=user,
            task=task
        )
        prev_vote = vote_obj.complexity
        vote_obj.complexity = vote.complexity
        await vote_obj.save()
    except exceptions.DoesNotExist:

        vote_obj = await models.Vote.create(
            user_id=user,
            task=task,
            **vote.dict(),
        )
    message = jsonable_encoder({
        'type': settings.WS_CAST_VOTE,
        'complexity': vote.complexity,
        'prev_complexity': prev_vote,
        'task_id': task_id,
        'game_uuid': game_uuid,
        'user': vote_obj.user_id,
    })
    await broadcast.publish(channel=f'game-{game_uuid}', message=json.dumps(message))
    return vote_obj
