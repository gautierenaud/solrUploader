import fnmatch
import mimetypes
import os
import sys

import PyPDF2
import toml

from solr_uploader.logger import log
from solr_uploader.solr import solr


def scan_path(path):
    for child_item in os.listdir(path):
        full_path = os.path.join(path, child_item)
        if os.path.isfile(full_path):
            scan_file(full_path)
        elif os.path.isdir(full_path):
            scan_path(full_path)
        else:
            log.warn(f'Unknown file type at: {full_path}')


def scan_file(file_path):
    content = get_content(file_path)
    if not content:
        log.warn(f'No content for {file_path}')
    else:
        solr.upload_localfile(os.path.basename(file_path), file_path, content)


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
    log.debug(f'Extracting pdf content from {file_path}')
    content = ""
    with open(file_path, 'rb') as pdf:
        reader = PyPDF2.PdfFileReader(pdf, strict=False)
        for page in range(reader.numPages):
            current_page = reader.getPage(page)
            content += current_page.extractText()
    return content


def get_text_content(file_path):
    content = ""
    with open(file_path, 'r') as f:
        content = f.read()
    return content
