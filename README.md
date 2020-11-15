# solr uploader

This repo will contain the scripts used to upload files to solr

# TODOs

* upload from different data sources (github, drive, dropbox, save web page, ...)
* get link / download file
* scan pdf attachment/notes
* Enrich website/file view (e.g. "Your notes related to SQL" on a page dealing with SQL)
* implement API to upload to solr
* whitelist
* blacklist
* todo list of file to upload (do you want to upload n elements or filter them ?)
* make the upload //
* detect language of uploaded files (https://lucene.apache.org/solr/guide/8_6/detecting-languages-during-indexing.html)
* Upload multiple json (https://lucene.apache.org/solr/guide/6_6/uploading-data-with-index-handlers.html)
* crawl documents in links (maybe with some depth limit, probably 1).
* TODO items. e.g. go on an interesting site, mark it for later (with an alarm ? regroup multiple TODOs in category ?)

# Debug extension

## Firefox

about:config > ui.popup.disable_autohide

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts

For tools downloading sites to pdf, need the right fonts on the local machine.