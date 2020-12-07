// Globals
var category;

// Load Notes
$(document).ready(function() {
    category = window.location.pathname.split("/")[2];
    if (category) {
        ajaxLoad(category);
    }
});

function ajaxLoad(file) {
    $.ajax({
        type: 'GET',
        url: "api/load?category=" + category,
        timeout: 2000,
        success: function(notes) {
            $("#notes").val(notes);
            setupSaveButton();
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

// Save Links
function setupSaveButton() {
    $("#save-div").append('<button id="save" type="button">Save</button>');

    $("#save").click(function() {
        ajaxSave(category, $("#notes").val());
    });
}

function ajaxSave(category, notes) {
    $.ajax({
        type: "PUT",
        url: "api/save",
        contentType: "application/json",
        data: JSON.stringify({ category: category, notes: notes }),
        timeout: 2000,
        //success: function() {
        //    alert("AJAX success!");
        //},
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}
