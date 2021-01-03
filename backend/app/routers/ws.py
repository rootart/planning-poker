import logging
from uuid import UUID

from fastapi import WebSocket
from starlette.concurrency import run_until_first_complete
from starlette.routing import WebSocketRoute
from websockets import ConnectionClosedError

from app.dependencies import broadcast
from app.settings import get_settings

settings = get_settings()

logger = logging.getLogger(__name__)


async def events_ws(websocket: WebSocket):
    game_uuid = websocket.path_params.get('game_uuid')
    try:
        await websocket.accept()
        await run_until_first_complete(
            (events_ws_receiver, {"websocket": websocket, 'game_uuid': game_uuid}),
            (events_ws_sender, {"websocket": websocket, 'game_uuid': game_uuid}),
        )
    except ConnectionClosedError:
        logger.info('Closed connection for websocket %s', websocket)


async def events_ws_receiver(websocket: WebSocket, game_uuid: UUID):
    async for message in websocket.iter_text():
        await broadcast.publish(channel=f"game-{game_uuid}", message=message)


async def events_ws_sender(websocket: WebSocket, game_uuid: UUID):
    async with broadcast.subscribe(channel=f"game-{game_uuid}") as subscriber:
        async for event in subscriber:
            await websocket.send_json(event.message)

routes = [
    WebSocketRoute("/ws/{game_uuid}/", events_ws, name="events_ws"),
]
