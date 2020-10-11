// add onclick event listeners
var searchButton = document.getElementById("searchbutton");
searchButton.addEventListener("click", function(e) {
    sendSearchRequest();
});

function sendSearchRequest() {
    let searchText = document.getElementById("searchbox").value;
    console.log(searchText);

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

// Get the input field
var input = document.getElementById("searchbox");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("searchbutton").click();
    }
});

function displayResults(results) {
    console.log("results: " + results);

    let resultDivs = document.getElementById("result");

    // remove previous results
    while (resultDivs.firstChild) {
        resultDivs.removeChild(resultDivs.lastChild);
    }

    if (!results["response"]["docs"]) {
        return;
    }

    for (const doc of results["response"]["docs"]) {
        var resultDiv = document.createElement("div");

        var newDiv = document.createElement("div");
        newDiv.className = "result-title";
        var newContent = document.createTextNode(doc["filename"]);
        newDiv.appendChild(newContent);
        resultDiv.appendChild(newDiv);

        var newHighlight = document.createElement("pre");
        newHighlight.innerHTML = results["highlighting"][doc["id"]]["text"];
        resultDiv.appendChild(newHighlight);

        resultDivs.appendChild(resultDiv);
    }
}