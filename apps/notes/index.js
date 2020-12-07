const fs = require("fs");

class Notes {
    constructor(saveDir) {
        this.notesDir = saveDir + "notes/";
    }

    handle(request, requestData, response) {
        console.log(`App notes will handle ${request.url}`);

        if (/^\/[a-z]*$/.test(request.url)) {
            return response.returnHTML(fs.readFileSync(__dirname + "/view/index.html"));
        } 

        if (request.url.startsWith("/js/")) {
            return response.returnJS(fs.readFileSync(__dirname + "/view" + request.url));
        } 

        if (request.url.startsWith("/css/")) {
            return response.returnCSS(fs.readFileSync(__dirname + "/view" + request.url));
        }
        
        if (request.url == "/api/load") {
            let category = request.queryParams.get("category");
            if (!category) {
               return response.return400("Missing category parameter");
            }

            if (!this.doNotesExist(category)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getNotes(category));
            } catch(error) {
                console.trace(`Error loading notes: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/save") {
            try {
                var saveData = JSON.parse(requestData);
            } catch(error) {
                return response.return400(error);
            }

            if (!saveData.category || !saveData.notes) {
                return response.return400("Missing or empty category and/or notes");
            }

            if (!this.doNotesExist(saveData.category)) {
                return response.return404();
            }

            try {
                this.saveNotes(saveData.category, saveData.notes);
                return response.return200();
            } catch(error) {
                console.trace(`Error saving notes: ${error}`);
                return response.return500(error);
            }
        }
     
        response.return404();
    }

    doNotesExist(category) {
        return fs.existsSync(this.notesDir + category);
    }

    getNotes(category) {
        return fs.readFileSync(this.notesDir + category);
    }

    saveNotes(category, notes) {
        fs.writeFileSync(this.notesDir + category, notes);
    }
}

exports.app = Notes;
