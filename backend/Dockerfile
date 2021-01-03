FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./app/requirements /app/requirements/

EXPOSE 8000

RUN pip install -r /app/requirements/requirements-dev.txt
