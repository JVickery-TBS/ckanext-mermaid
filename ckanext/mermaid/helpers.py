from typing import List, Tuple

from ckan.plugins.toolkit import h, config


def get_supported_locales() -> Tuple[List[str], str, List[str]]:
    required_locales = config.get(
        'ckanext.mermaid.required_locales', '').split()

    default_locale = config.get('ckan.locale_default', 'en')

    if default_locale not in required_locales:
        # always require the default locale
        required_locales.append(default_locale)

    available_locales = []
    core_locales = []

    core_locale_objects = h.get_available_locales()
    for locale_obj in core_locale_objects:
        core_locales.append(locale_obj.short_name)

    offered_locales = config.get(
        'ckanext.mermaid.locales_offered', '').split()

    if offered_locales:
        for locale in offered_locales:
            if locale not in core_locales:
                # we should only support locales that CKAN has
                continue
            available_locales.append(locale)
    else:
        available_locales = core_locales

    return required_locales, default_locale, available_locales


def mermaid_icon_uri() -> str:
    if config.get('ckan.root_path'):
        # if using a root_path, get the url_for_static
        return h.url_for_static('/mermaid.svg')
    return '/mermaid.svg'
