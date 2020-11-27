function route(apps, request, requestData, response) {
    let urlPrefix = request.stripURLPrefix();
   
    // Required for relative link resolution 
    if (request.url == "") {
        return response.redirect(301, urlPrefix + "/");
    }

    if (urlPrefix in apps) {
        if (request.url.endsWith("jquery.js")) {
            return response.returnJS(require("fs").readFileSync(__dirname + "/view_libs/jquery.js"));
        }

        try {
            apps[urlPrefix].route(request, requestData, response);
        } catch(error) {
            console.trace(`Uncaught exception from app ${urlPrefix}: ${error}`);
            response.return500();
        }
    } else {
        response.return404();
    }
}

exports.route = route;
