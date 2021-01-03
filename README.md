*Planning poker* (https://en.wikipedia.org/wiki/Planning_poker),  is a consensus-based, gamified technique for estimating, mostly used to estimate effort or relative size of development goals in software development.

---

## Overview

Application consists of two separate components UI (written in React) and Backend implementation in Python. 
The following frameworks and libraries form the base:
* UI
  - [React](https://reactjs.org/)
  - [Redux](https://redux.js.org/)
  - [Material UI](https://material-ui.com/)
  - [Mock Service Worker](https://mswjs.io/) (provides mocking and interception of requests on the network level)

* Backend
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [Tortoise ORM](https://tortoise-orm.readthedocs.io/en/latest/)
  - [Aerich](https://github.com/tortoise/aerich)(database migration tool)

* General:
  - [Docker](https://docs.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)
## Install

### Using Docker

Copy existing example of config for frontend:
```shell
  $ cp frontend/.env.local.example frontend/.env.local 
```

Ensure that your have required ports: 3000 (UI), 8000 (backend), 5432 (Postgres), 6379 (Redis) not being used by any other running applications.
Start local development environment using `docker-compose`
```shell
  $ docker-compose up
```
`Compose` will run in a foreground mode placing all the logs from the running containers in the shell. It could be run in a background mode

```shell
  $ docker-compose up -d 
```

Use `docker-compose ps` to check the status of running containers:

```shell
$ docker-compose ps 
        Name                      Command               State               Ports             
----------------------------------------------------------------------------------------------
plan-cards_backend_1   /start-reload.sh                 Up      80/tcp, 0.0.0.0:8000->8000/tcp
plan-cards_db_1        docker-entrypoint.sh postgres    Up      127.0.0.1:5432->5432/tcp      
plan-cards_redis_1     docker-entrypoint.sh redis ...   Up      6379/tcp                      
plan-cards_web_1       docker-entrypoint.sh npm start   Up      0.0.0.0:3000->3000/tcp  
```

Open http://localhost:3000 to make sure that UI is rendering properly and http://localhost:8000/docs/ to check swagger documentation of the APIs.


## Screenshots 

UI of game details with a few cast votes for the tasks.
![Game details](https://www.evernote.com/shard/s46/sh/3ad6fac8-eb2a-43c8-8e27-90d18e6065c5/1446c8a1104ac0c4/res/3253b39d-ada1-4eb3-842a-34b9f26cd7f4)

API documentation generated with FastAPI 
![API docs](https://www.evernote.com/shard/s46/sh/6be693fe-9f97-4331-94ac-8c11df93d187/11917e845c87c2b3/res/135e8ddb-25b9-40a5-bf4d-4beb8859308e)

## TODO
  * Finalise testing of the backend and frontend parts focusing on testing websockets communication
  * Implement features of explicit joining for the game as a player
  * Set voting time boundaries for each task in the game
  * Add explicit authentication backend
