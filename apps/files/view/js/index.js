$(document).ready(function() {
    $("#upload-div").on("dragover", function(dragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
    });

    $("#upload-div").on("drop", function(dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();

        const file = dropEvent.originalEvent.dataTransfer.files[0];

        //alert(file.size);

        uploadFile(file);
    });
});

async function uploadFile(file) {
    ajaxRequest({
        xhr: function() {
            var xhr = new window.XMLHttpRequest();

            xhr.upload.addEventListener("progress", function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    var completed = progressEvent.loaded / progressEvent.total;
                    $("#upload-div").text(`${(completed * 100).toFixed(2)}%`);
                }
            }, false);

            return xhr;
        },
        type: "POST",
        url: "api/upload",
        contentType: "application/octet-stream",
        headers: { "X-Filename": file.name },
        data: await file.arrayBuffer(),
        processData: false,
        function() {
            alert("Success");
        }
    }, 3600000);
}
