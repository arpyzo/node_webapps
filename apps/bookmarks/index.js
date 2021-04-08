const fs = require("fs");

class Bookmarks {
    constructor(config) {
        this.linksDir = config.saveDir + "bookmarks/";
    }

    handle(request, response) {
        if (request.url == "/api/save") {
            const bookmarkData = request.dataObject;
            // [{"title":"A title","url":"https://somewhere.com/"}]

            console.log("DEVICE: " + bookmarkData.device)
            console.log("BOOKMARKS: " + bookmarkData.bookmarks)

            response.return200();
        }

        response.return404();
    }
}

exports.app = Bookmarks;
