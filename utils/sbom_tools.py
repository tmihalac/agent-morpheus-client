from pydantic import BaseModel
from utils.github_tools import get_languages


class GitRepoRef(BaseModel):
    name: str
    ref: str
    languages: list[str]


class SbomInput(BaseModel):
    name: str
    tag: str
    git_repo: GitRepoRef
    sbom: dict


def __get_property(props, name) -> str | None:
    for prop in props:
        if prop['name'] == name:
            return prop['value']
    return None


def parse_sbom(sbom) -> SbomInput:
    name = sbom['metadata']['component']['name']
    tag = sbom['metadata']['component']['version']
    props = sbom['metadata']['properties']
    git_repo = __get_property(props, 'syft:image:labels:io.openshift.build.source-location')
    commit_url = __get_property(props, 'syft:image:labels:io.openshift.build.commit.url')
    commit_id = commit_url.split('/')[-1]
    languages = get_languages(git_repo.removeprefix('https://github.com/').replace('.git', ''))
    return SbomInput(name=name, tag=tag, sbom=sbom,
                     git_repo=GitRepoRef(name=git_repo, ref=commit_id, languages=languages))
