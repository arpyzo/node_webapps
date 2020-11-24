const server = require("./server");

const apps = {};
const appsDir = "./apps";

require("fs").readdirSync(appsDir, { withFileTypes: true}).forEach(function(appDirEntry) {
    if (appDirEntry.isDirectory()) {
        apps[appDirEntry.name] = require(appsDir + '/' + appDirEntry.name);
    }
});

server.start(apps);
