const fs = require("fs");

class Music {
    constructor(config) {
        this.musicDir = config.webDir + "music/";
    }

    handle(request, requestData, response) {
        console.log(`App images will handle ${request.url}`);

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
