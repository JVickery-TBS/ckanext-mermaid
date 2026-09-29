from typing import cast
from ckan.types import Schema

from ckan.plugins.toolkit import get_validator

from ckanext.mermaid import helpers


def get_view_schema() -> Schema:
    ignore_missing_validator = get_validator('ignore_missing')
    unicode_safe_validator = get_validator('unicode_safe')

    _required_locales, default_locale, available_locales = \
        helpers.get_supported_locales()

    schema = {
        'label_%s' % default_locale: [ignore_missing_validator, unicode_safe_validator],
        'markdown_%s' % default_locale: [unicode_safe_validator],
    }

    for locale in available_locales:
        if locale == default_locale:
            continue
        schema['label_%s' % locale] = [ignore_missing_validator,
                                       unicode_safe_validator]
        schema['markdown_%s' % locale] = [unicode_safe_validator]

    return cast(Schema, schema)
