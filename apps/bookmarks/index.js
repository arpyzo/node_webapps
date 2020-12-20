const fs = require("fs");

class Bookmarks {
    constructor(config) {
        this.linksDir = config.saveDir + "bookmarks/";
    }

    handle(request, requestData, response) {
        console.log(`App links will handle ${request.url}`);

        //if (/^\/[a-z]*$/.test(request.url)) {
        //    return response.returnHTML(fs.readFileSync(__dirname + "/view/index.html"));
        //} 

        //if (request.url.startsWith("/js/")) {
        //    return response.returnJS(fs.readFileSync(__dirname + "/view" + request.url));
        //} 

        //if (request.url.startsWith("/css/")) {
        //    return response.returnCSS(fs.readFileSync(__dirname + "/view" + request.url));
       // }
        
        if (request.url == "/api/save") {
            try {
                var bookmarkData = JSON.parse(requestData);
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
