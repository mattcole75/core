// Description: Provides the routes for the user management functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');

module.exports = (app) => {

    app.post('/api/' + version + '/user', (req, res) => {
        
        user.postUser(req, (err, user) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(user.status).send(user);
        });
    });

    app.post('/api/' + version + '/user/login', (req, res) => {

        user.login(req.body, (err, auth) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(auth.status).send(auth);
        });
    });

    app.get('/api/' + version + '/user', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                user.getUser(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.patch('/api/' + version + '/user', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                user.patchUser(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.post('/api/' + version + '/user/logout', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                user.logout(req, (err, auth) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(auth.status).send(auth);
                });
            }
        });
    });

    app.patch('/api/' + version + '/user/avatar', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                user.patchAvatar(req, (err, avatar) => {
                    
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(avatar.status).send(avatar);
                });
            }
        });
    });

    app.delete('/api/' + version + '/user/avatar', (req, res) => {

        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {

                user.deleteAvatar(req, (err, avatar) => {
                    
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(avatar.status).send(avatar);
                });
            }
        });
    });
        
};