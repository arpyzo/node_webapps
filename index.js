const server = require("./server");

const port = 8080;
const apps = {};
const appsDir = "./apps";

require("fs").readdirSync(appsDir, { withFileTypes: true}).forEach(function(appDirEntry) {
    if (appDirEntry.isDirectory()) {
        apps[appDirEntry.name] = require(appsDir + "/" + appDirEntry.name);
    }
});

server.start(apps, port);
