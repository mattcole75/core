// Description: a body parser utility
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. Added this descriptive header

const rawParser = (req, res, next) => {

    let data = new Buffer.from('');

    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });

    req.on('end', function () {
        req.body = data;
        next();
    });
};

module.exports = rawParser;