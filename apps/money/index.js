const fs = require("fs");

class Money {
    constructor(config) {
        this.transactionParser = {
            alliant: { regex: /^(\d\d?)\/(\d\d?)\/(\d{4}),([^,]+),\(?\$([^,)]+)\)?,[^,]+,[^,]+/, description: 4, amount: 5 },
            amazon:  { regex: /^(\d\d?)\/(\d\d?)\/(\d{4}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/, description: 4, amount: 6, type: 5 },
            amex:    { regex: /^(\d\d?)\/(\d\d?)\/(\d{4}),([^,]+),[^,]+,[^,]+,([^,]+)/, description: 4, amount: 5 },
            bank:    { regex: /^(\d{4})\-(\d{2})\-(\d{2}),[^,]+,([^,]+),([^,]+),([^,]+)/, description: 6, amount: 4, type: 5 },
            citi:    { regex: /^[^,]+,(\d\d?)\/(\d\d?)\/(\d{4}),([^,]+),([^,]*),/, description: 4, amount: 5 },
            freedom: { regex: /^(\d\d?)\/(\d\d?)\/(\d{4}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/, description: 4, amount: 6, type: 5 }
        };

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
            const statementData = request.dataObject;

            if (!statementData.month || !statementData.account || !statementData.csv) {
                return response.return400("Missing or empty month and/or account and/or csv");
            }

            if (this.doTransactionsExist(statementData.month, statementData.account)) {
                return response.return409("Statement already saved on server");
            }

            const transactions = this.parseStatement(statementData.account, statementData.csv);
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
            const transactionData = request.dataObject;

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

    parseStatement(account, statement) {
        const transactions = [];
        for (const line of statement.split(/\r?\n/).slice(1)) {
            const transaction = this.parseCSVLine(account, line);
            if (transaction) {
                transaction["category"] = "";

                // TODO: Convert to hash
                for (const [vendor, category] of Object.entries(this.classification["Vendors"])) {
                    if (transaction["description"].toLowerCase().startsWith(vendor.toLowerCase()) ||
                        transaction["description"].toLowerCase().endsWith(vendor.toLowerCase())) {

                        transaction["category"] = category;
                        break;
                    }
                }
                transactions.push(transaction);
            }
        }

        transactions.sort(function(a, b) {
            return (
                (b["date"].slice(6,10) + b["date"].slice(0,2) + b["date"].slice(3,5)) -
                (a["date"].slice(6,10) + a["date"].slice(0,2) + a["date"].slice(3,5))
            );
        });

        return transactions;
    }

    sanitizeCSVLine(line) {
        let newLine = "";
        let inQuotes = false;

        for (const char of line) {
            if (char == '"') {
                inQuotes = !inQuotes;
            } 
            else if (char != "," || (char == "," && !inQuotes)) {
                newLine += char;
            }
        }

        return newLine;
    }

    parseCSVLine(account, line) {
        if (line == "") {
            return null
        }

        const matches = this.sanitizeCSVLine(line).match(this.transactionParser[account]["regex"]);
        if (matches) {
            console.log(`TRANSACTION: ${matches[1]}/${matches[2]}/${matches[3]} - ${matches[4]} - ${matches[5]} - ${matches[6]}`);

            const date = (account == "bank")
                ? `${matches[2]}/${matches[3]}/${matches[1]}`
                : `${matches[1]}/${matches[2]}/${matches[3]}`;
            const description = matches[this.transactionParser[account]["description"]].split("~")[0];
            const amount = Math.abs(matches[this.transactionParser[account]["amount"]]);
            const type = matches[this.transactionParser[account]["type"]];

            switch(account) {
                case "bank":
                    if (type == "Deposit") {
                        return null;
                    }
                    if (description == ("ALLIANT CU XFER") ||
                        description == ("ALLIANT CU ONLINE PMT") ||
                        description == ("AMERICAN EXPRESS ONLINE PMT") ||
                        description == ("CHASE CARD SERV ONLINE PMT") ||
                        description == ("CITIBANK CRDT CD ONLINE PMT") ||
                        description.startsWith("Internet transfer")) {
                        return null;
                    }
                    break;
                case "amazon":
                case "freedom":
                    if (!["Sale", "Fee"].includes(type)) {
                        return null;
                    }
                    break;
                case "citi":
                    if (!amount ||
                        description == ("CITIBANK CRDT CD ONLINE PMT")) {
                        return null;
                    }
                    break;
                case "amex":
                    if (description == ("ELECTRONIC PAYMENT RECEIVED-THANK") ||
                        description == ("YOUR CASH REWARD/REFUND IS")) {
                        return null;
                    }
                    break;
                case "alliant":
                    if (description.endsWith("CREDIT") ||
                        description == ("PAYMENT - THANK YOU")) {
                        return null;
                    }
            }

            return {
                date: date,
                description: description,
                amount: amount
            }
        } else {
            throw new Error(`Unmatched transaction ${account} CSV line: ${line}`)
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
