from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.dependencies import broadcast
from app.routers import default as default_router
from app.routers import game as game_router
from app.routers import users as users_router
from app.routers import ws as ws_router

from app.settings import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version='0.2.0',
    routes=ws_router.routes,
    on_startup=[broadcast.connect],
    on_shutdown=[broadcast.disconnect],
)

# add CORS support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_DOMAINS,
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,
)

# register API route
app.include_router(default_router.routes)
app.include_router(users_router.routes)
app.include_router(game_router.routes)

# configure connection to the database and declare path for the models
register_tortoise(
    app,
    db_url=settings.DB_URL,
    modules={'models': [
        'app.models',
        'aerich.models',  # aerich models should be registered to keep track of the applied migrations
    ]},
    generate_schemas=True,
    add_exception_handlers=True,
)
