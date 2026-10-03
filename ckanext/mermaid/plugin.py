from flask import has_request_context

from typing import Dict, Any, Callable
from ckan.types import DataDict, Context
from ckan.common import CKANConfig

import ckan.plugins as plugins
from ckan.lib.plugins import DefaultTranslation

from ckanext.mermaid import schema, helpers


class MermaidViewPlugin(plugins.SingletonPlugin, DefaultTranslation):
    """
    Integrate Mermaid Markdown JS library into a CKAN view.
    """
    plugins.implements(plugins.IConfigurer, inherit=True)
    plugins.implements(plugins.IResourceView, inherit=True)
    plugins.implements(plugins.ITranslation, inherit=True)
    plugins.implements(plugins.ITemplateHelpers, inherit=True)

    # IConfigurer
    def update_config(self, config: 'CKANConfig'):
        plugins.toolkit.add_template_directory(config, 'templates')
        plugins.toolkit.add_resource('assets', 'ckanext-mermaid')
        plugins.toolkit.add_public_directory(config, 'assets/images')

    # IResourceView
    def can_view(self, data_dict: DataDict) -> bool:
        return True

    def setup_template_variables(self,
                                 context: Context,
                                 data_dict: DataDict) -> Dict[str, Any]:
        label = None
        markdown = None
        fullscreen = False

        i18n_enabled = plugins.toolkit.asbool(
            plugins.toolkit.config.get(
                'ckanext.mermaid.internal_i18n', False))
        required_locales, default_locale, available_locales = \
            helpers.get_supported_locales()
        lang = default_locale
        if has_request_context():
            lang = plugins.toolkit.h.lang()

        resource_view = data_dict.get('resource_view', {})
        label = resource_view.get('label_%s' % lang, None)
        markdown = resource_view.get('markdown_%s' % lang, None)
        is_default_lang = False
        if not markdown:
            markdown = resource_view.get('markdown_%s' % default_locale, None)
            is_default_lang = True

        if (
          has_request_context() and
          hasattr(plugins.toolkit.request, 'view_args') and
          plugins.toolkit.request.view_args.get('view_id')):
            fullscreen = True

        return {'label': label,
                'markdown': markdown,
                'error': None,
                'required_locales': required_locales,
                'default_locale': default_locale,
                'available_locales': available_locales,
                'i18n_enabled': i18n_enabled,
                'is_default_lang': is_default_lang,
                'fullscreen': fullscreen}

    def view_template(self,
                      context: Context,
                      data_dict: DataDict) -> str:
        return 'mermaid/mermaid_view.html'

    def form_template(self,
                      context: Context,
                      data_dict: DataDict) -> str:
        return 'mermaid/mermaid_form.html'

    def info(self) -> Dict[str, Any]:
        return {
            'name': 'mermaid_view',
            'title': plugins.toolkit._('Mermaid Markdown'),
            'filterable': False,
            'icon': 'mermaid',
            'default_title': plugins.toolkit._('Mermaid Markdown'),
            'preview_enabled': False,
            'schema': schema.get_view_schema(),
            'iframed': False
        }

    # DefaultTranslation, ITranslation
    def i18n_domain(self) -> str:
        return 'ckanext-mermaid'

    # ITemplateHelpers
    def get_helpers(self) -> Dict[str, Callable[..., Any]]:
        return {'mermaid_icon_uri': helpers.mermaid_icon_uri}
