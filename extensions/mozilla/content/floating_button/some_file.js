// create the moving element
var buttonHeader = document.createElement("div");
buttonHeader.classList.add("kbbuttonheader");
buttonHeader.setAttribute("movable", "true");
buttonHeader = document.body.appendChild(buttonHeader);

function addDraggableMorphingButton(iconHtml, contentDOM) {
    // create the containg element
    var button = document.createElement("div");
    button.classList.add("kbbutton");

    // append the buttonContent
    var buttonContentHolder = document.createElement("div");
    buttonContentHolder.innerHTML = iconHtml;
    buttonContentHolder.classList.add("kbbuttonicon");
    button.appendChild(buttonContentHolder);

    // append the morphedContent
    var morphedContentHolder = document.createElement("div");
    morphedContentHolder.appendChild(contentDOM);
    morphedContentHolder.classList.add("kbbuttoncontent");
    button.appendChild(morphedContentHolder);

    // make it draggable
    setUpDrag(button);

    setUpMorphing(button, morphedContentHolder);

    // add element to the page
    buttonHeader.appendChild(button);
}

function setUpDrag(elem) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elem.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (buttonHeader.getAttribute("movable") !== "true") { return; }

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
        if (buttonHeader.getAttribute("movable") !== "true") { return; }

        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        buttonHeader.style.top = (buttonHeader.offsetTop - pos2) + "px";
        buttonHeader.style.left = (buttonHeader.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        if (buttonHeader.getAttribute("movable") !== "true") { return; }

        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function showActionPane2(elem, contentElem) {
    elem.setAttribute("status", "checked");
    contentElem.style.display = "block";
    buttonHeader.setAttribute("movable", "false");
}

function hideActionPane2(elem, contentElem) {
    elem.removeAttribute("status");
    contentElem.style.display = "none";
    buttonHeader.setAttribute("movable", "true");

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
}

let isDragged = false;

function setUpMorphing(elem, morphedContent) {
    // don't resize the button when dragging
    elem.addEventListener('mousedown', () => {
        isDragged = false;
    });

    elem.addEventListener('mousemove', () => {
        isDragged = true;
    });

    elem.addEventListener('mouseup', e => {
        if (!isDragged && e.button === 0) {
            showActionPane2(elem, morphedContent);
        }

        isDragged = false;
    });
}

function shrinkButtons() {
    buttonHeader.childNodes.forEach(
        function(val, _, _) {
            val.removeAttribute("status");
            val.getElementsByClassName("kbbuttoncontent")[0].style.display = "none";
        }
    )

    buttonHeader.setAttribute("movable", "true");
    document.onmouseup = null;
    document.onmousemove = null;
}

document.body.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        shrinkButtons();
    }
});