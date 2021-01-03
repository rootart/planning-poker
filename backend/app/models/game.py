from enum import Enum

from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.functions import Count
from tortoise.models import Model


class ComplexityTypes(Enum):
    ZERO = '0'
    HALF = '1/2'
    ONE = '1'
    TWO = '2'
    THREE = '3'
    FIVE = '5'
    EIGHT = '8'
    THIRTEEN = '13'


class Game(Model):
    id = fields.UUIDField(pk=True)
    author = fields.ForeignKeyField(
        'models.User',
        related_name='games',
        on_delete='CASCADE'
    )
    name = fields.CharField(50)
    created = fields.DatetimeField(
        auto_now_add=True,
    )


class Player(Model):
    user = fields.ForeignKeyField(
        'models.User',
        related_name='plays_in',
        on_delete='CASCADE',
    )
    game = fields.ForeignKeyField(
        'models.Game',
        on_delete='CASCADE',
    )
    joined = fields.DatetimeField(
        auto_now_add=True,
    )

    class Meta:
        unique_together = (('user', 'game', ), )


class Task(Model):
    author = fields.ForeignKeyField(
        'models.User',
        related_name='tasks',
        on_delete='CASCADE'
    )
    game = fields.ForeignKeyField(
        'models.Game',
        on_delete='CASCADE',
    )
    content = fields.TextField()
    complexity = fields.CharEnumField(
        enum_type=ComplexityTypes,
        max_length=100,
        null=True,
    )

    class Meta:
        ordering = ['-id', ]

    def __str__(self):
        return f'Task-{self.id}'

    async def vote_distribution(self):
        grouped_complexity = await (
            self
            .votes
            .all()
            .annotate(count=Count('id'))
            .group_by('complexity')
            .values('complexity', 'count')
        )
        return {
            compl['complexity']: compl['count'] for
            compl in grouped_complexity
        }


class Vote(Model):
    user = fields.ForeignKeyField(
        'models.User',
        related_name='votes',
        on_delete='CASCADE'
    )
    task = fields.ForeignKeyField(
        'models.Task',
        related_name='votes',
        on_delete='CASCADE'
    )
    complexity = fields.CharEnumField(
        enum_type=ComplexityTypes,
        max_length=100,
        null=True,
    )
    created = fields.DatetimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'task',), )


Game_Pydantic = pydantic_model_creator(Game, name='Game')
GameIn_Pydantic = pydantic_model_creator(Game, name='GameIn', exclude_readonly=True)

TaskIn_Pydantic = pydantic_model_creator(Task, name='TaskIn', exclude_readonly=True)
Task_Pydantic = pydantic_model_creator(Task, name='Task', exclude=['complexity'])
