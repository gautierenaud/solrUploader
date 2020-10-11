import os

from flask import Flask, send_file
from flask_cors import cross_origin
from solr_uploader.config import collection
from solr_uploader.logger import log
from solr_uploader.solr import get_file

app = Flask(__name__)


@app.route('/file/<id_hash>', methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def retrieve(id_hash):
    file = get_file(collection, id_hash)
    if not file:
        return "Does not exist"

    filepath = file["doc"]["fullpath"][0]
    filename = file["doc"]["filename"][0]
    log.debug(f'Received retrieve request for {filepath}')

    if os.path.isfile(filepath):
        try:
            return send_file(filepath, attachment_filename=filename, as_attachment=True)
        except Exception as e:
            return str(e)
    else:
        return "Does not exist"


def start_endpoint():
    app.run()
