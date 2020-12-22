const fs = require("fs");

class Music {
    constructor(config) {
        this.musicDir = config.webDir + "music/";
    }

    handle(request, requestData, response) {
        console.log(`App images will handle ${request.url}`);

        if (/^\/$/.test(request.url)) {
            return response.returnHTML(fs.readFileSync(__dirname + "/view/index.html"));
        }

        if (request.url.startsWith("/js/")) {
            return response.returnJS(fs.readFileSync(__dirname + "/view" + request.url));
        }

        if (request.url.startsWith("/css/")) {
            return response.returnCSS(fs.readFileSync(__dirname + "/view" + request.url));
        }

        if (request.url == "/api/list") {
            return response.returnText(this.getArtistList());
        }

        response.return404();
    }

    getArtistList() {
        return fs.readdirSync(this.musicDir).join("\n");
    }
}

exports.app = Music;
