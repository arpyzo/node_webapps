const http = require("http");

class Request extends http.IncomingMessage {
    queryParams;

    stripURLPrefix() {
        let matches = this.url.match(/\/([^\/]+)(.*)/);
        if (matches) {
            this.url = matches[2];
            return matches[1];
        }
        return null;
    }

    getQueryParam(param) {
        if (this.queryParams === undefined) {
            this.queryParams = (new URL(this.url, "http://example.com")).searchParams;
        }
        return this.queryParams.get(param);
    }
}

class Response extends http.ServerResponse {
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
