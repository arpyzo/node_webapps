const fs = require("fs");

class Totp {
   constructor(config) {
        this.totpDir = config.saveDir;
    }

    handle(request, response) {
        if (request.url == "/") {
            //getTotp(this.data.toString("utf8"));
            return response.returnText(request.data.toString("utf8"));
            //return response.returnText(this.getTotp('1'));
        }

        response.return404();
    }

    getTotp(secret) {
        let totpFileData = fs.readFileSync(this.totpDir + 'totp.json');
        let totpData = JSON.parse(totpFileData);
        return JSON.stringify(totpData, null, 2);
    }
}

exports.app = Totp;
