const fs = require("fs");

function route(apps, request, response) {
    request.parseURL();

    // Required for relative link resolution
    if (request.url == "") {
        return response.redirect(301, request.app + "/");
    }

    if (request.app && request.app in apps) {
        if (request.url.endsWith("/jquery.js")) {
            return response.returnAsset(__dirname + "/view_libs/jquery.js");
        }
        if (request.url.endsWith("/orbitry.js")) {
            return response.returnAsset(__dirname + "/view_libs/orbitry.js");
        }

        if (/\.(?:html|css|js)$/.test(request.url)) {
            return response.returnAsset(__dirname + "/apps/" + request.app + "/view" + request.url);
        }

        try {
            console.log(`[${request.app}] ${request.url}`);
            apps[request.app].handle(request, response);
        } catch(error) {
            console.trace(`Uncaught exception from app ${request.app}: ${error}`);
            response.return500();
        }
    } else {
        response.return404();
    }
}

exports.route = route;
