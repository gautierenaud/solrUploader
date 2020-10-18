/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    console.log("background script received message: " + message);
    if (message["download"]) {
        downloadFileBack(message["download"]);
    } else {
        console.log("Unused message: message");
    }
}

function downloadFileBack(doc) {
    console.log("[back] download file for :" + JSON.stringify(doc));

    var downloading = browser.downloads.download({
        url: `http://localhost:5000/file/${doc.id}`,
        filename: doc.doc_name[0],
        conflictAction: 'uniquify'
    });
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);