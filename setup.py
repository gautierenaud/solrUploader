import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

req = [
    'pypdf2',
    'requests'
]

dev_req = [
    'pytest',
    'flake8'
]

setuptools.setup(
    name='solrUploader',
    version='0.0.1',
    author='Renaud Tamon GAUTIER',
    install_requires=req,
    extras_require={
        'dev': dev_req
    },
    entry_points={
        'console_scripts': ['solr-upload=solr_uploader.uploader:main'],
    }
)
