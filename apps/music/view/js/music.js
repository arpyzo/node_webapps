$(document).ready(function() {
    ajaxGetArtists();
});

function ajaxGetArtists() {
    $.ajax({
        type: "GET",
        url: "api/list",
        success: function(artists) {
            displayArtists(artists);
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

function displayArtists(artists) {
    var artistArray = artists.split("\n");
    artistArray.forEach(function(artist) {
        $("#artists").append("<div>" + artist + "</div>");
    });
}
