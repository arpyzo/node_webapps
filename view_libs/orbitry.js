var ajaxTimeout = 5000;

function ajaxGET(url, success) {
    ajaxRequest({
        type: 'GET',
        url: url,
        success: success
    });
}

function ajaxPOST(url, data, success, parameter) {
    ajaxJSONRequest('POST', url, data, success, parameter);
}

function ajaxPUT(url, data, success, parameter) {
    ajaxJSONRequest('PUT', url, data, success, parameter);
}

function ajaxPATCH(url, data, success, parameter) {
    ajaxJSONRequest('PATCH', url, data, success, parameter);
}

function ajaxDELETE(url, data, success, parameter) {
    ajaxJSONRequest('DELETE', url, data, success, parameter);
}

function ajaxJSONRequest(type, url, data, success, parameter) {
    ajaxObject = {
        type: type,
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
    };

    if (success) {
        ajaxObject["success"] = success(parameter);
    }

    ajaxRequest(ajaxObject);
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
