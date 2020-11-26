function route(request, requestData, response) {
    console.log(`App money will handle ${request.url}`);

//    if (request.url == "") {
        showLandingPage(response);
        return;
//    } else if (request.url == "upload") {
//        parseCSV(requestData);
//    }

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(`App money handled '${request.url}'\n`);
    response.end();
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
