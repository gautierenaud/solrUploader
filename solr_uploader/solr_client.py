import pysolr

url = "http://localhost:8983/solr/#/~cores/test"
ZooKeeper.CLUSTER_STATE = '/collections/random_collection/state.json'

# Create a client instance. The timeout and authentication options are not required.
solr = pysolr.Solr(url, always_commit=True)
# Note that auto_commit defaults to False for performance. You can set
# `auto_commit=True` to have commands always update the index immediately, make
# an update call with `commit=True`, or use Solr's `autoCommit` / `commitWithin`
# to have your data be committed following a particular policy.

# Do a health check.
solr.ping()

# How you'd index data.
solr.add([
    {
        "id": "doc_1",
        "title": "A test document",
    },
    {
        "id": "doc_2",
        "title": "The Banana: Tasty or Dangerous?",
        "_doc": [
            { "id": "child_doc_1", "title": "peel" },
            { "id": "child_doc_2", "title": "seed" },
        ]
    },
])
