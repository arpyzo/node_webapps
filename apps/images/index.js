const fs = require("fs");

class Images {
    constructor(config) {
        this.imageDir = config.webDir + "images/";
    }

    handle(request, requestData, response) {
        console.log(`App images will handle ${request.url}`);

        if (/^\/$/.test(request.url)) {
            return response.returnHTML(fs.readFileSync(__dirname + "/view/index.html"));
        }

        if (request.url.startsWith("/js/")) {
            return response.returnJS(fs.readFileSync(__dirname + "/view" + request.url));
        }

        if (request.url.startsWith("/css/")) {
            return response.returnCSS(fs.readFileSync(__dirname + "/view" + request.url));
        }

        if (request.url == "/api/list") {
            return response.returnText(this.getImageList());
        }

        if (request.url == "/api/random") {
            return response.returnText(this.getImage());
        }

        if (request.url == "/api/upload") {
            this.saveImage(requestData);
            response.return200();
        }

        response.return404();
    }

    getImageList() {
        return fs.readdirSync(this.imageDir).join("\n");
    }

    getImage() {
        let imageList = fs.readdirSync(this.imageDir);
        let imageFile = imageList[Math.floor(Math.random() * imageList.length)];
        let imageBuffer = fs.readFileSync(this.imageDir + imageFile);
        let imageType = imageFile.slice(-3);
        return imageType + imageBuffer.toString("base64");
    }

    saveImage(requestData) {
        let fileBuffer = Buffer.from(requestData, "base64");

        fs.writeFile("/Users/robert/Desktop/test_image.jpg", fileBuffer, function(error) {
            if (error) {
                return console.log(error);
            }
            console.log("Image saved");
        });
    }
}

exports.app = Images;
