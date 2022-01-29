// Description: Provides the co-ordination for the user feedback functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const feedback = require('../repository/feedback');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const postFeedback = (req, next) => {
    feedback.postFeedback(req.body, (err, feedback) => {
        if(err) {
            log.error(`POST v${version} - failed - postFeedback - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postFeedback - status: ${feedback.status}`);
            next(null, feedback);
        }
    });
};

const getFeedback = (req, next) => {
    feedback.getFeedback(req.headers, (err, feedback) => {
        if(err) {
            log.error(`POST v${version} - failed - getFeedback - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getFeedback - status: ${feedback.status}`);
            next(null, feedback);
        }
    });
};

module.exports = {
    postFeedback: postFeedback,
    getFeedback: getFeedback
}