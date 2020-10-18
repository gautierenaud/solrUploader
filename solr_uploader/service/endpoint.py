import os
import io

import PyPDF2
import weasyprint
from flask import Flask, send_file, request
from flask_cors import cross_origin
from solr_uploader.config import collection
from solr_uploader.logger import log
from solr_uploader.solr import get_file, upload_pdf
import solr_uploader.config as config

app = Flask(__name__)


@app.route('/file/<id_hash>', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def retrieve(id_hash):
    file = get_file(collection, id_hash)
    if not file:
        return "Does not exist"

    filepath = file["doc"]["local_path"][0]
    filename = file["doc"]["doc_name"][0]
    log.debug(f'Received retrieve request for {filepath}')

    if os.path.isfile(filepath):
        try:
            return send_file(filepath, attachment_filename=filename, as_attachment=True)
        except Exception as e:
            return str(e)
    else:
        return "Does not exist"


@app.route('/web', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def save_website():
    json_data = request.get_json(silent=False)

    if not json_data or not json_data['url']:
        return 'Missing url', 400

    url = json_data['url']
    
    site = weasyprint.HTML(url)
    site_pdf = site.write_pdf()
    with io.BytesIO(site_pdf) as f:
        pdf = PyPDF2.PdfFileReader(f)
        upload_pdf(config.collection, pdf.getDocumentInfo().title, pdf, url=url)
    return "Ok"


def start_endpoint():
    app.run()
