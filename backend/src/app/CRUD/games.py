from bson import ObjectId
from fastapi import HTTPException
from pymongo import ReturnDocument
from ..core.config import DB_NAME, GAMES_COLLECTION
from ..models.GameSubmission import Game, Submit
from starlette import status
from starlette.status import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_403_FORBIDDEN


async def read_all_games(db):
    cursor = db[DB_NAME][GAMES_COLLECTION]
    gamecursor = cursor.find()
    games: list[Game] = []
    async for game in gamecursor:
        print(game)
        if game is None:
            print("read_all_games fucked up UwU")
        else:
            games.append(Game(**game))
    return games


async def create_game_entry(db, entry):
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) 
    inserted_one = await db[DB_NAME][GAMES_COLLECTION].insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db[DB_NAME][GAMES_COLLECTION].find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")
    

async def update_game_in_db(db, game_data, id):
    try:
        game_id = ObjectId(id)
        updated_game = await db[DB_NAME][GAMES_COLLECTION].find_one_and_update(
            {"_id": game_id},
            {"$set": game_data.dict()},
            return_document=ReturnDocument.AFTER
        )
        if updated_game:
            return Game(**updated_game)
        else:
            raise HTTPException(
                status_code=HTTP_404_NOT_FOUND,
                detail=f"Game with id {id} not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error! Could not update Game\n{e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update game in the database"
        )
