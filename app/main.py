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
    id: int
    title: str
    releaseyear: int | None = None
    publisher: str | None = None
    appid: int | None = None
    submittername: str
    status: str


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
