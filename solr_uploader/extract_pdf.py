#!/usr/bin/env python3

import sys
import os
import PyPDF2
import mimetypes
import toml
import fnmatch

config = None


def parse_configuration(config_path='extraction_config.toml'):
    with open(config_path, 'r') as toml_config:
        global config
        config = toml.loads(toml_config.read())

        # TODO: check the config contains everything necessary/default values (initialize class from dict ?)


def is_ignored(file_path):
    file_name = os.path.basename(file_path)
    for ignored_file in config['ignored']['files']:
        if fnmatch.fnmatch(file_name, ignored_file):
            return True
    return False


def get_mime(file_path):
    return mimetypes.MimeTypes().guess_type(file_path)[0]


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


parse_configuration()
print(config)

file_path = sys.argv[1]

if is_ignored(file_path):
    print(f'{file_path} is ignored')
    sys.exit(0)

file_mime = get_mime(file_path)
print(file_mime)
if file_mime == "application/pdf":
    content = get_mime(file_path)
elif file_mime.startswith('text/'):
    content = get_text_content(file_path)

# print(content)
