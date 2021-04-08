const fs = require("fs");

class Links {
    constructor(config) {
        this.linksDir = config.saveDir + "links/";
    }

    handle(request, response) {
        console.log(`App links will handle ${request.url}`);

        if (/^\/[a-z0-9]*$/.test(request.url)) {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/api/list") {
            return response.returnText(this.getLinksFile("_list"));
        }

        if (request.url == "/api/load") {
            const category = request.params.get("category");
            if (!category) {
               return response.return400("Missing category parameter");
            }

            if (!this.doLinksExist(category)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getLinksFile(category));
            } catch(error) {
                console.trace(`Error loading links: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/append") {
            const appendData = request.dataObject;

            if (!appendData.category || !appendData.link) {
                return response.return400("Missing or empty category and/or link parameter");
            }

            if (!this.doLinksExist(appendData.category)) {
                return response.return404();
            }

            try {
                this.appendLink(appendData.category, appendData.link);
                return response.return200();
            } catch(error) {
                console.trace(`Error appending link: ${error}`);
                return response.return500(error);
            }
        }
     
        if (request.url == "/api/remove") {
            const removeData = request.dataObject;

            if (!removeData.category || !removeData.link) {
                return response.return400("Missing or empty category and/or link parameter");
            }

            if (!this.doLinksExist(removeData.category)) {
                return response.return404();
            }

            try {
                this.removeLink(removeData.category, removeData.link);
                return response.return200();
            } catch(error) {
                console.trace(`Error removing link: ${error}`);
                return response.return500(error);
            }
        }
     
        response.return404();
    }

    doLinksExist(category) {
        return fs.existsSync(this.linksDir + category);
    }

    getLinksFile(filename) {
        return fs.readFileSync(this.linksDir + filename);
    }

    appendLink(category, link) {
        fs.appendFileSync(this.linksDir + category, link + "\n");
    }

    removeLink(category, link) {
        const links = fs.readFileSync(this.linksDir + category, 'utf8').split("\n");
        const newLinks = links.filter(function(line) {
            return line != link;
        });
        fs.writeFileSync(this.linksDir + category, newLinks.join("\n"));
    }
}

exports.app = Links;
