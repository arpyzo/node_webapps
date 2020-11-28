// Globals
var category;

// Load Links
$(document).ready(function() {
    nextLinkId = 1;

    category = window.location.pathname.split("/")[2];
    if (category) {
        ajaxLoad(category);
    }
});

function ajaxLoad(category) {
    $.ajax({
        type: 'GET',
        url: 'api/load?category=' + category,
        timeout: 2000,
        success: function(links) {
            displayLinks(links);
            setupAddButton();
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function displayLinks(links) {
    if (links.startsWith('Can\'t find links category: ')) {
        $('#links').append(links);
        return;
    }

    let linkArray = links.split('\n');
    for(let i = 0; i < linkArray.length; i++) {
        if (linkArray[i]) {
            appendLinkDiv(linkArray[i]);
        }
    }
}

// Add Links
function setupAddButton() {
    $('#add-input').append('<button id="add" type="button">Add</button>');
    $('#add-input').append('<input id="new-link" type="text" size="100">');

    $("#add").click(function() {
        ajaxAppend(category, $("#new-link").val());
    });
}

function ajaxAppend(category, link) {
    $.ajax({
        type: 'PUT',
        url: 'api/append',
        contentType: 'application/json',
        data: JSON.stringify({ category: category, link: link }),
        timeout: 2000,
        success: function() {
            appendLinkDiv(link);
            $("#new-link").val('');
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function appendLinkDiv(link) {
    $('#links').append('<div id="div-' + nextLinkId + '"></div>');
    $('#div-' + nextLinkId).append('<button id="remove-' + nextLinkId + '" type="button">Remove</button>');
    $('#div-' + nextLinkId).append('<a id="link-' + nextLinkId + '" href="' + link  + '">' + link + '</a><br><br>');

    // Set up remove handler
    $("#remove-" + nextLinkId).click(function() {
        removeLink(this.id.substring(7));
    });

    nextLinkId++;
}

// Remove Links
function removeLink(linkNum) {
    if (category) {
        link = $('#link-' + linkNum).attr('href');
        ajaxRemove(category, linkNum, link);
    }
}

function ajaxRemove(category, linkNum, link) {
    $.ajax({
        type: 'DELETE',
        url: 'api/remove',
        contentType: 'application/json',
        data: JSON.stringify({ category: category, link: link }),
        timeout: 2000,
        success: function() {
            removeLinkDiv(linkNum);
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function removeLinkDiv(linkNum) {
    $('#div-' + linkNum).remove();
}
