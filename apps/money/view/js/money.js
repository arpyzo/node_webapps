$(document).ready(function() {
    $("#upload").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $("#upload").on("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
        alert("Dropped");
    });
});
