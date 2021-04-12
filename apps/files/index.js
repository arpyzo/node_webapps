const fs = require("fs");

class Files {
    constructor(config) {
        this.fileDir = config.saveDir + "files/";
    }

    handle(request, response) {
        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/api/list") {
            return response.returnText(this.getFileList());
        }

        /*if (request.url == "/api/upload64") {
            this.saveFile64(request.data);
            return response.return200();
        }*/

        if (request.url == "/api/upload") {
            this.saveFile(request.data);
            return response.return200();
        }

        response.return404();
    }

    getFileList() {
        return fs.readdirSync(this.fileDir).join("\n");
    }

    saveFile64(fileData) {
        const fileBuffer = Buffer.from(fileData, "base64");

        fs.writeFile(this.fileDir + "test_file", fileBuffer, function(error) {
            if (error) {
                return console.log(error);
            }
            console.log("File saved");
        });
    }

    saveFile(fileData) {
        console.log(`TYPE: ${typeof fileData} SIZE: ${fileData.length}`);

        fs.writeFile(this.fileDir + "test_file", fileData, function(error) {
            if (error) {
                return console.log(error);
            }
            console.log("File saved");
        });
    }
}

exports.app = Files;
