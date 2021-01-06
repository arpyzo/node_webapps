const fs = require("fs");

class Money {
    constructor(config) {
        this.moneyDir = config.saveDir + "money/";

        let vendorCategoriesJSON = fs.readFileSync(this.moneyDir + "vendor_categories.json");
        this.vendorCategories = JSON.parse(vendorCategoriesJSON);
    }

    handle(request, requestData, response) {
        console.log(`App money will handle ${request.url}`);

        if (request.url == "/") {
            response.returnHTML(fs.readFileSync(__dirname + "/view/index.html"));
        } else if (request.url == "/api/upload") {
            this.parseCSV(requestData);
            response.return200();
        } else {
            response.return404();
        }
    }

    parseCSV(requestData) {
        let self = this;

        let csv = decodeURIComponent(requestData);
        csv.split(/\r?\n/).forEach(function(line) {
            self.parseCSVLine(line);
        });
    }

    parseCSVLine(line) {
        let transactionRegex = /^(\d{2}\/\d{2}\/\d{4}),[^,]+,([^,]+),[^,]*,[^,]+,([^,]+),/;

        let matches = line.match(transactionRegex);
        if (matches) {
            console.log(`TRANSACTION: ${matches[1]} - ${matches[2]} - ${matches[3]}`);
            //forEach
        } else {
            console.log(`Unmatched line: ${line}`);
        }
    }

// Transaction Date,Post Date,Description,Category,Type,Amount,Memo
// 11/29/2020,11/30/2020,Amazon.com*RC4J86PD3,Shopping,Sale,-121.12,
}

exports.app = Money;
