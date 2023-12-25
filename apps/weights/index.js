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
                return response.returnText(this.getWeights());
            } catch(error) {
                console.trace(`Error loading weights: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/save") {
            const saveData = request.dataObject;

            if (!saveData.weights) {
                return response.return400("Missing or empty weights");
            }

            try {
                this.saveWeights(saveData.weights);
                return response.return200();
            } catch(error) {
                console.trace(`Error saving weights: ${error}`);
                return response.return500(error);
            }
        }

        response.return404();
    }

    getWeights() {
        return fs.readFileSync(this.saveDir + 'weights.csv');
    }

    saveWeights(weights) {
        fs.writeFileSync(this.saveDir + 'weights.csv', weights);
    }
}

exports.app = Weights;
