import hashlib
import json
from datetime import datetime

import PyPDF2
import requests

from solr_uploader.logger import log
from solr_uploader.config import config


class Solr():
    def __init__(self, config):
        self._config = config

    def collection_exists(self, collection=None):
        if not collection:
            collection = self._config.collection

        res = requests.get(
            f'{self._config.solr_url}/admin/collections?action=COLSTATUS&collection={collection}&wt=json')
        json_res = json.loads(res.text)
        if self._config.collection in json_res:
            return True
        return False

    def create_collection(self, collection=None):
        if not collection:
            collection = self._config.collection

        requests.get(f'{self._config.solr_url}/admin/collections?&action=CREATE&name={collection}&numShards=1&wt=json')
        solr.commit()

    def upload_document(self, doc_name, content, attachments=None, local_path=None, web_url=None):

        log.debug(f'Uploading "{doc_name}"')
        url = f'http://localhost:8983/solr/{self._config.collection}/update?wt=json'
        headers = {'Content-Type': 'application/json'}

        doc_id = f'urn:document:{get_content_type(web_url=web_url, local_path=local_path)}:{doc_name}'

        data = {
            'id': doc_id,
            'doc_name': doc_name,
            'content': content,
            'last_update': datetime.now().strftime('%y/%m/%d-%H:%M:%S')
        }

        if attachments:
            attachments_id = f'urn:attachment:{get_content_type(web_url=web_url, local_path=local_path)}:{doc_name}'
            data['_childDocuments_'] = [{
                'id': attachments_id,
                'content': attachments,
            }]

        if local_path:
            data['local_path'] = local_path
        if web_url:
            data['web_url'] = web_url

        log.debug(f'uploading payload {data}')

        r = requests.post(url, headers=headers, json=[data])
        log.debug(r.content)
        if r.status_code == 200:
            self.commit()

    def upload_localfile(self, filename, fullpath, content):
        self.upload_document(filename, content, local_path=fullpath)

    def upload_pdf(self, filename, pdf: PyPDF2.PdfFileReader, fullpath=None, url=None):
        if not pdf.getDocumentInfo().title:
            log.error('Could not get document name')
            return

        content = ''
        for page in range(pdf.numPages):
            current_page = pdf.getPage(page)
            content += current_page.extractText()

        self.upload_document(pdf.getDocumentInfo().title, content, local_path=fullpath, web_url=url)

    def commit(self):
        log.info(f'Commit to collection "{self._config.collection}"')
        requests.get(f'http://localhost:8983/solr/{self._config.collection}/update?commit=true&wt=json')

    def get_collection_info(self):
        r = requests.get(f'http://localhost:8983/solr/{self._config.collection}/query?debug=query&q=*:*&wt=json')
        return r.text

    def get_file(self, id):
        r = requests.get(f'http://localhost:8983/solr/{self._config.collection}/get?id={id}')
        if r.status_code == 200:
            return json.loads(r.text)
        return None

    def remove_file(self, id):
        headers = {'Content-Type': 'application/json'}
        data = {
            'delete': {
                'id': id
            }
        }

        r = requests.post(f'http://localhost:8983/solr/{self._config.collection}/update?commit=true', headers=headers, json=data)
        return r.status_code == 200

    def remove_collection(self):
        r = requests.post(f'http://localhost:8983/solr/admin/collections?action=DELETE&name={self._config.collection}')
        return r.status_code == 200

    def search(self, search_content):
        r = requests.get(
            f'http://localhost:8899/solr/{self._config.collection}/query?debug=query&q=content:"{search_content}"~2 OR doc_name:"{search_content}"&hl.fl=content&hl=on&usePhraseHighLighter=true&wt=json')
        if r.status_code == 200:
            return json.loads(r.text)
        return None


def get_content_type(web_url=None, local_path=None):
    if web_url:
        return 'web'
    elif local_path:
        return 'local'
    return 'unknown'


solr = None
if not solr:
    solr = Solr(config)
