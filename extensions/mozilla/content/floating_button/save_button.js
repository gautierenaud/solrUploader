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

var siteLabel = document.createElement("div");
siteLabel.classList.add("kbbuttonlabel");
siteLabel.textContent = "URL";
content.appendChild(siteLabel);

var siteURL = document.createElement("div");
siteURL.textContent = window.location.href;
siteURL.classList.add("kbonelineinput");
content.appendChild(siteURL);

var titleLabel = document.createElement("div");
titleLabel.classList.add("kbbuttonlabel");
titleLabel.textContent = "Title";
content.appendChild(titleLabel);

var titleElem = document.createElement("div");
titleElem.id = "kbsavetitle";
titleElem.contentEditable = "true";
titleElem.textContent = document.title;
titleElem.classList.add("kbonelineinput");
content.appendChild(titleElem);

var editorHolder = document.createElement("div");
editorHolder.id = "kbsavenoteholder";
editorHolder.classList.add("base2bg", "kbeditorholder");

var noteEditor = document.createElement("textarea");
noteEditor.id = "kbsavenote";
editorHolder.appendChild(noteEditor);

content.appendChild(editorHolder);

var todoCheck = document.createElement("input");
todoCheck.type = "checkbox";
content.appendChild(todoCheck);

var todoText = document.createElement("div");
todoText.textContent = "Mark as TODO";
content.appendChild(todoText);

var saveButton = document.createElement("button");
saveButton.onclick = saveAction;
saveButton.textContent = "Save";
content.appendChild(saveButton);

var cancelButton = document.createElement("button");
cancelButton.onclick = shrinkButtons;
cancelButton.textContent = "Cancel";
content.appendChild(cancelButton);

addDraggableMorphingButton(buttonHtml, content);

var mdeEditor = new EasyMDE({
    element: document.getElementById(noteEditor.id),
    placeholder: "Scribble something...",
    status: false,
});

// force the style of all the editor's elements
document.getElementById(editorHolder.id).querySelectorAll("*").forEach(
    function(val, _, _) {
        val.classList.add("base02");
    });