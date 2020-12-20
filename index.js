const fs = require("fs");
const server = require("./server");

const port = 8080;
const apps = {};
const appsDir = __dirname + "/apps/";
const config = {
  saveDir: "/opt/save/",
  webDir: "/var/www/",
}

fs.readdirSync(appsDir, { withFileTypes: true}).forEach(function(appDirEntry) {
    if (appDirEntry.isDirectory()) {
        apps[appDirEntry.name] = new (require(appsDir + appDirEntry.name).app)(config);
    }
});

server.start(apps, port);
