$(document).ready(function() {
    nextLinkId = 1;

    category = urlParam('category');
    if (category != null) {
        ajaxLoad(category);
    }
});

function ajaxLoad(category) {
    $.ajax({
        type: 'GET',
        url: 'links?category=' + category,
        success: function(links) { displayLinks(links); },
        error: function(data, status, error) { alert("AJAX fail!\nStatus: " + status + "\nError: " + error); }
    });
}

function displayLinks(links) {
    if (links.startsWith('Can\'t find links category: ')) {
        $('#links').append(links);
        return;
    }

    var linkArray = links.split('\n');
    for(var i = 0; i < linkArray.length; i++) {
        if (linkArray[i]) {
            appendLinkDiv(linkArray[i]);
        }
    }
}
