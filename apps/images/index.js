const fs = require("fs");

class Images {
    constructor(config) {
        this.imageDir = config.webDir + "images/";
    }

    handle(request, response) {
        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/api/list") {
            return response.returnText(this.getImageList());
        }

        if (request.url == "/api/random") {
            return response.returnText(this.getImage());
        }

        if (request.url == "/api/upload") {
            this.saveImage(request.data);
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

    saveImage(imageData) {
        let fileBuffer = Buffer.from(imageData, "base64");

        fs.writeFile("/Users/robert/Desktop/test_image.jpg", fileBuffer, function(error) {
            if (error) {
                return console.log(error);
            }
            console.log("Image saved");
        });
    }
}

exports.app = Images;
