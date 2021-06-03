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
                <td class="amount" contenteditable="true">0.00</td>
                <td class="essential">false</td>
                <td class="category"></td>
            </tr>
        `);

        $(`#${rowId}`).children(".essential").text("");
    });

    $("#transactions").on("click", ".delete", function() {
        const subrowId = $(this).closest("tr").attr("id");

        $(`#${subrowId}`).remove();
    });

    // Amount calculator
    $("#transactions").on("click", ".amount", function() {
        const tableRow = $(this).closest("tr");
        if (tableRow.attr("class") == "row" && tableRow.next("tr").attr("class") == "subrow") {
            splitExtraAmount(tableRow.attr("id"));
        }
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
console.log(transactions);
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
                <td class="id split">${transaction.id}</td>
                <td class="date">${transaction.date}</td>
                <td class="description">${transaction.description}</td>
                <td class="type">${transaction.type}</td>
                <td class="amount">${transaction.amount.toFixed(2)}</td>
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
                        <td class="amount" contenteditable="true">${part.amount.toFixed(2)}</td>
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
                id: parseInt($(".id", this).text()),
                date: $(".date", this).text(),
                description: $(".description", this).text(),
                type: $(".type", this).text(),
                amount: parseFloat($(".amount", this).text() || 0),
                essential: ($(".essential", this).text() == "true"),
                category: $(".category", this).text()
            });
        }
        
        if ($(this).attr("class") == "subrow") {
            transactions[transactions.length - 1]["parts"] ??= [];

            transactions[transactions.length - 1]["parts"].push({
                amount: parseFloat($(".amount", this).text() || 0),
                essential: ($(".essential", this).text() == "true"),
                category: $(".category", this).text()
            });
         }
    });

    return transactions;
}

function splitExtraAmount(rowId) {
    const totalAmount = parseFloat($(`#${rowId}`).children(".amount").text());
    const rows = [];
    let rowsTotal = 0;

    let tableRow = $(`#${rowId}`).next();
    while (tableRow.attr("class") == "subrow") {
        const rowAmount = parseFloat(tableRow.children(".amount").text());
        rowsTotal += rowAmount;

        rows.push({
            rowId: tableRow.attr("id"),
            amount: rowAmount
        });
        
        tableRow = tableRow.next();
    }

    rows.sort(function(a, b) { return (a["amount"] > b["amount"]); });

    let newAmount;
    let newRowsTotal = 0;
    for (const [i, row] of rows.entries()) {
        if (i < rows.length - 1) {
            newAmount = (row["amount"] / rowsTotal) * (totalAmount - rowsTotal) + row["amount"];
            newRowsTotal += Math.round(newAmount * 100) / 100;
        } else {
            newAmount = totalAmount - newRowsTotal;
        }

        $(`#${row["rowId"]}`).children(".amount").text(newAmount.toFixed(2));
    }
}
