// Globals
var nextSubrowId = 0;
var selectedRow = "";
var selectedCategory = "";

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
                <td colspan="4"></td>
                <td contenteditable="true"></td>
                <td id="category-1" class="category"></td>
                <td id="category-2" class="category"></td>
                <td id="category-3" class="category"></td>
                <td id="category-4" class="category"></td>
            </tr>
        `);
    });

    $("#transactions").on("click", ".delete", function() {
        const subrowId = $(this).closest("tr").attr("id");

        $(`#${subrowId}`).remove();
    });

    // Category Selector
    $("#transactions").on("click", ".category", function(event) {
        selectedRow = $(this).closest("tr").attr("id");
        selectedCategory = $(this).attr("id");

        $("#categories").css({
            "display": "grid",
            "position": "absolute",
            "top": event.pageY - 15,
            "left": event.pageX - 15
        });
        $("#categories").show();
    });

    $("#categories").on("click", ".category-select", function() {
        $(`#${selectedRow} #${selectedCategory}`).text($(this).text());
    });
});

function makeTransactionsTable(transactions) {
    for (transaction of transactions) {
        $("#transactions").append(`
            <tr id="row-${transaction.id}" class="row">
                <td class="split">${transaction.id}</td>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.vendor}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td id="category-1" class="category">${transaction.categories[0] || ""}</td>
                <td id="category-2" class="category">${transaction.categories[1] || ""}</td>
                <td id="category-3" class="category">${transaction.categories[2] || ""}</td>
                <td id="category-4" class="category">${transaction.categories[3] || ""}</td>
            </tr>
        `);

        if (transaction["parts"]) {
            for (part of transaction["parts"]) {
                $("#transactions").append(`
                    <tr id="subrow-${++nextSubrowId}" class="subrow">
                        <td class="delete"></td>
                        <td colspan="4"></td>
                        <td contenteditable="true">${part.amount.toFixed(2)}</td>
                        <td id="category-1" class="category">${part.categories[0] || ""}</td>
                        <td id="category-2" class="category">${part.categories[1] || ""}</td>
                        <td id="category-3" class="category">${part.categories[2] || ""}</td>
                        <td id="category-4" class="category">${part.categories[3] || ""}</td>
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
                vendor: $("td:nth-child(4)", this).text(),
                type: $("td:nth-child(5)", this).text(),
                amount: parseFloat($("td:nth-child(6)", this).text()),
                categories: [
                    $("td:nth-child(7)", this).text(),
                    $("td:nth-child(8)", this).text(),
                    $("td:nth-child(9)", this).text(),
                    $("td:nth-child(10)", this).text()
                ].filter(function(s) { return s != ""; }),
            });
        }
        
        if ($(this).attr("class") == "subrow") {
            transactions[transactions.length - 1]["parts"] ??= [];

            transactions[transactions.length - 1]["parts"].push({
               amount: parseFloat($("td:nth-child(3)", this).text()),
               categories: [
                    $("td:nth-child(4)", this).text(),
                    $("td:nth-child(5)", this).text(),
                    $("td:nth-child(6)", this).text(),
                    $("td:nth-child(7)", this).text()
                ].filter(function(s) { return s != ""; }),
            });
         }
    });

    return transactions;
}
