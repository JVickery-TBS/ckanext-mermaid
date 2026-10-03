from typing import cast
from ckan.types import Schema

from ckan.plugins.toolkit import get_validator, asbool, config

from ckanext.mermaid import helpers


def get_view_schema() -> Schema:
    not_empty_validator = get_validator('not_empty')
    unicode_safe_validator = get_validator('unicode_safe')

    i18n_enabled = asbool(config.get(
        'ckanext.mermaid.internal_i18n', False))
    required_locales, default_locale, available_locales = \
        helpers.get_supported_locales()

    schema = {
        'markdown_%s' % default_locale: [not_empty_validator, unicode_safe_validator],
    }

    if not i18n_enabled:
        # not using multilingual fields
        return cast(Schema, schema)

    for locale in available_locales:
        if locale == default_locale:
            continue
        if locale in required_locales:
            schema['markdown_%s' % locale] = [not_empty_validator,
                                              unicode_safe_validator]
            continue
        schema['markdown_%s' % locale] = [unicode_safe_validator]

    return cast(Schema, schema)
