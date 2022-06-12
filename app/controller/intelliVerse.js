// Description: Provides the co-ordination for the user intelliVerse functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const intelliverse = require('../repository/intelliVerse');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const postIvEntry = (req, next) => {
    intelliverse.postIvEntry(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postIvEntry - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postIvEntry - status: ${res.status}`);
            next(null, res);
        }
    });
};

const getIvIntelliSense = (req, next) => {
    intelliverse.getIvIntelliSense(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - getIvIntelliSense - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getIvIntelliSense - status: ${res.status}`);
            next(null, res);
        }
    });
};

const getIvIntelliSuggest = (req, next) => {
    intelliverse.getIvIntelliSuggest(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - getIvSuggest - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getIvSuggest - status: ${res.status}`);
            next(null, res);
        }
    });
};

module.exports = {
    postIvEntry: postIvEntry,
    getIvIntelliSense: getIvIntelliSense,
    getIvIntelliSuggest: getIvIntelliSuggest
}