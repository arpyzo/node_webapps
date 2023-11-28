const fs = require("fs");

class Weights {
   constructor(config) {
        this.saveDir = config.saveDir;
    }

    handle(request, response) {
        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/api/load") {
            try {
                return response.returnJSON(this.getExercises());
            } catch(error) {
                console.trace(`Error loading exercises: ${error}`);
                return response.return500(error);
            }
        }

        response.return404();
    }

    getExercises() {
        return fs.readFileSync(`${this.saveDir}weights.json`);
    }
}

exports.app = Weights;
