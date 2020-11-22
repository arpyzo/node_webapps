const http = require("http");

function start(route, handle, port = 8888) {
    function onRequest(request, response) {
        request.setEncoding("utf8");

        //console.log("Request method: " + request.method);
        //console.log("Request raw headers: " + request.rawHeaders);

        var requestData = '';

        request.addListener("data", function(requestDataChunk) {
            //console.log(`Received data chunk\n-->${requestDataChunk}<--`);
            requestData += requestDataChunk;
        });

        request.addListener("end", function() {
            //console.log(`-->${requestDataChunks}<--`);
            route(handle, request, requestData, response);
        });
    }

    http.createServer(onRequest).listen(port);
    console.log("Server started on port " + port);
}

exports.start = start;
