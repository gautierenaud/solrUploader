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
});