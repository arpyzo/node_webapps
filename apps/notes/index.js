const fs = require("fs");

class Notes {
    constructor(config) {
        this.notesDir = config.saveDir + "notes/";
    }

    handle(request, response) {
        if (/^\/[a-z0-9]*$/.test(request.url)) {
            return response.returnAsset(__dirname + "/view/index.html");
        }

        if (request.url == "/api/list") {
            return response.returnText(this.getNotesFile("_list"));
        }

        if (request.url == "/api/load") {
            const category = request.params.get("category");
            if (!category) {
               return response.return400("Missing category parameter");
            }

            if (!this.doNotesExist(category)) {
                return response.return404();
            }

            try {
                return response.returnText(this.getNotesFile(category));
            } catch(error) {
                console.trace(`Error loading notes: ${error}`);
                return response.return500(error);
            }
        }

        if (request.url == "/api/save") {
            const saveData = request.dataObject;

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

    getNotesFile(filename) {
        return fs.readFileSync(this.notesDir + filename);
    }

    saveNotes(category, notes) {
        fs.writeFileSync(this.notesDir + category, notes);
    }
}

exports.app = Notes;
