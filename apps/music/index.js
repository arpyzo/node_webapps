const fs = require("fs");

class Music {
    constructor(config) {
        this.musicDir = config.webDir + "music/";
    }

    handle(request, response) {
        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
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
