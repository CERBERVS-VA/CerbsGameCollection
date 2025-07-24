import json

from contextlib import asynccontextmanager
from typing import Any, Optional
from enum import Enum
from fastapi import Depends, FastAPI, HTTPException, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.synchronous.mongo_client import MongoClient
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from .models.ObjectIdAnnotation import ObjectIdPydantic
from bson import ObjectId

from .models.GameSubmission import Game, Submit
from database.mongodb import connect_to_db, close_db_connection, get_database


# Check official docs: https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/
DB_NAME = "gamecollection"
GAMES_COLLECTION = "poc"
SUBMIT_COLLECTION = "submit"


origins = ["*"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_db()
    yield
    await close_db_connection()

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, 
                   allow_origins = origins, 
                   allow_credentials = True, 
                   allow_methods = ["*"],
                   allow_headers = ["*"])


@app.get("/games")
async def list_games(
    db: AsyncIOMotorClient = Depends(get_database)
):
    cursor = db[DB_NAME][GAMES_COLLECTION]
    gamecursor = cursor.find()
    games: list[Game] = []
    async for game in gamecursor:
        print(game)
        if game is None:
            print("empty :((")
        else:
            games.append(Game(**game))
    return games


# adds game to POC collection
@app.post("/games")
async def addGame(
    entry: Submit,
    db: AsyncIOMotorClient = Depends(get_database)    
):
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) # BaseModel doesn't support .dict(), instead we use .model_dump()
    inserted_one = await db[DB_NAME][GAMES_COLLECTION].insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db[DB_NAME][GAMES_COLLECTION].find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")


@app.get("/submits/{id}")
async def read_submit(
    id: str,
    db: AsyncIOMotorClient = Depends(get_database)
):
    submit = await db[DB_NAME][SUBMIT_COLLECTION].find_one({"_id": ObjectId(id)})
    submit = Submit(**submit) # type: ignore
    return submit


@app.get("/submits")
async def read_submits(
    db: AsyncIOMotorClient = Depends(get_database)
):
    cursor = db[DB_NAME][SUBMIT_COLLECTION]
    submitcursor = cursor.find()
    submits: list[Submit] = []
    async for submit in submitcursor:
        if submit is None:
            print("empty :((")
        else:
            submits.append(Submit(**submit))
    return submits


@app.post("/submits")
async def create_submits(
    entry: Submit, 
    db: AsyncIOMotorClient = Depends(get_database)
):
    print(entry)
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) # BaseModel doesn't support .dict(), instead we use .model_dump()
    inserted_one = await db[DB_NAME][SUBMIT_COLLECTION].insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db[DB_NAME][SUBMIT_COLLECTION].find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")


@app.delete("/submits/{target_id}")
async def delete_submit(
    target_id: str, 
    db: AsyncIOMotorClient = Depends(get_database)
):
    submit = await db[DB_NAME]["submit"].find_one({"_id": ObjectId(target_id)})

    if submit is None:
        raise HTTPException(status_code = 404, detail = f"No Submission with id {target_id}")
    
    result = await db[DB_NAME]["submit"].delete_one({"_id": ObjectId(target_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code = 404, detail = f"No Submission with id {target_id}")
    else:
        raise HTTPException(status_code = 410, detail = f"Submission with id {target_id} successfully deleted")
