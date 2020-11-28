function route(apps, request, requestData, response) {
    request.parseURL();
   
    // Required for relative link resolution
    if (request.url == "") {
        return response.redirect(301, request.app + "/");
    }

    if (request.app && request.app in apps) {
        if (request.url.endsWith("/jquery.js")) {
            return response.returnJS(require("fs").readFileSync(__dirname + "/view_libs/jquery.js"));
        }

        try {
            apps[request.app].handle(request, requestData, response);
        } catch(error) {
            console.trace(`Uncaught exception from app ${request.app}: ${error}`);
            response.return500();
        }
    } else {
        response.return404();
    }
}

exports.route = route;
