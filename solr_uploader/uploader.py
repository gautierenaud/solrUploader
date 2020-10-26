from solr_uploader.logger import log
from solr_uploader.scan import scan_path
from solr_uploader.solr import solr


def main(folder, config):
    if not solr.collection_exists():
        solr.create_collection()

    scan_path(folder)
