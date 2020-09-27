document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("page-choice")) {
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onload = function() {
        displayResults(xhr.response);
    };

    xhr.onerror = function() {
        document.getElementById("result").innerHTML = "error " + this;
        console.log(this)
        console.log(xhr.getAllResponseHeaders())
    }

    xhr.open('GET', 'http://localhost:8899/solr/documents/query?debug=query&q=*:*&wt=json', true);
    xhr.send();
});

function displayResults(results) {
    let resultDiv = document.getElementById("result");
    for (const doc of results["response"]["docs"]) {
        var newDiv = document.createElement("div");
        var newContent = document.createTextNode(doc["filename"]);
        newDiv.appendChild(newContent);

        resultDiv.appendChild(newDiv)
    }
}