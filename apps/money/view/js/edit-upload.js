// Upload
$(document).ready(function() {
    $("#upload-div").on("dragover", function(dragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
    });

    $("#upload-div").on("drop", function(dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();

        const file = dropEvent.originalEvent.dataTransfer.files[0];

        if (file.type != "text/csv") {
            return alert(`File type is ${file.type}\nOnly CSVs accepted`);
        }

        const matches = file.name.match(/^(\d\d_20\d\d)_(amazon|freedom|bank)/);
        if (matches) {
            uploadTransactions(matches[1], matches[2], file);
        } else {
            alert("Unable to parse filename!");
        }
    });
});

async function uploadTransactions(month, account, file) {
    ajaxPOST(
        "api/upload",
        { month: month, account: account, csv: await file.text() },
        function() {
            ajaxGET(`api/load?month=${month}&account=${account}`, makeTransactionsTable);
            $("#month").val(month);
            $("#account").val(account);
        }
    );
}
