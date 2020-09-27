import json

import requests

from solr_uploader.logger import log


def collection_exists(collection: str):
    res = requests.get(f'http://localhost:8983/solr/admin/collections?action=COLSTATUS&collection={collection}&wt=json')
    json_res = json.loads(res.text)
    if collection in json_res:
        return True
    return False

def create_collection(collection: str):
    requests.get(f'http://localhost:8983/solr/admin/collections?&action=CREATE&name={collection}&numShards=1&wt=json')
    commit(collection)


def upload_file(collection, filename, fullpath, content):
    url = f'http://localhost:8983/solr/{collection}/update/json/docs'
    headers = {'Content-Type': 'application/json'}
    data = {
        "id": fullpath,
        "filename": filename,
        "fullpath": fullpath,
        "text": content
    }
    requests.post(url, headers=headers, json=data)


def commit(collection):
    log.info(f'Commit to collection "{collection}"')
    requests.get(f'http://localhost:8983/solr/{collection}/update?commit=true&wt=json')


def get_collection_info(collection):
    r = requests.get(f'http://localhost:8983/solr/{collection}/query?debug=query&q=*:*&wt=json')
    return r.text
