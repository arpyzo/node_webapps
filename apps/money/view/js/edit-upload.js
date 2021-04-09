// Upload
$(document).ready(function() {
    $("#upload-div").on("dragover", function(dragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
    });

    $("#upload-div").on("drop", function(dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();

        let file = dropEvent.originalEvent.dataTransfer.files[0];

        if (file.type != "text/csv") {
            return alert(`File type is ${file.type}\nOnly CSVs accepted`);
        }

        let matches = file.name.match(/^(\d\d_20\d\d)_(amazon|freedom|bank)/);
        if (matches) {
            uploadTransactions(matches[1], matches[2], file);
        } else {
            alert("Unable to parse filename!");
        }
    });
});

async function uploadTransactions(month, account, file) {
    ajaxUpload({
        month: month,
        account: account,
        csv: await file.text()
    });
}

function ajaxUpload(object) {
    $.ajax({
        type: "POST",
        url: "api/upload",
        contentType: "application/json",
        data: JSON.stringify(object),
        timeout: 5000,
        success: function() {
            ajaxLoad(object.month, object.account);
            $("month").val(object.month);
            $("account").val(object.account);
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}
