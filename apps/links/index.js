const querystring = require("querystring");

function route(request, requestData, response) {
    console.log(`App links will handle ${request.url}`);

    if (request.url == "/") {
        return response.returnHTML(require("fs").readFileSync(__dirname + "/view/index.html"));
    } 

    if (request.url.startsWith("/js/")) {
        return response.returnJS(require("fs").readFileSync(__dirname + "/view" + request.url));
    } 

    if (request.url.startsWith("/css/")) {
        return response.returnCSS(require("fs").readFileSync(__dirname + "/view" + request.url));
    }

    if (request.url == "/load") {
        response.return403();
    } 

    if (request.url.startsWith("/load?")) {
        let links = request.getQueryParam("links");
        if (!links) {
            return response.return403();
        }
        return response.returnHTML(loadLinks(links));
    }
 
    response.return404();
}

function loadLinks() {
    return require("fs").readFileSync("/Users/robert/Projects/webapps/test_files/links_test");
}

exports.route = route;
