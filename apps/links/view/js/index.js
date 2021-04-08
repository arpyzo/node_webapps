// Globals
var category;
var nextLinkId = 1;

$(document).ready(function() {
    ajaxGET("api/list", showNavLinks);

    category = window.location.pathname.split("/")[2];
    if (category) {
        ajaxGET("api/load?category=" + category, showMainLinks);
    }
});

function showNavLinks(links) {
    for (link of links.split("\n").slice(0, -1)) {
        $("#links-nav").append(`<a class="nav-link" href="${link.toLowerCase()}">${link}</a>`);
    }
}

function showMainLinks(links) {
    let linkArray = links.split("\n");
    for (let i = 0; i < linkArray.length; i++) {
        if (linkArray[i]) {
            appendLink(linkArray[i]);
        }
    }

    setupControls();
}

function setupControls() {
    $("#links-add").append('<button id="add" class="button" type="button">Add</button>');
    $("#links-add").append('<input id="new-link" type="text" size="100">');

    $("#add").click(function() {
        let link = $("#new-link").val();
        ajaxPATCH("api/append", {category: category, link: link}, appendLink, link);
    });

    $("#links").on("click", ".remove", function() {
        linkDivId = $(this).closest("div").attr("id");
        link = $(`#${linkDivId} a`).attr("href");
        ajaxDELETE("api/remove", { category: category, link: link }, removeLink, linkDivId);
    });
}

function appendLink(link) {
    $("#new-link").val("");

    $("#links").append(`<div id="link-div-${nextLinkId}" class="link-div"></div>`);
    $("#link-div-" + nextLinkId).append(`<button class="remove button" type="button">Remove</button>`);
    $("#link-div-" + nextLinkId).append(`<a href="${link}">${link}</a>`);

    nextLinkId++;
}

function removeLink(linkDivId) {
    $(`#${linkDivId}`).remove();
}
