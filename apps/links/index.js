function handle(request, requestData, response) {
    console.log(`App links will handle ${request.url}`);

    if (/^\/[a-z]*$/.test(request.url)) {
        return response.returnHTML(require("fs").readFileSync(__dirname + "/view/index.html"));
    } 

    if (request.url.startsWith("/js/")) {
        return response.returnJS(require("fs").readFileSync(__dirname + "/view" + request.url));
    } 

    if (request.url.startsWith("/css/")) {
        return response.returnCSS(require("fs").readFileSync(__dirname + "/view" + request.url));
    }
    
    if (request.url == "/api/load") {
        let category = request.queryParams.get("category");
        if (category) {
            return response.returnText(loadLinks(category));
        }
        return response.return403();
    }
 
    response.return404();
}

function loadLinks(category) {
    return require("fs").readFileSync("/Users/robert/Projects/webapps/test_files/links_test");
}

exports.handle = handle;
