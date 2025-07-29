from fastapi import HTTPException
from bson import ObjectId
from ..core.config import DB_NAME, SUBMIT_COLLECTION
from ..models.GameSubmission import Game, Submit


async def read_submit_by_id(db, id):
    submit = await db[DB_NAME][SUBMIT_COLLECTION].find_one({"_id": ObjectId(id)})
    submit = Submit(**submit)
    return submit


async def read_all_submits(db):
    cursor = db[DB_NAME][SUBMIT_COLLECTION]
    submitcursor = cursor.find()
    submits: list[Submit] = []
    async for submit in submitcursor:
        if submit is None:
            print("empty :((")
        else:
            submits.append(Submit(**submit))
    return submits


async def create_submit_from_entry(db, entry):
    entry_dict = entry.model_dump(exclude_none=True, by_alias=True) 
    inserted_one = await db[DB_NAME][SUBMIT_COLLECTION].insert_one(entry_dict)
    if inserted_one.inserted_id:
        inserted_game = await db[DB_NAME][SUBMIT_COLLECTION].find_one({"_id": inserted_one.inserted_id})
        if inserted_game:
            return Submit(**inserted_game)
    else:
        raise HTTPException(status_code = 500, detail = "Error adding Document")
    

async def delete_submit(db, target_id):
    try: 
        result = await db[DB_NAME][SUBMIT_COLLECTION].delete_one({"_id": ObjectId(target_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code = 404, detail = f"No Submission with id {target_id}")
        else:
            print(f"Submission with ID {target_id} successfully deleted")
    except Exception as e: 
        print(e)
        raise HTTPException(status_code = 404, detail = f"Submission with id {target_id} successfully deleted")