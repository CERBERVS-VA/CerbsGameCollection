from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from starlette import status
from starlette.responses import Response

from ...database.mongodb import get_database
from ...core.config import DB_NAME, SUBMIT_COLLECTION
from ...models.GameSubmission import Submit
from ...CRUD.submits import *


submits_router = APIRouter()


# read submit entry by ID
@submits_router.get("/submits/{id}")
async def read_submit(
    id: str,
    db: AsyncIOMotorClient = Depends(get_database)
):
    submit = read_submit_by_id(db, id)
    return submit


# read all submits to display on homepage
@submits_router.get("/submits")
async def read_submits(
    db: AsyncIOMotorClient = Depends(get_database)
):
    submits = read_all_submits(db)
    return submits


# creates submit from form
@submits_router.post("/submits")
async def create_submits(
    data: Submit, 
    db: AsyncIOMotorClient = Depends(get_database)
):
    submit = await create_submit_from_entry(db, data)
    return submit


# removes entry from submits
@submits_router.delete("/submits/{target_id}")
async def delete_submits(
    target_id: str, 
    db: AsyncIOMotorClient = Depends(get_database)
):
    submit = await read_submit_by_id(db, target_id)
    if submit is None:
        raise HTTPException(status_code = 404, detail = f"No Submission with id {submit}")
    await delete_submit(db, target_id)
    return Response(status_code = status.HTTP_204_NO_CONTENT)