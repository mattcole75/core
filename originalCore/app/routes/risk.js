// Description: Provides the routes for the Phobos risk application
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');
const risk = require('../controller/risk');

module.exports = (app) => {

    app.post('/api/' + version + '/phobos/risk', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                risk.postRisk(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.post('/api/' + version + '/phobos/risk/location', (req, res) => {

        res.set('Content-type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                risk.postRiskLocation(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.post('/api/' + version + '/phobos/risk/keywordphrase', (req, res) => {

        res.set('Content-type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                risk.postRiskKeyWordPhrase(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.post('/api/' + version + '/phobos/risk/area', (req, res) => {

        res.set('Content-type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                risk.postRiskArea(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.get('/api/' + version + '/phobos/risk', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                risk.getRisk(req, (err, risk) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(risk.status).send(risk);
                });
            }
        });
    });
}