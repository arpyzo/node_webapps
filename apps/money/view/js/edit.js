// Globals
var nextRowId = 0;
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

        const rowDate = $(`#${rowId}`).children(".date").text();
        const rowDescription = $(`#${rowId}`).children(".description").text();

        $(`#${rowId}`).after(`
            <tr id="row-${++nextRowId}" class="row">
                <td class="delete"></td>
                <td class="weekday">${getWeekDay(rowDate)}</td>
                <td class="date">${rowDate}</td>
                <td class="description">${rowDescription}</td>
                <td class="amount" contenteditable="true">0.00</td>
                <td class="importance">Discretionary</td>
                <td class="category"></td>
            </tr>
        `);
    });

    $("#transactions").on("click", ".delete", function() {
        const rowId = $(this).closest("tr").attr("id");
        $(`#${rowId}`).remove();
    });

    // Importance Toggle
    $("#transactions").on("click", ".importance", function() {
        if      ($(this).text() == "Discretionary") { $(this).text("Critical"); }
        else if ($(this).text() == "Essential")     { $(this).text("Discretionary"); }
        else if ($(this).text() == "Critical")      { $(this).text("Essential"); }
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
    //console.log(transactions);

    $("#transactions tr").remove();

    $("#transactions").append(`
        <tr>
            <th></th>
            <th colspan="2">date</th>
            <th>description</th>
            <th>amount</th>
            <th>importance</th>
            <th>category</th>
        </tr>
    `);

    for (const [i, transaction] of transactions.entries()) {
        $("#transactions").append(`
            <tr id="row-${i}" class="row">
                <td class="split"></td>
                <td class="weekday">${getWeekDay(transaction.date)}</td>
                <td class="date">${transaction.date}</td>
                <td class="description">${transaction.description}</td>
                <td class="amount" contenteditable="true">${transaction.amount.toFixed(2)}</td>
                <td class="importance">${transaction.importance}</td>
                <td class="category">${transaction.category}</td>
            </tr>
        `);
        nextRowId = transactions.length;
    }
}

function gatherTransactions() {
    let transactions = [];

    $("tr").each(function() {
        if ($(this).attr("class") == "row") {
            transactions.push({
                date: $(".date", this).text(),
                description: $(".description", this).text(),
                amount: parseFloat($(".amount", this).text() || 0),
                importance: $(".importance", this).text(),
                category: $(".category", this).text()
            });
        }
    });

    return transactions;
}

function getWeekDay(dateStr) {
    const theDate = new Date(dateStr.slice(6), dateStr.slice(0, 2)-1, dateStr.slice(3, 5));
    return theDate.toLocaleString('en-US', {weekday: 'short'});
}
