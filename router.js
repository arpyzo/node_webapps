const fs = require("fs");

function route(apps, request, requestData, response) {
    request.parseURL();
   
    // Required for relative link resolution
    if (request.url == "") {
        return response.redirect(301, request.app + "/");
    }

    if (request.app && request.app in apps) {
        if (request.url.endsWith("/jquery.js")) {
            return response.returnJS(fs.readFileSync(__dirname + "/view_libs/jquery.js"));
        }

        if (request.url.startsWith("/js/")) {
            return response.returnJS(fs.readFileSync(__dirname + "/apps/" + request.app + "/view" + request.url));
        }

        if (request.url.startsWith("/css/")) {
            return response.returnCSS(fs.readFileSync(__dirname + "/apps/" + request.app + "/view" + request.url));
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
