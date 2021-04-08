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

        // TODO: replace getLinks with generic
        if (request.url == "/api/list") {
            return response.returnText(this.getLinks("_list"));
        }

        if (request.url == "/api/load") {
            let category = request.params.get("category");
            if (!category) {
               return response.return400("Missing category parameter");
            }

            if (!this.doLinksExist(category)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getLinks(category));
            } catch(error) {
                console.trace(`Error loading links: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/append") {
            try {
                var appendData = JSON.parse(request.data);
            } catch(error) {
                return response.return400(error);
            }

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
            try {
                var removeData = JSON.parse(request.data);
            } catch(error) {
                return response.return400(error);
            }

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

    getLinks(category) {
        return fs.readFileSync(this.linksDir + category);
    }

    appendLink(category, link) {
        fs.appendFileSync(this.linksDir + category, link + "\n");
    }

    removeLink(category, link) {
        let links = fs.readFileSync(this.linksDir + category, 'utf8').split("\n");
        let newLinks = links.filter(function(line) {
            return line != link;
        });
        fs.writeFileSync(this.linksDir + category, newLinks.join("\n"));
    }
}

exports.app = Links;
