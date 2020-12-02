const fs = require("fs");

class Money {
    handle(request, requestData, response) {
        console.log(`App money will handle ${request.url}`);

        if (request.url == "/") {
            response.returnHTML(fs.readFileSync(__dirname + "/index.html"));
        } else if (request.url == "/upload") {
            this.parseCSV(requestData);
        } else {
            response.return404();
        }
    }

    parseCSV(requestData) {
        requestData.split(/\r?\n/).forEach(function(line) {
            console.log("LINE: " + line);
        });
    }
}

exports.app = Money;
