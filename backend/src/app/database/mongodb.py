from motor.motor_asyncio import AsyncIOMotorClient

from ..core.config import SERVER_URL


class DBConnection:
    client: AsyncIOMotorClient = None  # type: ignore


db = DBConnection()


async def get_database() -> AsyncIOMotorClient:
    return db.client


async def connect_to_db() -> None:
    db.client = AsyncIOMotorClient(str(SERVER_URL))
    
    
async def close_db_connection() -> None:
    db.client.close()
