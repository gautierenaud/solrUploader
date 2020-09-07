import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

req = []

dev_req = [
    'pytest',
    'flake8'
]

setuptools.setup(
    install_requires=req,
    extras_require={
        'dev': dev_req
    }
)
