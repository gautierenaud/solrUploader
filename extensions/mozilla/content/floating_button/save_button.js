function saveAction() {
    sendSavePageRequest();
    shrinkButtons();
}

function sendSavePageRequest() {
    var saveMessage = {
        "save": {
            "url": window.location.href,
            "title": document.getElementById("kbsavetitle").textContent,
            "note": mdeEditor.value()
        }
    };
    console.log(saveMessage);

    browser.runtime.sendMessage(saveMessage).then(() => {
        console.log("finished");
    });
}

var buttonHtml = `<img class="kbbuttonicon" src="${browser.runtime.getURL("icons/save-32.png")}" />`;

var content = document.createElement("div");

var siteURL = document.createElement("div");
siteURL.textContent = window.location.href;
content.appendChild(siteURL);

var titleElem = document.createElement("div");
titleElem.id = "kbsavetitle";
titleElem.contentEditable = "true";
titleElem.textContent = document.title;
content.appendChild(titleElem);

var noteEditor = document.createElement("textarea");
noteEditor.id = "kbsavenote";
content.appendChild(noteEditor);

var saveButton = document.createElement("button");
saveButton.onclick = saveAction;
saveButton.textContent = "Save";
content.appendChild(saveButton);

var cancelButton = document.createElement("button");
cancelButton.onclick = shrinkButtons;
cancelButton.textContent = "Cancel";
content.appendChild(cancelButton);

addDraggableMorphingButton(buttonHtml, content);

var mdeEditor = new EasyMDE({ element: document.getElementById(noteEditor.id) });