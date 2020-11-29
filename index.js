const server = require("./server");

const port = 8080;
const apps = {};
const appsDir = "./apps/";
const saveDir = "/Users/robert/Temp/webapps/";

require("fs").readdirSync(appsDir, { withFileTypes: true}).forEach(function(appDirEntry) {
    if (appDirEntry.isDirectory()) {
        apps[appDirEntry.name] = new (require(appsDir + appDirEntry.name).app)(saveDir);
    }
});

server.start(apps, port);
