function route(apps, request, requestData, response) {
    let urlPrefix = request.stripURLPrefix();
    if (urlPrefix in apps) {
        try {
            apps[urlPrefix].route(request, requestData, response);
        } catch(error) {
            console.trace("Uncaught exception: " + error);
            response.return500();
        }
    } else {
        response.return404();
    }
}

exports.route = route;
