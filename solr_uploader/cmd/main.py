import argparse
import sys

import solr_uploader.config as config
import solr_uploader.service.endpoint as serve
from solr_uploader.solr import solr
import solr_uploader.uploader as uploader
from solr_uploader.logger import log

def main():
    parser = argparse.ArgumentParser('knowledge')
    parser.add_argument('--verbose', '-v', help='Set the verbosity of the script',
                        choices=['DEBUG', 'INFO', 'WARN', 'ERROR'], default='INFO')

    subparsers = parser.add_subparsers(dest='command', required=True)

    upload_parser = subparsers.add_parser('upload')
    upload_parser.add_argument('folder', help='Input folder to upload (absolute path)', type=str)
    upload_parser.add_argument('--config', '-c', help='Configuration file for the uploader (toml format)', type=str)

    subparsers.add_parser('serve')

    solr_parser = subparsers.add_parser('solr')
    solr_subparser = solr_parser.add_subparsers(dest='solr_command', required=True)

    solr_rm_doc = solr_subparser.add_parser('rm')
    solr_rm_doc.add_argument('solr_doc_id', help='Id of the document to delete')
    solr_subparser.add_parser('rmcol')
    solr_subparser.add_parser('info')

    args = parser.parse_args()

    if args.verbose:
        log.setLevel(args.verbose)
        log.debug(f'Log level set to {args.verbose}')

    if args.command == 'upload':
        uploader.main(args.folder, args.config)
    elif args.command == 'serve':
        serve.start_endpoint()
    elif args.command == 'solr':
        if args.solr_command == 'rm':
            sys.exit(not solr.remove_file(args.solr_doc_id))
        if args.solr_command == 'rmcol':
            sys.exit(not solr.remove_collection())
        elif args.solr_command == 'info':
            print(solr.get_collection_info())


if __name__ == "__main__":
    main()
