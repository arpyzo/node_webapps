$(document).ready(function() {
    ajaxGET("api/list", displayArtists);
});

function displayArtists(artists) {
    for (artist of artists.split("\n")) {
        $("#artists-div").append(`<div>${artist}</div>`);
    });
}
