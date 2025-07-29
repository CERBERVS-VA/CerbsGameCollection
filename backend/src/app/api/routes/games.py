from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from ...database.mongodb import get_database
from ...models.GameSubmission import Submit
from ...CRUD.games import *


games_router = APIRouter()


#reads all games to display on website
@games_router.get("/games")
async def read_games(
    db: AsyncIOMotorClient = Depends(get_database)
):
    games = await read_all_games(db)
    return games
    

# adds submission to POC collection
@games_router.post("/games")
async def create_game_from_submit(
    submit: Submit,
    db: AsyncIOMotorClient = Depends(get_database)    
):
    game = await create_game_entry(db, submit)
    return game