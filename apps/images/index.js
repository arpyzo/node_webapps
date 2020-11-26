function route(request, requestData, response) {
    console.log(`App images will handle ${request.url}`);

    if (request.url == "upload") {
        saveImage(requestData);
    }

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(`App one will handle '${request.url}'\n`);
    response.end();
}

function saveImage(requestData) {
    let fileBuffer = Buffer.from(requestData, "base64");

    require("fs").writeFile("/Users/robert/Desktop/test_image.jpg", fileBuffer, function(err) {
        if (err) { return console.log(err); }
        console.log("Image saved");
    });
}

exports.route = route;
