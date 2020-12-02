const fs = require("fs");

class Images {
    constructor(saveDir) {
        this.imageDir = saveDir + "images/";
    }

    handle(request, requestData, response) {
        console.log(`App images will handle ${request.url}`);

        if (request.url == "/api/random") {
            this.getImage();
        }

        if (request.url == "api/upload") {
            this.saveImage(requestData);
        }

        response.return200();
    }

    getImage() {
        let imageList = fs.readdirSync(this.imageDir);
        console.log("Images: " + imageList.length);
        for (let i = 0 ; i < 1000 ; i++) {
            console.log("Loading: " + imageList[Math.floor(Math.random() * imageList.length)]);
        }

        //let imageBuffer = fs.readFileSync(imageFile);
        //return imageBuffer.toString('base64');
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
