from fastapi import APIRouter
from fastapi.requests import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory='app/templates')


routes = APIRouter(
    tags=['default', ],
)


@routes.get('/', response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(
        'index.html',
        {
            'request': request,
        }
    )
