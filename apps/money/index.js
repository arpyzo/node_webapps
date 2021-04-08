const fs = require("fs");

class Money {
    constructor(config) {
        this.transactionRegex = /^(\d{2}\/\d{2}\/\d{4}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/;

        this.moneyDir = config.saveDir + "money/";

        let vendorCategoriesJSON = fs.readFileSync(this.moneyDir + "vendor_categories.json");
        this.vendorCategories = JSON.parse(vendorCategoriesJSON);
    }

    handle(request, response) {
        console.log(`App money will handle ${request.url}`);

        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/edit") {
            return response.returnAsset(__dirname + "/view/edit.html");
        }

        if (request.url == "/api/load") {
            let month = request.params.get("month");
            let account = request.params.get("account");
            if (!month || !account) {
               return response.return400("Missing month and/or account parameter");
            }

            if (!this.doTransactionsExist(month, account)) {
                return response.return404();
            }

            try {
                return response.returnJSON(this.getTransactions(month, account));
            } catch(error) {
                console.trace(`Error loading transactions: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/upload") {
            let transactionData = JSON.parse(request.data);
            let success = this.parseTransactionData(transactionData);
            if (success) {
                return response.return200();
            } else {
                return response.return500();
            }
        }

        if (request.url == "/api/save") {
            let transactionData = JSON.parse(request.data);
            this.saveTransactions(transactionData);
            return response.return200();
        }

        response.return404();
    }

    parseTransactionData(transactionData) {
        let transactions = [];
        for (const line of transactionData.csv.split(/\r?\n/).slice(1, -1)) {
            let transaction = this.parseCSVLine(line);
            if (!transaction) {
                return false;
            }
            transactions.push(transaction);
        }

        transactions.sort(function(a, b) {
            return (
                (a["date"].slice(6,10) + a["date"].slice(0,2) + a["date"].slice(3,5)) -
                (b["date"].slice(6,10) + b["date"].slice(0,2) + b["date"].slice(3,5))
            );
        });
        transactions = transactions.map(function(x, i) { x["id"] = i + 1 ; return x });

        fs.writeFileSync(this.moneyDir + transactionData.month + "_" + transactionData.account + ".json", JSON.stringify(transactions, null, 2));
        return true;
    }

    parseCSVLine(line) {
        let matches = line.match(this.transactionRegex);
        if (matches) {
            //console.log(`TRANSACTION: ${matches[1]} - ${matches[2]} - ${matches[3]} - ${matches[4]}`);
            // 1 - Transaction date
            // 2 - Vendor*Transaction ID
            // 3 - Transaction type (Sale, Return, Payment, Refund, Adjustment, Fee)
            // 4 - Amount

            let transaction = {
                id: null,
                date: matches[1].replace(/\//g, "-"),
                description: matches[2],
                vendor: "UNKNOWN",
                type: matches[3],
                amount: Math.abs(matches[4]),
                categories: []
            }

            for (const [vendor, categories] of Object.entries(this.vendorCategories)) {
                if (transaction["description"].toLowerCase().startsWith(vendor.toLowerCase())) {
                    transaction["vendor"] = vendor;
                    transaction["categories"] = categories;
                    return transaction;
                }
            }
            return transaction;
        } else {
            console.log(`ERROR (money): Unmatched line: ${line}`);
            return null;
        }
    }

    doTransactionsExist(month, account) {
        return fs.existsSync(`${this.moneyDir}${month}_${account}.json`);
    }

    getTransactions(month, account) {
        return fs.readFileSync(`${this.moneyDir}${month}_${account}.json`);
    }

    saveTransactions(transactionData) {
        fs.writeFileSync(`${this.moneyDir}${transactionData.month}_${transactionData.account}.json`, JSON.stringify(transactionData.transactions, null, 2));
    }
}

exports.app = Money;
