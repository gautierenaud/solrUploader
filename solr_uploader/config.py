import fnmatch
import os

import toml

config = None

collection = 'documents'

def parse_configuration(config_path='extraction_config.toml'):
    with open(config_path, 'r') as toml_config:
        global config
        config = toml.loads(toml_config.read())

        # TODO: check the config contains everything necessary/default values (initialize class from dict ?)


def is_ignored(file_path):
    file_name = os.path.basename(file_path)
    for ignored_file in config['ignored']['files']:
        if fnmatch.fnmatch(file_name, ignored_file):
            return True
    return False
