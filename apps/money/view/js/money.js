// Upload
$(document).ready(function() {
    $("#upload").on("dragover", function(dragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
    });

    $("#upload").on("drop", function(dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();

        let files = dropEvent.originalEvent.dataTransfer.files;

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
