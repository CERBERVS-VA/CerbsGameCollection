from typing import Any, Optional
from enum import Enum
from fastapi import Depends, FastAPI, HTTPException, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel, Field
from pymongo import MongoClient, AsyncMongoClient
from pymongo.synchronous.mongo_client import MongoClient
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from .models.ObjectIdAnnotation import ObjectIdPydantic
from bson import ObjectId
import json


# Check official docs: https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/
DB_NAME = "gamecollection"
SERVER_URL = "mongodb://admin:123@localhost:27017"


PyObjectId = Annotated[str, BeforeValidator(str)]


class GameStatus(str, Enum):
    planned = "planned"
    ongoing = "ongoing"
    completed = "completed"


class ListType(str, Enum):
    poc = "poc"
    submit = "submit"
    
# id=None title='ee' submitter='ee' status=<GameStatus.completed: 'completed'> release_year=-1 publisher=None
class Submit(BaseModel):
    id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias = "_id", default = None)
    title: str
    submitter: str
    release_year: int = Field(alias = "releaseYear", default = -1)
    publisher: str | None = None


class Game(Submit):
    appid: int | None = -1
    status: GameStatus | None = GameStatus.planned


class User(BaseModel):
    id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias = "_id", default = None)
    username: str
    password: str
    twitch_user: str | None = None


origins = ["*"]


app = FastAPI()
app.add_middleware(CORSMiddleware, 
                   allow_origins = origins, 
                   allow_credentials = True, 
                   allow_methods = ["*"],
                   allow_headers = ["*"])


async def connect():
    client: AsyncMongoClient = AsyncMongoClient(SERVER_URL)
    db = client[DB_NAME]
    return db


# EW fix pls, idk kill it CREATE COLLECTIONS PROPERLY ONCE UwU
async def make_collection():
    db = await connect()
    collection = db["poc"]
    collection = db["submit"]
    collection = db["user"]



# adds game to POC collection
@app.post("/games")
async def addGame(entry: Submit):
    print(entry)
    db = await connect()
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) # BaseModel doesn't support .dict(), instead we use .model_dump()
    inserted_one = await db.poc.insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db.poc.find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")


@app.get("/games")
async def list_games():
    db = await connect()
    cursor = db["poc"]
    gamecursor = cursor.find()
    games: list[Game] = []
    async for game in gamecursor:
        print(game)
        if game is None:
            print("empty :((")
        else:
            games.append(Game(**game))
    return games


@app.post("/submits")
async def submit(entry: Submit):
    print(entry)
    db = await connect()
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) # BaseModel doesn't support .dict(), instead we use .model_dump()
    inserted_one = await db.submit.insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db.submit.find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")
    

@app.get("/submits/{id}")
async def read_submits(id: str): # type: ignore
    db = await connect()
    submit = await db.submit.find_one({"_id": ObjectId(id)})
    submit = Submit(**submit) # type: ignore
    return submit


@app.get("/submits")
async def read_submits():
    db = await connect()
    cursor = db["submit"]
    submitcursor = cursor.find()
    submits: list[Submit] = []
    async for submit in submitcursor:
        if submit is None:
            print("empty :((")
        else:
            submits.append(Submit(**submit))
    return submits


@app.delete("/submits/{target_id}")
async def delete_submits(target_id: str):
    db = await connect()
    submit = await db.submit.find_one({"_id": ObjectId(target_id)})

    if submit is None:
        raise HTTPException(status_code = 404, detail = f"No Submission with id {target_id}")
    
    result = await db.submit.delete_one({"_id": ObjectId(target_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code = 404, detail = f"No Submission with id {target_id}")
    else:
        raise HTTPException(status_code = 410, detail = f"Submission with id {target_id} successfully deleted")