// Description: Provides the routes for the user feedback functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');
const feedback = require('../controller/feedback');

module.exports = (app) => {

    app.post('/api/' + version + '/feedback', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                feedback.postFeedback(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.get('/api/' + version + '/feedback', (req, res) => {
        feedback.getFeedback(req, (err, user) => {
            
            res.set('Content-Type', 'application/json');

            if(err)
                res.status(err.status).send(err);
            else
                res.status(user.status).send(user);
        });
    });

};