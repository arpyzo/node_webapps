function start(request, requestData, response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
               '<head>' +
               '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
               '</head>' +
               '<body>' +
               '<form action="/upload" method="post">' +
               '<textarea name="text" rows="20" cols="60"></textarea>' +
               '<input type="submit" value="Submit text" />' +
               '</form>' +
               '</body>' +
               '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(request, requestData, response) {
    console.log("Request handler 'upload' was called.");

    let fileBuffer = Buffer.from(requestData, 'base64');

    fs = require('fs');
    fs.writeFile("test_filename", fileBuffer, function(err) {
        if (err) { return console.log(err); }
        console.log("File saved");
    });

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();
}

exports.start = start;
exports.upload = upload;
