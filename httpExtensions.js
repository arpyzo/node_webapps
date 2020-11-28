const http = require("http");

class Request extends http.IncomingMessage {
    app;
    queryParams;

    parseURL() {
        let url = new URL(this.url, "http://" + this.headers.host);

        let match = url.pathname.match(/\/([^\/]+)(.*)/);
        this.app = match ? match[1] : null;
        this.url = match ? match[2] : null;

        this.queryParams = url.searchParams;
    }
}

class Response extends http.ServerResponse {
    returnText(text) {
        this.returnContent("text/plain", text);
    }

    returnHTML(html) {
        this.returnContent("text/html", html);
    }

    returnJS(js) {
        this.returnContent("text/javascript", js);
    }

    returnCSS(css) {
        this.returnContent("text/css", css);
    }

    returnContent(type, content) {
        this.writeHead(200, {"Content-Type": type});
        this.write(content);
        this.end();
    }

    redirect(code, url) {
        this.writeHead(code, {"Location": url});
        this.end();
    }

    return403() {
        this.writeHead(403, {"Content-Type": "text/plain"});
        this.write("403 Bad request\n");
        this.end();
    }

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
