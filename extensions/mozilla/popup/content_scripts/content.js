/*
beastify():
* removes every node in the document.body,
* then inserts the chosen beast
* then removes itself as a listener
*/
function beastify(request, sender, sendResponse) {
    insertButton();
}

function insertButton() {
    var beastImage = document.createElement("button");
    document.body.appendChild(beastImage);
}

/*
Assign beastify() as a listener for messages from the extension.
*/
browser.runtime.onMessage.addListener(beastify);

insertButton();

console.log("content script is called");