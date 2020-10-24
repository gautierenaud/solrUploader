import hashlib
import json
from datetime import datetime

import PyPDF2
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


def upload_document(collection, doc_name, doc_id, content, local_path=None, web_url=None):
    log.debug(f'Uploading "{doc_name}"')
    url = f'http://localhost:8983/solr/{collection}/update/json/docs'
    headers = {'Content-Type': 'application/json'}

    data = {
        "id": doc_id,
        "doc_name": doc_name,
        "text": content,
        "last_update": datetime.now().strftime('%y/%m/%d-%H:%M:%S')
    }
    if local_path:
        data['local_path'] = local_path
    if web_url:
        data['web_url'] = web_url

    r = requests.post(url, headers=headers, json=data)
    if r.status_code == 200:
        commit(collection)


def upload_localfile(collection, filename, fullpath, content):
    upload_document(collection, filename, hashlib.sha512(fullpath.encode('utf-8')).hexdigest(), content, local_path=fullpath)


def upload_pdf(collection, filename, pdf: PyPDF2.PdfFileReader, fullpath=None, url=None):
    if not pdf.getDocumentInfo().title:
        log.error('Could not get document name')
        return
    id = hashlib.sha512(pdf.getDocumentInfo().title.encode('utf-8')).hexdigest()

    content = ''
    for page in range(pdf.numPages):
        current_page = pdf.getPage(page)
        content += current_page.extractText()

    upload_document(collection, pdf.getDocumentInfo().title, id, content, fullpath, url)


def commit(collection):
    log.info(f'Commit to collection "{collection}"')
    requests.get(f'http://localhost:8983/solr/{collection}/update?commit=true&wt=json')


def get_collection_info(collection):
    r = requests.get(f'http://localhost:8983/solr/{collection}/query?debug=query&q=*:*&wt=json')
    return r.text


def get_file(collection, id):
    r = requests.get(f'http://localhost:8983/solr/{collection}/get?id={id}')
    if r.status_code == 200:
        return json.loads(r.text)
    return None


def remove_file(collection, id):
    headers = {'Content-Type': 'application/json'}
    data = {
        "delete": {
            "id": id
        }
    }

    r = requests.post(f'http://localhost:8983/solr/{collection}/update?commit=true', headers=headers, json=data)
    return r.status_code == 200

def remove_collection(collection):
    r = requests.post(f'http://localhost:8983/solr/admin/collections?action=DELETE&name={collection}')
    return r.status_code == 200

def search(collection, search_content):
    r = requests.get(f'http://localhost:8899/solr/{collection}/query?debug=query&q=text:"{search_content}"~2&hl.fl=text&hl=on&usePhraseHighLighter=true&wt=json')
    if r.status_code == 200:
        return json.loads(r.text)
    return None
