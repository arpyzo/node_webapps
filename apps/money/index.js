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
            // TODO: grab vendor*transaction with regex
            // /^(\d{2}\/\d{2}\/\d{4}),[^,]+,([^,]+),[^,]*,[^,]+,([^,]+),/
            //console.log(`TRANSACTION: ${matches[1]} - ${matches[2]} - ${matches[3]} - ${matches[4]}`);
            // 1 - Transaction date
            // 2 - Vendor*Transaction ID
            // 3 - Transaction type (Sale, Return, Payment, Refund, Adjustment, Fee)
            // 4 - Amount

            for (const [vendor, categories] of Object.entries(this.vendorCategories)) {
                if (matches[2].startsWith(vendor)) {
                    //console.log(`${vendor} - ${categories}`);
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

// Transaction Date,Post Date,Description,Category,Type,Amount,Memo
// 11/29/2020,11/30/2020,Amazon.com*RC4J86PD3,Shopping,Sale,-121.12,
}

exports.app = Money;
