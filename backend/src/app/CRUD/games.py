from fastapi import HTTPException
from ..core.config import DB_NAME, GAMES_COLLECTION
from ..models.GameSubmission import Game, Submit


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