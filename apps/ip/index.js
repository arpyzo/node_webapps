class Ip {
    handle(request, response) {
        return response.returnText(request.headers['x-forwarded-for']);
    }
}

exports.app = Ip;
