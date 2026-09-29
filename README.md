# ckanext-mermaid

CKAN Extension for Mermaid Markdown as a Resource View. This plugin provides a new Resource View called `Power BI`. This plugin is meant for viewing Power BI Reports only. As such, all embed tokens are only generated with `View` permissions. This also means that the panes inside of the embedded reports will be limited to the View Only panes (exception for the Bookmarks pane, for any existing Report Bookmarks).


## Requirements

Compatibility with core CKAN versions:

| CKAN version    | Compatible?   |
| --------------- | ------------- |
| 2.6 and earlier | Not tested    |
| 2.7             | Not tested    |
| 2.8             | Not tested    |
| 2.9             | Not tested    |
| 2.10            | Yes    |

| Python version    | Compatible?   |
| --------------- | ------------- |
| 2.9 and earlier | Not tested    |
| 3.0 and later             | Yes    |

## Installation

To install ckanext-mermaid:

1. Activate your CKAN virtual environment, for example:

     `. /usr/lib/ckan/default/bin/activate`

2. Clone the source and install it on the virtualenv

    - `git clone --branch main --single-branch https://github.com/JVickery-TBS/ckanext-mermaid.git`
    - `cd ckanext-mermaid`
    - `pip install -e .`
    - `pip install -r requirements.txt`

3. Add `mermaid_view` to the `ckan.plugins` setting in your CKAN
   config file

4. Restart CKAN
