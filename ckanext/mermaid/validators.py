import json

from typing import Any
from ckan.types import Context

from ckan.plugins.toolkit import _, Invalid


def grid_stack_json(value: Any, context: Context):
    try:
        json.loads(value)
    except ValueError:
        raise Invalid(_('Must be a JSON string'))
    return value
