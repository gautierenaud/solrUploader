function updateTabs(e) {
    var targetLink = e.target.getAttribute("value");

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(targetLink).style.display = "block";
    e.currentTarget.className += " active";
}

// set default visible
document.getElementById("searchtab").style.display = "block";