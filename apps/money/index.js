const fs = require("fs");

class Money {
    constructor(config) {
        this.transactionRegex = /^(\d{2}\/\d{2}\/\d{4}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/;

        this.moneyDir = config.saveDir + "money/";

        let classificationJSON = fs.readFileSync(this.moneyDir + "classification.json");
        this.classification = JSON.parse(classificationJSON);
    }

    handle(request, response) {
        if (request.url == "/") {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/edit") {
            return response.returnAsset(__dirname + "/view/edit.html");
        }

        if (request.url == "/api/load") {
            const month = request.params.get("month");
            const account = request.params.get("account");
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
            const statementData = JSON.parse(request.data);

            if (!statementData.month || !statementData.account || !statementData.csv) {
                return response.return400("Missing or empty month and/or account and/or csv");
            }

            const transactions = this.parseStatement(statementData.csv);
            if (transactions) {
                try {
                    this.saveTransactions({
                        month: statementData.month,
                        account: statementData.account,
                        transactions: transactions
                    });
                } catch(error) {
                    console.trace(`Error saving transactions: ${error}`);
                    return response.return500(error);
                }
                return response.return200();
            } else {
                return response.return400("Failed to parse statement");
            }
        }

        if (request.url == "/api/save") {
            const transactionData = JSON.parse(request.data);

            try {
                this.saveTransactions(transactionData);
            } catch(error) {
                console.trace(`Error saving transactions: ${error}`);
                return response.return500(error);
            }
            return response.return200();
        }

        response.return404();
    }

    parseStatement(statement) {
        const transactions = [];
        for (const line of statement.split(/\r?\n/).slice(1, -1)) {
            const transaction = this.parseCSVLine(line);
            if (!transaction) {
                return null;
            }
            transactions.push(transaction);
        }

        transactions.sort(function(a, b) {
            return (
                (a["date"].slice(6,10) + a["date"].slice(0,2) + a["date"].slice(3,5)) -
                (b["date"].slice(6,10) + b["date"].slice(0,2) + b["date"].slice(3,5))
            );
        });

        return transactions.map(function(x, i) { x["id"] = i + 1 ; return x });
    }

    parseCSVLine(line) {
        const matches = line.match(this.transactionRegex);
        if (matches) {
            //console.log(`TRANSACTION: ${matches[1]} - ${matches[2]} - ${matches[3]} - ${matches[4]}`);
            // 1 - Transaction date
            // 2 - Vendor*Transaction ID
            // 3 - Transaction type (Sale, Return, Payment, Refund, Adjustment, Fee)
            // 4 - Amount

            const transaction = {
                id: null,
                date: matches[1].replace(/\//g, "-"),
                description: matches[2],
                type: matches[3],
                amount: Math.abs(matches[4]),
                essential: false,
                category: []
            }

            for (const [vendor, category] of Object.entries(this.classification["Vendors"])) {
                if (transaction["description"].toLowerCase().startsWith(vendor.toLowerCase()) ||
                    transaction["description"].toLowerCase().endsWith(vendor.toLowerCase())) {

                    transaction["essential"] = this.classification["Essential"].includes(category);
                    transaction["category"] = category;

                    break;
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
