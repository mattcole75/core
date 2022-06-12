// Description: Provides the co-ordination for the user organisation functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const organisation = require('../repository/organisation');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const postOrganisationArea = (req, next) => {
    organisation.postOrganisationArea(req.body, (err, org) => {
        if(err) {
            log.error(`POST v${version} - failed - postOrganisationArea - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postOrganisationArea - status: ${org.status}`);
            next(null, org);
        }
    });
};

const getOrganisationalAreas = (req, next) => {
    organisation.getOrganisationalAreas(req, (err, organisationAreas) => {
        if(err) {
            log.error(`POST v${version} - failed - getOrganisationAreas - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getOrganisationAreas - status: ${organisationAreas.status}`);
            next(null, organisationAreas);
        }
    });
};

module.exports ={ 
    postOrganisationArea: postOrganisationArea,
    getOrganisationalAreas: getOrganisationalAreas
}