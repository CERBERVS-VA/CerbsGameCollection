from typing import Annotated, Optional
from bson import ObjectId
from pydantic import BaseModel, Field

from .ObjectIdAnnotation import ObjectIdPydantic


class User(BaseModel):
    id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias = "_id", default = None)
    username: str
    password: str
    twitch_user: str | None = None