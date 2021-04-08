const http = require("http");
const httpExtensions = require("./httpExtensions");
const router = require("./router");

function start(apps, port) {
    function onRequest(request, response) {
        request.setEncoding("utf8");

        //console.log(`Received request for ${request.url}`);

        request.addListener("data", function(requestDataChunk) {
            request.data += requestDataChunk;
        });
        request.addListener("end", function() {
            router.route(apps, request, response);
        });
    }

    http.createServer({
        IncomingMessage: httpExtensions.Request,
        ServerResponse: httpExtensions.Response}, 
        onRequest).listen(port);

    console.log("Server started on port " + port);
}

exports.start = start;
