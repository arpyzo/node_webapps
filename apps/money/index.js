const fs = require("fs");

class Money {
    constructor(config) {
        this.creditCardTransactionRegex = /^(\d\d?)\/(\d\d?)\/(\d{2}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/;
        this.bankTransactionRegex = /^(\d\d?)\/(\d\d?)\/(\d{2}),[^,]*,([^,]+),([^,]*),/;

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
            const transaction = account == "bank" ? this.parseBankCSVLine(line): this.parseCreditCardCSVLine(line);
            if (transaction) {
                transaction["importance"] = "Discretionary";
                transaction["category"] = "";

                for (const [vendor, category] of Object.entries(this.classification["Vendors"])) {
                    if (transaction["description"].toLowerCase().startsWith(vendor.toLowerCase()) ||
                        transaction["description"].toLowerCase().endsWith(vendor.toLowerCase())) {

                        if (this.classification["Importance"][category]) {
                            transaction["importance"] = this.classification["Importance"][category];
                        }
                    
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

    parseBankCSVLine(line) {
        const matches = this.sanitizeBankCSVLine(line).match(this.bankTransactionRegex);
        if (matches) {
            //console.log(`TRANSACTION: ${matches[1]}/${matches[2]}/${matches[3]} - ${matches[4]} - ${matches[5]}`);
            // 1 - Transaction month
            // 2 - Transaction day
            // 3 - Transaction year
            // 4 - Description
            // 5 - Withdrawal

            if (matches[4].startsWith("FUNDS TRANSFER") ||
                matches[4].includes("CHASE MASTERCARD") ||
                matches[4].includes("AMERICAN EXPRESS") ||
                matches[4].includes("TD AMERITRADE") ||
                !matches[5]) {
                return null;
            }

            return {
                date: `${matches[1].padStart(2, "0")}/${matches[2].padStart(2, "0")}/20${matches[3]}`,
                description: matches[4].replace(/ELECTRONIC BILL PAY [A-Z0-9]{8} |ACH DEBIT /, ""),
                amount: Math.abs(matches[5]),
            }
        } else {
            throw new Error(`Unmatched bank transaction CSV line: ${line}`)
        }
    }

    sanitizeBankCSVLine(line) {
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

    parseCreditCardCSVLine(line) {
        const matches = line.match(this.creditCardTransactionRegex);
        if (matches) {
            //console.log(`TRANSACTION: ${matches[1]}/${matches[2]}/${matches[3]} - ${matches[4]} - ${matches[5]} - ${matches[6]}`);
            // 1 - Transaction month
            // 2 - Transaction day
            // 3 - Transaction year
            // 4 - Vendor*Transaction ID
            // 5 - Transaction type (Sale, Return, Payment, Refund, Adjustment, Fee)
            // 6 - Amount

            if (!["Sale", "Fee"].includes(matches[5])) {
                return null;
            }
            
            return {
                date: `${matches[1].padStart(2, "0")}/${matches[2].padStart(2, "0")}/20${matches[3]}`,
                description: matches[4],
                amount: Math.abs(matches[6]),
            }
        } else {
            throw new Error(`Unmatched credit card transaction CSV line: ${line}`)
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
