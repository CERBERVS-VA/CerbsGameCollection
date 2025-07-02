from typing import Any
from enum import Enum
from fastapi import Depends, FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.synchronous.mongo_client import MongoClient


# Check official docs: https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/
DB_NAME = "gamecollection"
SERVER_URL = "mongodb://admin:123@localhost:27017"


class GameStatus(str, Enum):
    planned = "planned"
    ongoing = "ongoing"
    completed = "completed"


class Game(BaseModel):
    id: int             #Eventually we replace the manually assigned ID with the ID the database assigns to it. Once we have an actual UI we should be able to access the ID without having to memorize it lmao
    title: str
    releaseyear: int | None = None
    publisher: str | None = None
    appid: int | None = None
    submittername: str
    status: str


class Submit(BaseModel):
    id: int
    title: str
    releaseyear: int | None = None
    publisher: str | None = None
    submittername: str


client: MongoClient = MongoClient(SERVER_URL)
db = client[DB_NAME]

app = FastAPI()


games: list[dict[str, str | int]]= [
    {
        "id": 0,
        "title": "minecraft",
        "releaseyear": 2005,
        "publisher": "Mojang",
        "appid": 354,
        "submittername": "PhulpUwU",
        "status": "ongoing"
    },
    {
        "id": 1,
        "title": "Cod of Duty",
        "releaseyear": 2023,
        "publisher": "Mojang",
        "appid": 345,
        "submittername": "PhulpOwO",
        "status": "planned"
    },
    {
        "id": 2,
        "title": "cuphead",
        "releaseyear": 26753,
        "publisher": "Mojang",
        "appid": 198,
        "submittername": "Dog3",
        "status": "completed"
    },
]

submits: list[dict[str, str | int]]= [
    {
        "id": 0,
        "title": "your mom 5",
        "releaseyear": 89,
        "publisher": "Steve",
        "submittername": "PhulpUwU",
    },
]


#curl -H 'Content-Type: application/json' -d '{"id": 3, "title": "Stardew Valley", "submittername": "Phill", "status": "planned"}' -X POST http://127.0.0.1:8000/games/
# function to add a new game to the games list
@app.post("/games")
def list_game(entry: Game):
    entry_dict = entry.model_dump() # BaseModel doesn't support .dict(), instead we use .model_dump()
    games.append(entry_dict)
    return games


# function to get games via query parameters
@app.get("/games")
def get_game(id: int | None = None, title: str | None = None, status: GameStatus | None = None) -> list[Any]:
    print(games)
    result: list[Any] = []
    for game in games:
        if id == game["id"]:
            if not game in result:
                result.append(game)
        if title == game["title"]:
            if not game in result:
                result.append(game)
        if status == game["status"]:
            if not game in result:
                result.append(game)
    return result


@app.post("/submits")
def submit_game(entry: Submit):
    entry_dict = entry.model_dump()
    submits.append(entry_dict)
    return submits


@app.get("/submits")
def get_submit(id: int | None = None, title: str | None = None, submittername: str | None = None) -> list[Any]:
    result: list[Any] = []
    for submit in submits:
        if id == submit["id"]:
            if not submit in result:
                result.append(submit)
        if title == submit["title"]:
            if not submit in result:
                result.append(submit)
        if submittername == submit["submittername"]:
            if not submit in result:
                result.append(submit)
    return result