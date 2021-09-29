const fs = require("fs");

class Money {
    constructor(config) {
        this.transactionParser = {
            alliant: { regex: /^(\d\d?)\/(\d\d?)\/(\d{2}),([^,]+),\$([^,]+),[^,]+,[^,]+/, description: 4, amount: 5 },
            amazon:  { regex: /^(\d\d?)\/(\d\d?)\/(\d{2}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/, description: 4, amount: 6, type: 5 },
            amex:    { regex: /^(\d\d?)\/(\d\d?)\/(\d{2}),([^,]+),[^,]+,[^,]+,([^,]+)/, description: 4, amount: 5 },
            //bank:    { regex: /^(\d\d?)\/(\d\d?)\/(\d{2}),[^,]*,([^,]+),([^,]*),/, description: 4, amount: 5 },
            bank:    { regex: /^(\d{4})\-(\d{2})\-(\d{2}),[^,]+,([^,]+),([^,]+),([^,]+)/, description: 6, amount: 4, type: 5 },
            citi:    { regex: /^[^,]+,(\d\d?)\/(\d\d?)\/(\d{2}),([^,]+),([^,]*),/, description: 4, amount: 5 },
            freedom: { regex: /^(\d\d?)\/(\d\d?)\/(\d{2}),[^,]+,([^,]+),[^,]*,([^,]+),([^,]+),/, description: 4, amount: 6, type: 5 }
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
            //const transaction = account == "bank" ? this.parseBankCSVLine(line): this.parseCreditCardCSVLine(line);
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
                : `${matches[1].padStart(2, "0")}/${matches[2].padStart(2, "0")}/20${matches[3]}`;
            //const description = matches[this.transactionParser[account]["description"]].replace(/ELECTRONIC BILL PAY [A-Z0-9]{8} |ACH DEBIT /, "");
            const description = matches[this.transactionParser[account]["description"]].split("~")[0];
            const amount = Math.abs(matches[this.transactionParser[account]["amount"]]);
            const type = matches[this.transactionParser[account]["type"]];

            switch(account) {
                case "bank":
                    //if (description.startsWith("FUNDS TRANSFER") ||
                    //    description.includes("CHASE MASTERCARD") ||
                    //    description.includes("AMERICAN EXPRESS") ||
                    //    description.includes("TD AMERITRADE") ||
                    //    !amount) {
                    //    return null;
                    //}
                    if (type == "Deposit") {
                        return null;
                    }
                    if (description == ("ALLIANT CU XFER") ||
                        description == ("AMERICAN EXPRESS ONLINE PMT") ||
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
                    if (!amount) {
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

    parseBankCSVLine(line) {
        const matches = this.sanitizeCSVLine(line).match(this.bankTransactionRegex);
        if (matches) {
            //console.log(`TRANSACTION: ${matches[1]}/${matches[2]}/${matches[3]} - ${matches[4]} - ${matches[5]}`);
            // 1 - Transaction month
            // 2 - Transaction day
            // 3 - Transaction year
            // 4 - Description
            // 5 - Withdrawal amount (empty if deposit)

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

    parseCreditCardCSVLine(line) {
        const matches = line.match(this.amazonTransactionRegex);
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
            };
        } else {
            throw new Error(`Unmatched credit card transaction CSV line: ${line}`);
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
