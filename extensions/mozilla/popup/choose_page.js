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
        var filename = document.createTextNode(doc["filename"]);
        filenameDiv.appendChild(filename);
        headerDiv.appendChild(filenameDiv);

        var downloadDiv = document.createElement("a");
        downloadDiv.className = "download-button button";
        downloadDiv.addEventListener("click", function() {
            dowloadFile(doc);
        });
        headerDiv.appendChild(downloadDiv);

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