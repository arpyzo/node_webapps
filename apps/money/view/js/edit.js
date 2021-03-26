$(document).ready(function() {
    ajaxLoad();
});

function setupOnClick() {
$(document).click(function(event) {
    //alert(event.target.className);
    //alert($(event.target).attr("class"));

    if ($("#test").css("display") == "none") {
        $("#test").css({"display": "grid", "top": event.pageY - 50, "left": event.pageX - 50, "position": "absolute"});
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
            <tr>
            <td>${transaction.id}</td>
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
