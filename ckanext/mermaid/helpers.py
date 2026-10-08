from ckan.plugins.toolkit import h, config


def mermaid_icon_uri() -> str:
    if config.get('ckan.root_path'):
        # if using a root_path, get the url_for_static
        return h.url_for_static('/mermaid.svg')
    return '/mermaid.svg'
