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

function makeTransactionsTable(transactions) {
    for (transaction of transactions) {
        $("#transactions").append(`
            <tr id="row-${transaction.id}" class="row-id" data-subrows="0">
                <td class="split">${transaction.id}</td>
                <td>${formatDate(transaction.date)}</td>
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

var selectedCategory = {};
// TODO: Set up specific onClicks
function setupOnClick() {
    $(document).click(function(event) {
        if (event.target.className == "split") {
            let rowId = $(event.target).closest("tr").attr("id");
            let subrowNum = $(event.target).closest("tr").data("subrows") + 1;

            $(`#${rowId}`).after(`
                <tr id="subrow${subrowNum}">
                    <td class="delete"></td>
                    <td colspan="4"></td>
                    <td contenteditable="true"></td>
                    <td id="category-1" class="category"></td>
                    <td id="category-2" class="category"></td>
                    <td id="category-3" class="category"></td>
                    <td id="category-4" class="category"></td>
                </tr>
            `);

            $(event.target).closest("tr").data("subrows", subrowNum);
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
            $(`#${selectedCategory["rowId"]} #${selectedCategory["categoryId"]}`).text($(event.target).text());
        }
    });
}

function formatDate(date) {
  return `${date.slice(4,6)}-${date.slice(6,8)}-${date.slice(0,4)}`;
}
