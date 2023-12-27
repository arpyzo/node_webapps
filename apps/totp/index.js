const crypto = require('crypto')
const fs = require("fs");

class Totp {
   constructor(config) {
        this.saveDir = config.saveDir;

        let totpAccountsJSON = fs.readFileSync(this.saveDir + "totp.json");
        this.totpAccounts = JSON.parse(totpAccountsJSON);
    }

    handle(request, response) {
        if (request.url == "/") {
            const account = request.params.get("account");
            if (!account) {
                return response.return400("Missing account parameter");
            }
            if (!(account in this.totpAccounts)) {
                return response.return404();
            }

            let [totp, totpTimeRemaining] = this.calculateTotp(this.totpAccounts[account]);
            return response.returnText(`${totp} (${totpTimeRemaining}s)`);
        }

        response.return404();
    }

    base32ToHex(base32) {
        let base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";

        for (let i = 0; i < base32.length; i++) {
            let val = base32Chars.indexOf(base32.charAt(i));
            bits += val.toString(2).padStart(5, "0");
        }

        for (let i = 0; i + 8 <= bits.length; i += 8) {
            let chunk = bits.substr(i, 8);
            hex += parseInt(chunk, 2).toString(16).padStart(2, "0");
        }

        return hex;
    }

    calculateTotp(secret) {
        let secretBuffer = Buffer.from(this.base32ToHex(secret), 'hex')

        let epoch = Math.floor(Date.now() / 1000.0);
        let totpTimeStepHex = Math.floor(epoch / 30).toString(16).padStart(16, "0");
        let totpTimeRemaining = 30 - epoch % 30;

        let hmac = crypto.createHmac('sha1', secretBuffer);
        hmac.update(totpTimeStepHex, 'hex');
        let digest = hmac.digest('hex');

        let offset = parseInt(digest.slice(-1), 16);
        let totp = (parseInt(digest.substr(offset * 2, 8), 16) & parseInt("7fffffff", 16)).toString();
        totp = totp.substr(Math.max(totp.length - 6, 0), 6);

        return([totp, totpTimeRemaining]);
    }
}

exports.app = Totp;
