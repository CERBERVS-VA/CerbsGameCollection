from fastapi import FastAPI
from enum import Enum
from pydantic import BaseModel


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


app = FastAPI()


games= [
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
def get_game(id: int | None = None, title: str | None = None, status: GameStatus | None = None):
    print(games)
    result = []
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