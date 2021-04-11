// Globals
var nextSubrowId = 0;
var selectedRow = "";

$(document).ready(function() {
    // Save & Load Buttons
    $("#load-btn").click(function() {
        ajaxGET(`api/load?month=${$("#month").val()}&account=${$("#account").val()}`, makeTransactionsTable);
    });

    $("#save-btn").click(function() {
        ajaxPUT("api/save", {
            month: $("#month").val(),
            account: $("#account").val(),
            transactions: gatherTransactions()
        });
    });

    // Hide Category Selector
    $(document).click(function(event) {
        if (event.target.className != "category") {
            $("#categories").hide();
        }
    });

    // Transaction Split & Delete
    $("#transactions").on("click", ".split", function() {
        const rowId = $(event.target).closest("tr").attr("id");

        $(`#${rowId}`).after(`
            <tr id="subrow-${++nextSubrowId}" class="subrow">
                <td class="delete"></td>
                <td colspan="3"></td>
                <td contenteditable="true"></td>
                <td class="essential"></td>
                <td class="category"></td>
            </tr>
        `);
    });

    $("#transactions").on("click", ".delete", function() {
        const subrowId = $(this).closest("tr").attr("id");

        $(`#${subrowId}`).remove();
    });

    // Essential Toggle
    $("#transactions").on("click", ".essential", function() {
        $(this).text($(this).text() == "false");
    });

    // Category Selector
    $("#transactions").on("click", ".category", function(event) {
        selectedRow = $(this).closest("tr").attr("id");

        $("#categories").css({
            "display": "grid",
            "position": "absolute",
            "top": event.pageY - 15,
            "left": event.pageX - 15
        });
        $("#categories").show();
    });

    $("#categories").on("click", ".category-select", function() {
        $(`#${selectedRow} .category`).text($(this).text());
    });
});

function makeTransactionsTable(transactions) {
    $("#transactions tr").remove();

    $("#transactions").append(`
        <tr>
            <th>id</th>
            <th>date</th>
            <th>description</th>
            <th>type</th>
            <th>amount</th>
            <th>essential</th>
            <th>category</th>
        </tr>
    `);

    for (transaction of transactions) {
        $("#transactions").append(`
            <tr id="row-${transaction.id}" class="row">
                <td class="split">${transaction.id}</td>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td class="essential">${transaction.essential}</td>
                <td class="category">${transaction.category}</td>
            </tr>
        `);

        if (transaction["parts"]) {
            for (part of transaction["parts"]) {
                $("#transactions").append(`
                    <tr id="subrow-${++nextSubrowId}" class="subrow">
                        <td class="delete"></td>
                        <td colspan="3"></td>
                        <td contenteditable="true">${part.amount.toFixed(2)}</td>
                        <td class="essential">${part.essential}</td>
                        <td class="category">${part.category}</td>
                    </tr>
                `);
            }
        }
    }
}

function gatherTransactions() {
    let transactions = [];

    $("tr").each(function() {
        if ($(this).attr("class") == "row") {
            transactions.push({
                id: parseInt($("td:nth-child(1)", this).text()),
                date: $("td:nth-child(2)", this).text(),
                description: $("td:nth-child(3)", this).text(),
                type: $("td:nth-child(4)", this).text(),
                amount: parseFloat($("td:nth-child(5)", this).text() || 0),
                essential: ($("td:nth-child(6)", this).text() == "true"),
                category: $("td:nth-child(7)", this).text()
            });
        }
        
        if ($(this).attr("class") == "subrow") {
            transactions[transactions.length - 1]["parts"] ??= [];

            transactions[transactions.length - 1]["parts"].push({
                amount: parseFloat($("td:nth-child(3)", this).text() || 0),
                essential: ($("td:nth-child(4)", this).text() == "true"),
                category: $("td:nth-child(5)", this).text()
            });
         }
    });

    return transactions;
}
