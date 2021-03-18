const fs = require("fs");

function route(apps, request, requestData, response) {
    request.parseURL();
   
    // Required for relative link resolution
    if (request.url == "") {
        return response.redirect(301, request.app + "/");
    }

    if (request.app && request.app in apps) {
        if (/^\/[a-z0-9]*$/.test(request.url)) {
            return response.returnAsset("/apps/" + request.app + "/view/index.html");
        }

        if (request.url.endsWith("/jquery.js")) {
            return response.returnAsset("/view_libs/jquery.js");
        }

        if (/\.(?:html|css|js)$/.test(request.url)) {
            return response.returnAsset("/apps/" + request.app + "/view" + request.url);
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
