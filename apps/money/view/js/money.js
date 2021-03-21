// Upload
$(document).ready(function() {
    $("#upload").on("dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $("#upload").on("drop", function(event) {
        event.preventDefault();
        event.stopPropagation();

        let files = event.originalEvent.dataTransfer.files;

        ([...files]).forEach(function(file) {
            if (file.type != "text/csv") {
                return alert(`File type is ${file.type}\nOnly CSVs accepted`);
            }
            ajaxSave(file);
        });
    });
});

async function ajaxSave(file) {
    $.ajax({
        type: "POST",
        url: "api/upload",
        contentType: "plain/text",
        data: await file.text(),
        timeout: 2000,
        //success: function() {
        //    alert("AJAX success!");
        //},
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}


