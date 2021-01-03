from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model


class User(Model):
    id = fields.UUIDField(pk=True)
    name = fields.CharField(50)
    created = fields.DatetimeField(
        auto_now_add=True,
    )


User_Pydantic = pydantic_model_creator(User, name='User')
UserIn_Pydantic = pydantic_model_creator(User, name='UserIn', exclude_readonly=True)
