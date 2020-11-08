/**
 * Drag the button around
 */

let movable = true;

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (!movable) { return; }

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        if (!movable) { return; }

        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        if (!movable) { return; }

        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var actionButton = document.createElement("div");
actionButton.classList.add("actionbutton");

var actionButtonHeader = document.createElement("div");
actionButtonHeader.classList.add("actionbuttonheader");
actionButtonHeader.id = "test";
actionButton.appendChild(actionButtonHeader);

var saveActionIcon = document.createElement("img");
saveActionIcon.src = browser.runtime.getURL("icons/save-32.png")
actionButtonHeader.appendChild(saveActionIcon);

var editSection = document.createElement("div");
editSection.classList.add("editSection");
editSection.id = "editsection";
editSection.style.display = "none";

var editSectionInputText = document.createElement("div");
editSectionInputText.contentEditable = "true";
editSectionInputText.textContent = "editme";
editSection.appendChild(editSectionInputText);

var saveButton = document.createElement("button");
saveButton.textContent = "Save";
editSection.appendChild(saveButton);

var cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.onclick = hideActionPane;
editSection.appendChild(cancelButton);

actionButtonHeader.appendChild(editSection);

actionButton.style.top = "5%";
actionButton.style.left = "5%";
document.body.prepend(actionButton);

dragElement(actionButton);

/**
 * don't resize the button when dragging
 */

let isSwiping = false;

document.getElementById('test').addEventListener('mousedown', () => {
    this.isSwiping = false;
});

document.getElementById('test').addEventListener('mousemove', () => {
    this.isSwiping = true;
});

document.getElementById('test').addEventListener('mouseup', e => {
    if (!this.isSwiping && e.button === 0) {
        showActionPane();
    }

    this.isSwiping = false;
});

/**
 * Hide/Show action pane
 */

function showActionPane() {
    var testElem = document.getElementById("test");
    testElem.setAttribute("status", "checked");

    document.getElementById("editsection").style.display = "block";

    movable = false;
}

function hideActionPane() {
    var testElem = document.getElementById("test");
    testElem.removeAttribute("status");

    document.getElementById("editsection").style.display = "none";

    movable = true;

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
}