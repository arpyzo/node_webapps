// Globals
var category;
var nextLinkId = 1;

// Setup
$(document).ready(function() {
    ajaxGET("api/list", setupNav);

    category = window.location.pathname.split("/")[2];
    if (category) {
        ajaxGET("api/load?category=" + category, appendLinks);
    }
});

function setupNav(navLinks) {
    for (link of navLinks.split("\n").slice(0, -1)) {
        $("#nav-div").append(`<a class="nav-link" href="${link.toLowerCase()}">${link}</a>`);
    }
}

function appendLinks(links) {
    for (link of links.split("\n").slice(0, -1)) {
        appendLink(link);
    }

    setupControls();
}

function setupControls() {
    $("#add-div").append('<button id="add-btn" type="button">Add</button>');
    $("#add-div").append('<input id="new-link" type="text" size="100">');

    $("#add-btn").click(function() {
        const link = $("#new-link").val();
        ajaxPATCH("api/append", {category: category, link: link}, appendLink, link);
    });

    $("#links-div").on("click", ".remove-btn", function() {
        const linkDivId = $(this).closest("div").attr("id");
        const link = $(`#${linkDivId} a`).attr("href");
        ajaxDELETE("api/remove", { category: category, link: link }, removeLink, linkDivId);
    });
}

// Link Handling
function appendLink(link) {
    $("#new-link").val("");

    $("#links-div").append(`<div id="link-div-${nextLinkId}" class="link-div"></div>`);
    $("#link-div-" + nextLinkId).append(`<button class="remove-btn" type="button">Remove</button>`);
    $("#link-div-" + nextLinkId).append(`<a href="${link}">${link}</a>`);

    nextLinkId++;
}

function removeLink(linkDivId) {
    $(`#${linkDivId}`).remove();
}
