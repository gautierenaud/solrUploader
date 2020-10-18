from solr_uploader.logger import log
from solr_uploader.scan import scan_path
from solr_uploader.solr import collection_exists, commit, create_collection


def main(folder, config):
    collection = 'documents'
    if not collection_exists(collection):
        create_collection(collection)

    scan_path(collection, folder)
    commit(collection)
