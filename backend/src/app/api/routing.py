from fastapi import APIRouter

from .routes.games import games_router
from .routes.submits import submits_router


router = APIRouter()
router.include_router(games_router, tags=["Game Routes"])
router.include_router(submits_router, tags=["Submit Routes"])