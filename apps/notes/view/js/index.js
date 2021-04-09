// Globals
var category;

// Setup
$(document).ready(function() {
    ajaxGET("api/list", setupNav);

    category = window.location.pathname.split("/")[2];
    if (category) {
        ajaxGET("api/load?category=" + category, insertNotes);
    }
});

function setupNav(navLinks) {
    for (link of navLinks.split("\n").slice(0, -1)) {
        $("#nav-div").append(`<a class="nav-link" href="${link.toLowerCase()}">${link}</a>`);
    }
}

function insertNotes(notes) {
    $("#notes-area").val(notes);
    setupSaveButton();
}

function setupSaveButton() {
    $("#save-div").append('<button id="save-btn" type="button">Save</button>');

    $("#save-btn").click(function() {
        ajaxPUT("api/save", {category: category, notes: $("#notes-area").val()});
    });
}

// Textarea TAB
$(document).ready(function() {
    $("#notes-area").on('keydown', function(keyEvent) {
        if (keyEvent.key == "Tab") {
            keyEvent.preventDefault();

            const start = this.selectionStart;
            const end = this.selectionEnd;
            const text = $(this).val();
            $(this).val(text.substring(0, start) + "    " + text.substring(end));

            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
});
