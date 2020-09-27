import requests


def create_collection():
    requests.get("http://localhost:8983/solr/admin/collections?&action=CREATE&name=documents&numShards=1&wt=json")


def upload_file(id, title):
    url = 'http://localhost:8983/solr/documents/update/json/docs'
    headers = {'Content-Type': 'application/json'}
    data = {
        "id": id,
        "title": title,
        "text": "This is also a text"
    }
    r = requests.post(url, headers=headers, json=data)
    print(r.text)


def commit():
    r = requests.get("http://localhost:8983/solr/documents/update?commit=true&wt=json")
    print(r.text)


def get_collection_info():
    r = requests.get("http://localhost:8983/solr/documents/query?debug=query&q=*:*&wt=json")
    print(r.text)
