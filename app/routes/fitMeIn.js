// Description: Provides the routes for the FitMeIn application
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const config = require('../../configuration/config');
const version = config.get('version');
const user = require('../controller/user');
const fitmein = require('../controller/fitMeIn');

module.exports = (app) => {

    app.post('/api/' + version + '/fitmein/spot', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.postSpot(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.get('/api/' + version + '/fitmein/spots', (req, res) => {
        
        res.set('Content-Type', 'application/json');

            fitmein.getSpots(req, (err, result) => {
                if(err)
                    res.status(err.status).send(err);
                else
                    res.status(result.status).send(result);
            });
    });

    app.patch('/api/' + version + '/fitmein/spot', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.patchSpot(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.patch('/api/' + version + '/fitmein/spotbasket', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.patchSpotBasket(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.patch('/api/' + version + '/fitmein/spotbasketremove', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.patchSpotBasketRemove(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.patch('/api/' + version + '/fitmein/spotpurchase', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.patchSpotPurchase(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.delete('/api/' + version + '/fitmein/spot', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.deleteSpot(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.post('/api/' + version + '/fitmein/order', (req, res) => {
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.postOrder(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });

    app.get('/api/' + version + '/fitmein/orders', (req, res) => {
        
        res.set('Content-Type', 'application/json');

        user.isAuthenticated(req, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                fitmein.getOrders(req, (err, result) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(result.status).send(result);
                });
            }
        });
    });
}