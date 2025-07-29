
# id=None title='ee' submitter='ee' status=<GameStatus.completed: 'completed'> release_year=-1 publisher=None
from enum import Enum
from typing import Annotated, Optional
from pydantic import BaseModel, BeforeValidator, Field
from bson import ObjectId

from .ObjectIdAnnotation import ObjectIdPydantic

PyObjectId = Annotated[str, BeforeValidator(str)]

class Submit(BaseModel):
    id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias = "_id", default = None)
    title: str
    submitter: str
    release_year: int = Field(alias = "releaseYear", default = -1)
    publisher: str | None = None
    

class GameStatus(str, Enum):
    planned = "planned"
    ongoing = "ongoing"
    completed = "completed"


class Game(Submit):
    appid: int | None = -1
    status: GameStatus | None = GameStatus.planned