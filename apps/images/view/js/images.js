// Globals
var imageList;

$(document).ready(function() {
    //ajaxLoad();
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

//function ajaxLoad() {
//    $.ajax({
//        type: "GET",
//        url: "api/random",
//        timeout: 2000,
//        success: function(image) {
//            displayImage(image);
//        },
//        error: function(data, status, error) {
//            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
//        }
//    });
//}

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

//function displayImage(image) {
//    $("#image").attr("src", `data:image/${image.slice(3)};base64,${image.substr(3)}`);
//}
