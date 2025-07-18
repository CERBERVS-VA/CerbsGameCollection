from typing import Any, Optional
from enum import Enum
from fastapi import Depends, FastAPI, HTTPException
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

class Game(BaseModel):
    id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias = "_id", default = None)
    title: str
    appid: int | None = -1
    submitter: str
    status: GameStatus
    release_year: int = Field(alias = "releaseyear", default = -1)
    publisher: str | None = "None"


# id=None title='ee' submitter='ee' status=<GameStatus.completed: 'completed'> release_year=-1 publisher=None
class Submit(BaseModel):
    id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias = "_id", default = None)
    title: str
    submitter: str
    status: GameStatus
    release_year: int = Field(alias = "releaseyear", default = -1)
    publisher: str | None = None


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


# function to add a new game to the games list
@app.post("/games")
async def list_game(entry: Game):
    db = await connect()
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) # BaseModel doesn't support .dict(), instead we use .model_dump()
    inserted_one = await db.poc.insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db.poc.find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Game(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")

@app.post("/submit")
async def submit(entry: Submit):
    print("uwu")
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


# function to get games via query parameters
@app.get("/games")
async def get_game(id: str | None = None, title: str | None = None, status: GameStatus | None = None) -> list[Any]:
    db = await connect()
    cursor = None
    result: list[Any] = []
    if id:
        cursor = db.poc.find({"_id": ObjectId(id)})
    if title:
        cursor = db.poc.find({"title": title})
    if status:
        cursor = db.poc.find({"status": status})
    if cursor:
        async for game in cursor:
            result.append(Game(**game))
        return result
    else:
        raise HTTPException(status_code = 400, detail = "missing Query Parameters")


# function for viewers to add games to the submit list
@app.post("/games/submit")
async def submit_game(entry: Submit):
    db = await connect()
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True)
    inserted_one = await db.submit.insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db.submit.find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")


# function to get games from submit list
# MAKE SUBMIT COLLECTION CASE INSENSITIVE!!!!!!!!!
@app.get("/games/submit")
async def get_submit(id: str | None = None, title: str | None = None, submitter: str | None = None) -> list[Any]:
    db = await connect()
    cursor = None
    result: list[Any] = []
    if id:
        cursor = db.submit.find({"_id": ObjectId(id)})
    if title:
        cursor = db.submit.find({"title": title})
    if submitter:
        cursor = db.submit.find({"submitter": submitter})
    if cursor:
        async for game in cursor:
            result.append(Submit(**game))
        return result
    else:
        raise HTTPException(status_code = 400, detail = "missing Query Parameters")


# function to delete games in poc or submit lists
@app.delete("/games/remove")
async def delete_game(fromlist: ListType, id: str):
    db = await connect()
    if fromlist == "poc":
        await db.poc.delete_one({"_id": ObjectId(id)})
        return HTTPException(status_code = 404, detail = f"Object with ID {id} successfully deleted from Games")
    elif fromlist == "submit":
        await db.submit.delete_one({"_id": ObjectId(id)})
        return HTTPException(status_code = 404, detail = f"Object with ID {id} successfully deleted from Submits")
    else:
        raise HTTPException(status_code = 400, detail = "wrong or missing Query Parameters")


# add users
# MAKE USER COLLECTION CASE INSENSITIVE!!!!!!!!!
@app.post("/users")
async def add_user(entry: User):
    db = await connect()
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True)
    inserted_one = await db.user.insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_user = await db.user.find_one({"_id": inserted_one.inserted_id})
        if inserted_user:
            return User(**inserted_user)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding User")


# get Users (mostly for deleting them lol)
@app.get("/users")
async def get_user(id: str | None = None, username: str | None = None) -> list[Any]:
    db = await connect()
    cursor = None
    result: list[Any] = []
    if id:
        cursor = db.user.find({"_id": ObjectId(id)})
    if username:
        cursor = db.user.find({"username": username})
    if cursor:
        async for user in cursor:
            result.append(User(**user))
        return result
    else:
        raise HTTPException(status_code = 400, detail = "missing Query Parameters")
    

# delete users
@app.delete("/users")
async def delete_user(id: str):
    db = await connect()
    await db.user.delete_one({"_id": ObjectId(id)})
    return HTTPException(status_code = 404, detail = f"User with ID {id} successfully removed")
# something feels off about this tbh BUT IT WORKS :3


@app.get("/games/list")
async def list_games():
    db = await connect()
    cursor = db["poc"]
    games = cursor.find()
    green = []
    async for game in games:
        print(game)
        if game is None:
            print("empty :((")
        else:
            a = Game(**game)
            green.append(a)
    return green