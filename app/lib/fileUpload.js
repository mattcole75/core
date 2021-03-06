// Description: A file Uploader utility
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const util = require("util");
const multer = require("multer");

const dir = './public/user/avatar/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName);
    },
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File types allowed .jpeg, .jpg and .png!'));
        }
    }
}).single("avatar");

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;