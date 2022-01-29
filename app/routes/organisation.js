// Description: Provides the routes for the organisation functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');
const organisation = require('../controller/organisation');

module.exports = (app) => {

    app.post('/api/' + version + '/phobos/organisationarea', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                organisation.postOrganisationArea(req, (err, org) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(org.status).send(org);
                });
            }
        });
    });

    app.get('/api/' + version + '/phobos/organisationarea', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                organisation.getOrganisationalAreas(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

}