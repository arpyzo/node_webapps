function route(request, requestData, response) {
    console.log(`App money will handle ${request.url}`);

    if (request.url == "/") {
        response.returnHTML(require("fs").readFileSync(__dirname + "/index.html"));
        //showLandingPage(response);
    } else if (request.url == "/upload") {
        parseCSV(requestData);
    } else {
        response.return404();
    }
}

function showLandingPage(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(require("fs").readFileSync(__dirname + "/index.html"));
    response.end();
}

function parseCSV(requestData) {
    requestData.split(/\r?\n/).forEach(function(line) {
        console.log("LINE: " + line);
    });
}

exports.route = route;
