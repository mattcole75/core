// Description: Provides the co-ordination for the user location functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const location = require('../repository/location');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const postLocation = (req, next) => {
    location.postLocation(req.body, (err, loc) => {
        if(err) {
            log.error(`POST v${version} - failed - postLocation - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postLocation - status: ${loc.status}`);
            next(null, loc);
        }
    });
};

const getLocations = (req, next) => {
    location.getlocations(req, (err, locations) => {
        if(err) {
            log.error(`POST v${version} - failed - getLocations - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getLocations - status: ${locations.status}`);
            next(null, locations);
        }
    });
};

module.exports ={ 
    postLocation: postLocation,
    getLocations: getLocations
}