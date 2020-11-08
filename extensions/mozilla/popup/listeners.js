// Get the input field
var input = document.getElementById("searchbox");
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("searchbutton").click();
    }
});

var searchButton = document.getElementById("searchbutton");
searchButton.addEventListener("click", function(e) {
    sendSearchRequest();
    // var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    // gettingActiveTab.then((tabs) => {
    //     browser.tabs.sendMessage(tabs[0].id, { beastURL: "lala" });
    // });
});

// var saveButton = document.getElementById("savebutton");
// saveButton.addEventListener("click", function(e) {
//     // sendSavePageRequest();
//     insertButton();
// });

var tablinks = document.getElementsByClassName("tablinks");
for (i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click", function(e) {
        updateTabs(e);
    });
}