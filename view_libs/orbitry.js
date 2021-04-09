var ajaxTimeout = 5000;

function ajaxGET(url, success) {
    ajaxRequest({
        type: 'GET',
        url: url,
        success: success
    });
}

function ajaxPOST(url, data, success) {
    ajaxJSONRequest('POST', url, data, success);
}

function ajaxPUT(url, data, success) {
    ajaxJSONRequest('PUT', url, data, success);
}

function ajaxPATCH(url, data, success) {
    ajaxJSONRequest('PATCH', url, data, success);
}

function ajaxDELETE(url, data, success) {
    ajaxJSONRequest('DELETE', url, data, success);
}

function ajaxJSONRequest(type, url, data, success) {
    ajaxRequest({
        type: type,
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: success
    });
}

function ajaxRequest(request) {
    $.ajax({
        ...request,
        timeout: ajaxTimeout,
        error: function(data, status, error) {
            alert(`
                AJAX Failure: ${status}\n
                Error: ${error}\n
                Response: ${data.responseText}
            `);
        }
    });
}
