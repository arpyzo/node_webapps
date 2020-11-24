function route(request, requestData, response) {
    console.log(`App one will handle ${request.url}`);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(`App one will handle '${request.url}'\n`);
    response.end();

//    if (path == 'uno') { return do_uno; }
//    if (path == 'dos') { return do_dos; }
}

function do_uno() {
    console.log('UNO');
}

function do_dos() {
    console.log('DOS');
}

exports.route = route;
