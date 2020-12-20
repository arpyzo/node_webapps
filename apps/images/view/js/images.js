// Globals
var imageList;

$(document).ready(function() {
    ajaxList();
});

function ajaxList() {
    $.ajax({
        type: "GET",
        url: "api/list",
        timeout: 2000,
        success: function(imageData) {
            imageList = imageData.split("\n");
            showRandomImage();
            setupClickHandler();
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function setupClickHandler() {
    $(document).click(function() {
            showRandomImage();
    });
}

function showRandomImage() {
    if (imageList) {
        $("#image").attr("src", imageList[Math.floor(Math.random() * imageList.length)]);
    }
}
