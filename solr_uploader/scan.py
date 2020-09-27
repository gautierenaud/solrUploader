import fnmatch
import mimetypes
import os
import sys

import PyPDF2
import toml

from solr_uploader.logger import log
from solr_uploader.solr import upload_file


def scan_path(collection, path):
    for child_item in os.listdir(path):
        full_path = os.path.join(path, child_item)
        if os.path.isfile(full_path):
            scan_file(collection, full_path)
        elif os.path.isdir(full_path):
            scan_path(collection, full_path)
        else:
            log.warn(f'Unknown file type at: {full_path}')


def scan_file(collection, file_path):
    content = get_content(file_path)
    upload_file(collection, os.path.basename(file_path), file_path, content)


def get_mime(file_path):
    return mimetypes.MimeTypes().guess_type(file_path)[0]


def get_content(file_path):
    file_mime = get_mime(file_path)
    if not file_mime:
        log.debug(f'No mime type for {file_path}, try as text type')
        content = get_text_content(file_path)
    elif file_mime == "application/pdf":
        content = get_pdf_content(file_path)
    elif file_mime.startswith('text/'):
        content = get_text_content(file_path)

    return content


def get_pdf_content(file_path):
    content = ""
    with open(file_path, 'rb') as pdf:
        reader = PyPDF2.PdfFileReader(pdf)
        for page in range(reader.numPages):
            current_page = reader.getPage(page)
            content += current_page.extractText()
    return content


def get_text_content(file_path):
    content = ""
    with open(file_path, 'r') as f:
        content = f.read()
    return content
