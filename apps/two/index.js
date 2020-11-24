function route(request, requestData, response) {
    console.log(`App two will handle ${request.url}`);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(`App two will handle '${request.url}'\n`);
    response.end();

//    if (path == 'tres') { return do_tres; }
//    if (path == 'quatro') { return do_quatro; }
}

function do_tres() {
    console.log('TRES');
}

function do_quatro() {
    console.log('QUATRO');
}

exports.route = route;
