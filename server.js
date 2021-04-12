const http = require("http");
const httpExtensions = require("./httpExtensions");
const router = require("./router");

function start(apps, port) {
    function onRequest(request, response) {
        let dataBuffers = [];

        //console.log(`Received request for ${request.url}`);

        request.addListener("data", function(requestDataChunk) {
            dataBuffers.push(requestDataChunk);
        });
        request.addListener("end", function() {
            request.data = Buffer.concat(dataBuffers);
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
