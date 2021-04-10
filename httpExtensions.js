const http = require("http");
const fs = require("fs");

// Request
class Request extends http.IncomingMessage {
    app;
    params;
    data = "";
    buf;
    bufs = [];
    dataObject;

    parseURL() {
        let url = new URL(this.url, "http://" + this.headers.host);

        let match = url.pathname.match(/\/([^\/]+)(.*)/);
        this.app = match ? match[1] : null;
        this.url = match ? match[2] : null;

        this.params = url.searchParams;
    }

    parseJSONData() {
        this.dataObject = JSON.parse(this.data);
    }
}

exports.Request = Request;

// Response
class Response extends http.ServerResponse {
    mimeTypes = {
        "html": "text/html",
        "js":   "text/javascript",
        "css":  "text/css",
    }

    returnAsset(filePath) {
        if (!fs.existsSync(filePath)) {
            return this.return404();
        }

        let mimeType = this.mimeTypes[filePath.split(".").pop()] || "text/plain";
        this.returnContent(200, mimeType, fs.readFileSync(filePath));
    }

    returnText(text) {
        this.returnContent(200, "text/plain", text);
    }

    returnJSON(jsonString) {
        this.returnContent(200, "application/json", jsonString);
    }

    return200() {
        this.returnContent(200, "text/plain", "200 Success\n");
    }

    return400(error = "") {
        this.returnContent(400, "text/plain", `400 Bad request\n${error}\n`);
    }

    return404() {
        this.returnContent(404, "text/plain", "404 Not found\n");
    }

    return500(error = "") {
        this.returnContent(500, "text/plain", `500 Internal server error\n${error}\n`);
    }

    returnContent(code, mimeType, content) {
        this.writeHead(code, {"Content-Type": mimeType});
        this.write(content);
        this.end();
    }

    redirect(code, url) {
        this.writeHead(code, {"Location": url});
        this.end();
    }
}

exports.Response = Response;
