$(document).ready(function() {
    $("img").click(function() {
        if ($(this).hasClass("robert")) { console.log("ROBERT"); }
        if ($(this).hasClass("minus")) { console.log("MINUS"); }
    });
});
