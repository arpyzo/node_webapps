$(document).click(function(event) {
   if ($("#test").css("display") == "none") {
       $("#test").css({"display": "grid", "top": event.pageY, "left": event.pageX, "position": "absolute"});
       $("#test").show();
    } else {
       $("#test").hide();
    }
});

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
            <tr>
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.vendor}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.categories}</td>
            </tr>
        `);
    }
}
