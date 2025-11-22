// Globals
var imageList;
var imageHistory = [];

$(document).ready(function() {
    ajaxGET("api/list", setupImageCycling);
});

$(window).on("popstate", function() {
    showPreviousImage();
});

function setupImageCycling(imageData) {
    imageList = imageData.split("\n");

    showRandomImage();

    $(document).click(function() {
        showRandomImage();
    });
}

function showRandomImage() {
    if (!imageList) {
        return;
    }

    if ($("#image").attr("src")) {
        imageHistory.push($("#image").attr("src"));
        window.history.pushState({}, "", "/private/");
    }

    newImage = imageList[Math.floor(Math.random() * imageList.length)];
    $("#image").attr("src", newImage);
}

function showPreviousImage() {
    $("#image").attr("src", imageHistory.pop());
}
