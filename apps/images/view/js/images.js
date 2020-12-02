$(document).ready(function() {
    ajaxLoad();
});

function ajaxLoad() {
    $.ajax({
        type: "GET",
        url: "api/random",
        timeout: 2000,
        success: function(image) {
            displayImage(image);
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function displayImage(image) {
    $("#image").attr("src", `data:image/${image.slice(3)};base64,${image.substr(3)}`);
}
