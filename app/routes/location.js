// Description: Provides the routes for the location functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');
const location = require('../controller/location');

module.exports = (app) => {

    app.post('/api/' + version + '/phobos/location', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                location.postLocation(req, (err, org) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(org.status).send(org);
                });
            }
        });
    });

    app.get('/api/' + version + '/phobos/location', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                location.getLocations(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

}