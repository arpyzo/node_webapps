const fs = require("fs");

class Money {
    constructor(config) {
        this.transactionRegex = /^(\d{2}\/\d{2}\/\d{4}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/;

        this.moneyDir = config.saveDir + "money/";

        let vendorCategoriesJSON = fs.readFileSync(this.moneyDir + "vendor_categories.json");
        this.vendorCategories = JSON.parse(vendorCategoriesJSON);
    }

    handle(request, requestData, response) {
        console.log(`App money will handle ${request.url}`);

        if (/^\/edit/[a-z0-9\-]*$/.test(request.url)) {
            return response.returnAsset("/apps/" + request.app + "/view/edit.html");
        }

        if (request.url == "/api/load") {
            let statement = request.queryParams.get("statement");
            if (!statement) {
               return response.return400("Missing statement parameter");
            }

            if (!this.doNotesExist(statement)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getNotes(statement));
            } catch(error) {
                console.trace(`Error loading notes: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/upload") {
            // TODO: JSON instead
            const csv = decodeURIComponent(requestData);
            this.parseCSV(csv);
            return response.return200();
        }

        if (request.url == "/api/save") {
            fs.writeFileSync(this.moneyDir + "test", requestData);
            return response.return200();
        }

        response.return404();
    }

    parseCSV(csv) {
        let transactions = [];
        for (const line of csv.split(/\r?\n/).slice(1,-1)) {
            let transaction = this.parseCSVLine(line);
            if (transaction) {
                transactions.push(transaction);
            }
        }

        console.log(transactions);
        fs.writeFileSync(this.moneyDir + "test_month.json", JSON.stringify(transactions, null, 2));
    }

    parseCSVLine(line) {
        let matches = line.match(this.transactionRegex);
        if (matches) {
            //console.log(`TRANSACTION: ${matches[1]} - ${matches[2]} - ${matches[3]} - ${matches[4]}`);
            // 1 - Transaction date
            // 2 - Vendor*Transaction ID
            // 3 - Transaction type (Sale, Return, Payment, Refund, Adjustment, Fee)
            // 4 - Amount

            for (const [vendor, categories] of Object.entries(this.vendorCategories)) {
                if (matches[2].toLowerCase().startsWith(vendor.toLowerCase())) {
                    return {
                        date: matches[1],
                        transaction: matches[2],
                        type: matches[3],
                        vendor: vendor,
                        categories: categories,
                        amount: matches[4]
                    };
                }
            }
        } else {
            //console.log(`Unmatched line: ${line}`);
            return null;
        }
    }
}

exports.app = Money;
