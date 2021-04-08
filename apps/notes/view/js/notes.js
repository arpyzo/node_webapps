// Globals
var category;

// Load notes
$(document).ready(function() {
    ajaxList();

    category = window.location.pathname.split("/")[2];
    if (category) {
        ajaxLoad(category);
    }
});

function ajaxList() {
    $.ajax({
        type: 'GET',
        url: "api/list",
        timeout: 5000,
        success: function(notesList) {
            for (note of notesList.split("\n").slice(0, -1)) {
                $("#notes-links").append(`<a href="${note.toLowerCase()}">${note}</a>`);
            }
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function ajaxLoad(file) {
    $.ajax({
        type: 'GET',
        url: "api/load?category=" + category,
        timeout: 5000,
        success: function(notes) {
            $("#notes").val(notes);
            setupSaveButton();
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

// Save notes
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

// Textarea TAB
$(document).ready(function() {
    $("#notes").on('keydown', function(keyEvent) {
        if (keyEvent.key == "Tab") {
            keyEvent.preventDefault();

            let start = this.selectionStart;
            let end = this.selectionEnd;

            let value = $(this).val();

            $(this).val(value.substring(0, start) + "    " + value.substring(end));

            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
});
