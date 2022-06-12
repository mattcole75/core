// Description: Provides the routes for the IntelliVerse functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');
const intelliverse = require('../controller/intelliVerse');

module.exports = (app) => {

    app.post('/api/' + version + '/ivEntry', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                intelliverse.postIvEntry(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.get('/api/' + version + '/ivIntelliSense', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                intelliverse.getIvIntelliSense(req, (err, intelliSense) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(intelliSense.status).send(intelliSense);
                });
            }
        });
    });

    app.get('/api/' + version + '/ivIntelliSuggest', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                intelliverse.getIvIntelliSuggest(req, (err, intelliSuggest) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(intelliSuggest.status).send(intelliSuggest);
                });
            }
        });
    });

}