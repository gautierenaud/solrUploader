function sendSearchRequest() {
    let searchText = document.getElementById("searchbox").value;
    console.log("searching for : " + searchText);

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onload = function() {
        displayResults(xhr.response);
    };

    xhr.onerror = function() {
        console.log(this)
    }

    xhr.open('GET', `http://localhost:8899/solr/documents/query?debug=query&q=text:"${searchText}"~2&hl.fl=text&hl=on&usePhraseHighLighter=true&wt=json`, true);
    xhr.send();
}

function displayResults(results) {
    let resultDivs = document.getElementById("result");

    // remove previous results
    while (resultDivs.firstChild) {
        resultDivs.removeChild(resultDivs.lastChild);
    }

    for (const doc of results["response"]["docs"]) {
        var resultDiv = document.createElement("div");

        var headerDiv = document.createElement("div");
        headerDiv.className = "result-header";

        var filenameDiv = document.createElement("div");
        filenameDiv.className = "result-title";
        var filename = document.createTextNode(doc["doc_name"]);
        filenameDiv.appendChild(filename);
        headerDiv.appendChild(filenameDiv);

        if (doc["local_path"]) {
            var downloadDiv = document.createElement("a");
            downloadDiv.className = "download-button button";
            downloadDiv.addEventListener("click", function() {
                dowloadFile(doc);
            });
            headerDiv.appendChild(downloadDiv);
        }

        if (doc["web_url"]) {
            var linkDiv = document.createElement("a");
            linkDiv.className = "link-button button";
            linkDiv.href = doc["web_url"];
            headerDiv.appendChild(linkDiv);
        }

        resultDiv.appendChild(headerDiv);

        var previewDiv = document.createElement("pre");
        previewDiv.innerHTML = results["highlighting"][doc["id"]]["text"];
        resultDiv.appendChild(previewDiv);

        resultDivs.appendChild(resultDiv);
    }
}

function dowloadFile(doc) {
    console.log("content script sending message:" + JSON.stringify(doc));
    browser.runtime.sendMessage({ "download": doc });
}

function sendSavePageRequest() {
    browser.tabs.query({ currentWindow: true, active: true })
        .then((tabs) => {
            let url = tabs[0].url;
            console.log("saving : " + url);

            let xhr = new XMLHttpRequest();

            xhr.onerror = function() {
                console.log(this)
            }

            xhr.open('POST', `http://localhost:5000/web`, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({ "url": url }));
        })
}