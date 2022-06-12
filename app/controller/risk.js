// Description: Provides the co-ordination for the user risk functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const risk = require('../repository/risk');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const postRisk = (req, next) => {

    risk.postRisk(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postrisk - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postrisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const postRiskLocation = (req, next) => {

    risk.postRiskLocation(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postRiskLocation - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postRiskLocation - status: ${res.status}`);
            next(null, res);
        }
    });
};

const postRiskKeyWordPhrase = (req, next) => {

    risk.postRiskKeyWordPhrase(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postRiskKeyWordPhrase - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postRiskKeyWordPhrase - status: ${res.status}`);
            next(null, res);
        }
    });
};

const postRiskArea = (req, next) => {

    risk.postRiskArea(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postRiskArea - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postRiskArea - status: ${res.status}`);
            next(null, res);
        }
    });
};

const getRisk = (req, next) => {
    risk.getRisk(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - getRisk - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

module.exports = {
    postRisk: postRisk,
    postRiskLocation: postRiskLocation,
    postRiskKeyWordPhrase: postRiskKeyWordPhrase,
    postRiskArea: postRiskArea,
    getRisk: getRisk
}