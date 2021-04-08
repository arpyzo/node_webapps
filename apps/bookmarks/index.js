const fs = require("fs");

class Bookmarks {
    constructor(config) {
        this.linksDir = config.saveDir + "bookmarks/";
    }

    handle(request, response) {
        console.log(`App links will handle ${request.url}`);

        if (request.url == "/api/save") {
            try {
                var bookmarkData = JSON.parse(request.data);
            } catch(error) {
                return response.return400(error);
            }

            console.log("DEVICE: " + bookmarkData.deviceName)
            console.log("BOOKMARKS: " + bookmarkData.bookmarks)

// [{"title":"A title","url":"https://somewhere.com/"}]
        }

        response.return404();
    }
}

exports.app = Bookmarks;
