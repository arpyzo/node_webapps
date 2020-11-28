const fs = require("fs");

function handle(request, requestData, response) {
    console.log(`App links will handle ${request.url}`);

    if (/^\/[a-z]*$/.test(request.url)) {
        return response.returnHTML(fs.readFileSync(__dirname + "/view/index.html"));
    } 

    if (request.url.startsWith("/js/")) {
        return response.returnJS(fs.readFileSync(__dirname + "/view" + request.url));
    } 

    if (request.url.startsWith("/css/")) {
        return response.returnCSS(fs.readFileSync(__dirname + "/view" + request.url));
    }
    
    if (request.url == "/api/load") {
        let category = request.queryParams.get("category");
        if (!category) {
           return response.return400("Missing category parameter");
        }

        if (!doLinksExist(category)) {
            return response.return404();
        }

        try {
            return response.returnText(getLinks(category));
        } catch(error) {
            console.trace(`Error loading links: ${error}`);
            return response.return500(error);
        }
    }

    if (request.url == "/api/append") {
        try {
            var appendData = JSON.parse(requestData);
        } catch(error) {
            return response.return400(error);
        }

        if (!appendData.category || !appendData.link) {
            return response.return400("Missing or empty category and/or link parameter");
        }

        if (!doLinksExist(appendData.category)) {
            return response.return404();
        }

        try {
            return appendLink(appendData.category, appendData.link);
        } catch(error) {
            console.trace(`Error appending link: ${error}`);
            return response.return500(error);
        }
    }
 
    if (request.url == "/api/remove") {
        try {
            var appendData = JSON.parse(requestData);
        } catch(error) {
            return response.return400(error);
        }

        if (!appendData.category || !appendData.link) {
            return response.return400("Missing or empty category and/or link parameter");
        }

        if (!doLinksExist(appendData.category)) {
            return response.return404();
        }

        try {
            return removeLink(appendData.category, appendData.link);
        } catch(error) {
            console.trace(`Error removing link: ${error}`);
            return response.return500(error);
        }
    }
 
    response.return404();
}

function doLinksExist(category) {
    return fs.existsSync("/Users/robert/Projects/webapps/test_files/links_test");
}

function getLinks(category) {
    return fs.readFileSync("/Users/robert/Projects/webapps/test_files/links_test");
}

function appendLink(category, link) {
    fs.appendFileSync("/Users/robert/Projects/webapps/test_files/links_test", link + "\n");
}

function removeLink(category, link) {
    let links = fs.readFileSync("/Users/robert/Projects/webapps/test_files/links_test", 'utf8').split("\n");
    let newLinks = links.filter(function(line) {
        return line != link;
    });
    fs.writeFileSync("/Users/robert/Projects/webapps/test_files/links_test", newLinks.join("\n"));
}

exports.handle = handle;
