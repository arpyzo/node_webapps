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

        const matches = file.name.match(/^((?:Amazon|Freedom|Amex|Bank)(?: \d{4})?) - (\d{2}) (20\d{2})/);
        if (matches) {
            uploadTransactions(matches[3] + "_" + matches[2], matches[1].toLowerCase().replace(" ", "_"), file);
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
