const http = require("http");

class Request extends http.IncomingMessage {
    stripURLPrefix() {
        let matches = this.url.match(/\/([^\/]+)\/?(.*)/);
        if (matches) {
            this.url = matches[2];
            return matches[1];
        }
        return null;
    }
}

class Response extends http.ServerResponse {
    return404() {
        this.writeHead(404, {"Content-Type": "text/plain"});
        this.write("404 Not found\n");
        this.end();
    }

    return500() {
        this.writeHead(500, {"Content-Type": "text/plain"});
        this.write("500 Internal server error\n");
        this.end();
    }
}

exports.Request = Request;
exports.Response = Response;
