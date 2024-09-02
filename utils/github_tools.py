import requests

from utils.client_model import SUPPORTED_LANGUAGES

template = 'https://api.github.com/repos/{git_repo}/languages'


def get_languages(git_repo: str) -> list[str]:
    response = requests.get(template.format(git_repo=git_repo))
    if response.ok:
        languages = response.json()
        known_languages = []
        for language in languages.keys():
            if language in SUPPORTED_LANGUAGES:
                known_languages.append(language)
        return known_languages
    raise Exception(f'GitHub - get_languages: {response.status_code} - {response.reason}')
