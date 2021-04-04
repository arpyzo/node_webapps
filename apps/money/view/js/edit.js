$(document).ready(function() {
    ajaxLoad();
});

function setupOnClick() {
$(document).click(function(event) {
    if (event.target.className == "row-id") {
        let rowId = $(event.target).closest("tr").attr("id");
        // TODO: subrow not specific
        $(`#${rowId}`).after(`
            <tr>
            <td id="sub${rowId}" colspan="6"></td>
            <td class="category"></td>
            <td class="category"></td>
            <td class="category"></td>
            <td class="category"></td>
            </tr>
        `);
    }

    if ($("#test").css("display") == "none" && event.target.className == "category") {
        $("#test").css({
            "display": "grid",
            "position": "absolute",
            "top": event.pageY - 50,
            "left": event.pageX - 50
        });
        $("#test").show();
    } else {
        $("#test").hide();
    }
});
}

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
            <tr id="row-${transaction.id}">
            <td class="row-id">${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.vendor}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td class="category">${transaction.categories}</td>
            <td class="category"></td>
            <td class="category"></td>
            <td class="category"></td>
            </tr>
        `);
    }
    setupOnClick();
}
