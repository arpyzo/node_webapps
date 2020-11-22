var url = require("url");

function route(handle, request, requestData, response) {
    path = url.parse(request.url).pathname;
    console.log("Routing request for " + path);

    if (typeof handle[path] === 'function') {
        handle[path](request, requestData, response);
    } else {
        console.log("No request handler found for " + path);

        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;
