from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.mongodb import connect_to_db, close_db_connection
from .api.routing import router


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
app.include_router(router)