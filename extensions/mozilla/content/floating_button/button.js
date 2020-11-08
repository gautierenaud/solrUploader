/**
 * Drag the button around
 */

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
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var elem = document.createElement('div');
elem.classList.add("actionbutton");
elem.innerHTML =
    '<div class="actionbuttonheader">\
        <label id="test" for="test">click me</label>\
    </div>';

elem.style.top = "5%";
elem.style.left = "5%";
document.body.prepend(elem);

dragElement(elem);

/**
 * don't resize the button when dragging
 */

function toggleButton() {
    var testElem = document.getElementById("test");
    if (testElem.hasAttribute("status")) {
        testElem.removeAttribute("status");
    } else {
        testElem.setAttribute("status", "checked");
    }
}

let isSwiping = false;

document.getElementById('test').addEventListener('mousedown', () => {
    this.isSwiping = false;
});

document.getElementById('test').addEventListener('mousemove', () => {
    this.isSwiping = true;
});

document.getElementById('test').addEventListener('mouseup', e => {
    if (!this.isSwiping && e.button === 0) {
        toggleButton();
    }

    this.isSwiping = false;
});