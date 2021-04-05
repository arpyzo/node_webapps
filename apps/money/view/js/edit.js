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
            <tr id="row-${transaction.id}">
            <td class="split">${transaction.id}</td>
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

// TODO: Set up specific onClicks
function setupOnClick() {
    $(document).click(function(event) {
        if (event.target.className == "split") {
            let rowId = $(event.target).closest("tr").attr("id");
            // TODO: subrow not specific
            $(`#${rowId}`).after(`
                <tr id="sub${rowId}">
                <td class="delete"></td>
                <td colspan="4"></td>
                <td></td>
                <td class="category"></td>
                <td class="category"></td>
                <td class="category"></td>
                <td class="category"></td>
                </tr>
            `);
        }

        if (event.target.className == "delete") {
            let subrowId = $(event.target).closest("tr").attr("id");
            $(`#${subrowId}`).remove();
        }

        if (event.target.className == "category") {
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
    });
}
