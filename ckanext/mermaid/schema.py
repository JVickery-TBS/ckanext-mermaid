from typing import cast
from ckan.types import Schema

from ckan.plugins.toolkit import get_validator


def get_view_schema() -> Schema:
    not_empty_validator = get_validator('not_empty')
    unicode_safe_validator = get_validator('unicode_safe')
    grid_stack_json_validator = get_validator('grid_stack_json')

    schema = {
        'mermaid_dashboard': [not_empty_validator, unicode_safe_validator,
                              grid_stack_json_validator]
    }

    return cast(Schema, schema)
