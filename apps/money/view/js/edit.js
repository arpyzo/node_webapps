$(document).ready(function() {
    ajaxLoad();
});

// Load transactions
function ajaxLoad() {
    $.ajax({
        type: 'GET',
        //url: `api/load?account=${account}&month=${month}`,
        url: "api/load",
        timeout: 2000,
        success: function(transactions) {
            makeTransactionsTable(transactions);
        },
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

// Save transactions
function ajaxSave(transactions) {
    $.ajax({
        type: 'POST',
        //url: `api/load?account=${account}&month=${month}`,
        url: "api/save",
        timeout: 2000,
        data: JSON.stringify(transactions),
        //success: function(transactions) {
        //    alert("AJAX success!");
        //},
        error: function(data, status, error) {
            alert(`AJAX failure: ${status}\nError: ${error}\nResponse: ${data.responseText}`);
        }
    });
}

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
                <td id="category-1" class="category">${transaction.categories}</td>
                <td id="category-2" class="category"></td>
                <td id="category-3" class="category"></td>
                <td id="category-4" class="category"></td>
            </tr>
        `);
    }
    setupOnClick();
}

var subrows = 0;
var selectedCategory = {};
// TODO: Set up specific onClicks
function setupOnClick() {
    $(document).click(function(event) {
        if (event.target.className == "split") {
            let rowId = $(event.target).closest("tr").attr("id");
            subrows++;

            $(`#${rowId}`).after(`
                <tr id="subrow${subrows}" class="subrow">
                    <td class="delete"></td>
                    <td colspan="4"></td>
                    <td contenteditable="true"></td>
                    <td id="category-1" class="category"></td>
                    <td id="category-2" class="category"></td>
                    <td id="category-3" class="category"></td>
                    <td id="category-4" class="category"></td>
                </tr>
            `);

        }

        if (event.target.className == "delete") {
            let subrowId = $(event.target).closest("tr").attr("id");
            $(`#${subrowId}`).remove();
        }

        if (event.target.className == "category") {
            selectedCategory["rowId"] = $(event.target).closest("tr").attr("id");
            selectedCategory["categoryId"] = $(event.target).attr("id");

            $("#categories").css({
                "display": "grid",
                "position": "absolute",
                "top": event.pageY - 15,
                "left": event.pageX - 15
            });
            $("#categories").show();
        } else {
            $("#categories").hide();
        }

        if (event.target.className == "category-select") {
            console.log(`#${selectedCategory["rowId"]} #${selectedCategory["categoryId"]}`);
            $(`#${selectedCategory["rowId"]} #${selectedCategory["categoryId"]}`).text($(event.target).text());
        }

        if (event.target.id == "save") {
            let transactions = [];

            $("tr").each(function() {
                if ($(this).attr("class") == "row") {
                    transactions.push({
                        id: $("td:nth-child(1)", this).text(),
                        date: $("td:nth-child(2)", this).text(),
                        description: $("td:nth-child(3)", this).text(),
                        vendor: $("td:nth-child(4)", this).text(),
                        type: $("td:nth-child(5)", this).text(),
                        amount: $("td:nth-child(6)", this).text(),
                        categories: [],
                    });
                }
                
                if ($(this).attr("class") == "subrow") {
                    transactions[transactions.length - 1]["parts"] ??= [];

                    transactions[transactions.length - 1]["parts"].push({
                       amount: $("td:nth-child(3)", this).text(),
                       categories: []
                    });
                }
            });
            //console.log(JSON.stringify(transactions, null, 2));
            ajaxSave(transactions);
        }
    });
}
