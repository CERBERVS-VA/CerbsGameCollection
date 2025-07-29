from typing import Annotated, Any, Callable, Optional
from bson import ObjectId
from pydantic_core import core_schema
from pydantic import GetCoreSchemaHandler, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue


# https://stackoverflow.com/questions/76686267/what-is-the-new-way-to-declare-mongo-objectid-with-pydantic-v2-0
# We need to annotate a Type that checks for a valid Mongodb Object ID. 
# We use the ObjectId from bson (binary Json). It's used for serialization 


class ObjectIdPydantic():
    @classmethod
    def validate_object_id(cls, value: Any, handler: Callable[[Any], str]) -> ObjectId:
        """
        Custom Validator for Pydantic Model. 
        Validates and converts a value into a valid BSON ObjectId.

        Args:
            value (Any): The input to validate and potentially convert to an ObjectId.
            handler (_type_):  A Pydantic preprocessing function that transforms the input into a string-like value.

        Raises:
            ValueError: If the resulting value is not a valid ObjectId.

        Returns:
            ObjectId: A valid ObjectId instance for use in a Pydantic model.
        """
        if isinstance(value, ObjectId):
            return value
        
        # Uses a pydantic validator
        # something ObjectId.is_valid() will accept
        string_value = handler(value)
        if ObjectId.is_valid(string_value):
            return ObjectId(string_value)
        else:
            raise ValueError("Invalid ObjectId")
        
    # Defines the core validation logic for Pydantic to recognize ObjectId as a valid custom type.
    # Ensures that values passed to the model are validated and converted properly.
    # see: https://docs.pydantic.dev/latest/concepts/types/#customizing-validation-with-__get_pydantic_core_schema__
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: GetCoreSchemaHandler) -> core_schema.CoreSchema:
        assert source_type is ObjectId
        return core_schema.no_info_wrap_validator_function(
            function = cls.validate_object_id,
            schema = core_schema.str_schema(),
            serialization = core_schema.to_string_ser_schema()
        )
    
    # Provides the JSON Schema representation of the custom ObjectId type for model schema generation.
    # Required for full compatibility with Pydantic's `model_json_schema()` method.
    # see: https://docs.pydantic.dev/dev/errors/usage_errors/#custom-json-schema
    @classmethod
    def __get_pydantic_json_schema__(cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler) -> JsonSchemaValue:
        return handler(core_schema.str_schema())
    

# Annotated[ObjectId, ObjectIdPydantic]
### Usage:
# class ExampleModel(BaseModel):
#     id: Optional[Annotated[ObjectId, ObjectIdPydantic]] = Field(alias="_id", default=None)

# print(ExampleModel(_id='64b7abdecf2160b649ab6085'))  # id=ObjectId('64b7abdecf2160b649ab6085')
# print(ExampleModel(_id='64b7abdecf2160b649ab6085').model_dump_json())    # {"id":"64b7abdecf2160b649ab6085"}
# print(ExampleModel(_id=ObjectId()))  # id=ObjectId('6865a6f789ac2df7b90f83af')
# print(ExampleModel.model_json_schema()) # {'properties': {'id': {'title': 'Id', 'type': 'string'}}, 'required': ['id'], 'title': 'ExampleModel', 'type': 'object'}
# print(ExampleModel(_id='foobar'))  # will error