// Globals
var imageList;
var imageHistory = [];

$(document).ready(function() {
    ajaxList();
});

$(window).on("popstate", function() {
    showPreviousImage();
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
        if ($("#image").attr("src") != "") {
            imageHistory.push(newImage);
            window.history.pushState({}, "", "/images/");
        }

        newImage = imageList[Math.floor(Math.random() * imageList.length)];
        $("#image").attr("src", newImage);
    }
}

function showPreviousImage() {
    $("#image").attr("src", imageHistory.pop());
}
