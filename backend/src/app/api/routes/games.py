from fastapi import APIRouter, Body, Depends, Path
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


@games_router.put("/games/{target_game_id}")
async def update_game(
    game = Body(...),
    target_game_id: str = Path(..., min_length=1),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # {'_id': 'string', 'title': 'string', 'submitter': 'string', 'releaseYear': -1, 'publisher': 'string', 'appid': -1, 'status': 'planned'}
    print(game)
    game = Game(**game)
    updated_game = await update_game_in_db(db, game, target_game_id)

    if updated_game:
        return updated_game
    else:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=f"Game with id {target_game_id} not found")
