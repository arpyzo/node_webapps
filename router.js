function route(apps, request, requestData, response) {
    matches = request.url.match(/\/([^\/]+)\/?(.*)/);
    if (matches && matches[1] in apps) {
        request.url = matches[2];
        apps[matches[1]].route(request, requestData, response);
    } else {
        console.log("No app prefix matched to URL!");

        response.return404();
        //response.writeHead(404, {"Content-Type": "text/plain"});
        //response.write("404 Not found");
        //response.end();
    }
}

exports.route = route;
