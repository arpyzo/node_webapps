const http = require("http");

class Request extends http.IncomingMessage {
}

class Response extends http.ServerResponse {
    return404() {
        this.writeHead(404, {"Content-Type": "text/plain"});
        this.write("Custom 404 Not found\n");
        this.end();
    }
}

exports.Request = Request;
exports.Response = Response;
