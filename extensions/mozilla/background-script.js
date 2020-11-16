/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    console.log("background script received message: " + JSON.stringify(message));
    if (message["download"]) {
        downloadFileBack(message["download"]);
    } else if (message["save"]) {
        savePage(message["save"]);
    } else {
        console.log(`Unused message: ${JSON.stringify(message)}`);
    }
}

var apiUrl = "http://localhost:5000";

function downloadFileBack(doc) {
    console.log("[back] download file for :" + JSON.stringify(doc));

    var downloading = browser.downloads.download({
        url: `${apiUrl}/file/${doc.id}`,
        filename: doc.doc_name[0],
        conflictAction: 'uniquify'
    });
}

function savePage(page) {
    console.log("[back] saving page: " + JSON.stringify(page));

    var payload = {
        "url": page["url"],
        "title": page["title"]
    }
    if (page["note"]) {
        payload["attachments"] = page["note"];
    }

    let xhr = new XMLHttpRequest();

    xhr.onerror = function() {
        console.log(this);
    }

    xhr.onload = function(e) {
        console.log(xhr.response);
    }

    xhr.open('POST', `${apiUrl}/web`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(payload));
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);