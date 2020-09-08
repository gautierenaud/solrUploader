import argparse
from solr_uploader.logger import log
from solr_uploader.solr import *


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('folder', help='Input folder to upload', type=str)
    parser.add_argument('--config', '-c', help='Configuration file for the uploader (toml format)', type=str)
    parser.add_argument('--verbose', '-v', help='Set the verbosity of the script',
                        choices=['DEBUG', 'INFO', 'WARN', 'ERROR'])

    args = parser.parse_args()
    return args.folder, args.config, args.verbose


def main():
    folder, config, verbose = parse_args()

    if verbose:
        log.setLevel(verbose)
        log.info(f'Log level set to {verbose}')

    for i in range(10):
        upload_file(str(i), f'title is {i}')
    commit()

    get_collection_info()
