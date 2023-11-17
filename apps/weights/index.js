const fs = require("fs");

class Weights {
    handle(request, response) {
        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        response.return404();
    }
}

exports.app = Weights;
