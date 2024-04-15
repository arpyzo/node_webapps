const fs = require('fs');
var crypto = require('crypto')

class Totp {
   constructor(config) {
        this.totpDir = config.saveDir;

        const totpFileData = fs.readFileSync(this.totpDir + 'totp.json');
        this.totpData = JSON.parse(totpFileData);
    }

    handle(request, response) {
        if (/^\/[a-z0-9]+$/.test(request.url)) {
            const totpName = request.url.slice(1);

            if (this.doesTotpExist(totpName)) {
                return response.returnText(this.getTotp(totpName));
            }
        }

        response.return404();
    }

    doesTotpExist(totpName) {
        return totpName in this.totpData;
    }

    getTotp(totpName) {
        const secretBuffer = Buffer.from(this.base32ToHex(this.totpData[totpName]), 'hex')
        
        const epoch = Math.floor(Date.now() / 1000.0);
        const totpTimeStepHex = Math.floor(epoch / 30).toString(16).padStart(16, "0");
        const totpTimeRemaining = 30 - epoch % 30;
        
        const hmac = crypto.createHmac('sha1', secretBuffer);
        hmac.update(totpTimeStepHex, 'hex');
        const digest = hmac.digest('hex');
        
        const offset = parseInt(digest.slice(-1), 16);
        let otp = (parseInt(digest.substr(offset * 2, 8), 16) & parseInt("7fffffff", 16)).toString();
        otp = otp.substr(Math.max(otp.length - 6, 0), 6);

        return `${otp} ${totpTimeRemaining}s`;
    }

    base32ToHex(base32) {
        const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";

        for (let i = 0; i < base32.length; i++) {
            let val = base32Chars.indexOf(base32.charAt(i).toUpperCase());
            bits += val.toString(2).padStart(5, "0");
        }

        for (let i = 0; i + 8 <= bits.length; i += 8) {
            let chunk = bits.substr(i, 8);
            hex += parseInt(chunk, 2).toString(16).padStart(2, "0");
        }

        return hex;
    }
}

exports.app = Totp;
