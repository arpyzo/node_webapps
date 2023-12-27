var crypto = require('crypto')

function base32ToHex(base32) {
    let base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
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

secret = "6YC24HG7JSKGAKRQ"
secretBuffer = Buffer.from(base32ToHex(secret), 'hex')

epoch = Math.floor(Date.now() / 1000.0);
totpTimeStepHex = Math.floor(epoch / 30).toString(16).padStart(16, "0");
totpTimeRemaining = 30 - epoch % 30;

hmac = crypto.createHmac('sha1', secretBuffer);
hmac.update(totpTimeStepHex, 'hex');
digest = hmac.digest('hex');

offset = parseInt(digest.slice(-1), 16);
otp = (parseInt(digest.substr(offset * 2, 8), 16) & parseInt("7fffffff", 16)).toString();
otp = otp.substr(Math.max(otp.length - 6, 0), 6);

console.log(`${otp} (${totpTimeRemaining}s)`);
