import fnmatch
import os

import toml

config = None


class Config():
    def __init__(self, config_path=''):
        parsed_config = parse_configuration(config_path)

        self.collection = configTernary(parsed_config, 'collection', 'documents')
        self.solr_url = configTernary(parsed_config, 'solr_urn', 'http://localhost:8983/solr')


def parse_configuration(config_path):
    if not config_path:
        return {}

    with open(config_path, 'r') as toml_config:
        global config
        config = toml.loads(toml_config.read())
    return config


def configTernary(config, field, default_value):
    return config[field] if field in config else default_value


def is_ignored(file_path):
    file_name = os.path.basename(file_path)
    for ignored_file in config['ignored']['files']:
        if fnmatch.fnmatch(file_name, ignored_file):
            return True
    return False


if not config:
    config = Config()
