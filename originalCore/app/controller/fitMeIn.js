// Description: Provides the co-ordination for the user FitMeIn Application
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const fitmein = require('../repository/fitMeIn');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const postSpot = (req, next) => {

    fitmein.postSpot(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postSpot - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postrisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const getSpots = (req, next) => {
    fitmein.getSpots(req, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - getSpots - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const patchSpot = (req, next) => {
    fitmein.patchSpot(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - patchSpot - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const patchSpotBasket = (req, next) => {
    fitmein.patchSpotBasket(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - patchSpotBasket - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const patchSpotBasketRemove = (req, next) => {
    fitmein.patchSpotBasketRemove(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - patchSpotBasketRemove - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const patchSpotPurchase = (req, next) => {
    fitmein.patchSpotPurchase(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - patchSpotPurchase - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const deleteSpot = (req, next) => {
    fitmein.deleteSpot(req.headers.id, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - getSpots - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

const postOrder = (req, next) => {

    fitmein.postOrder(req.body, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - postOrder - status: ${err.status} msg: ${err.msg} req: ${req.body}`);
            next(err, null);
        }
        else {
            // console.log('MC1', req.body.basketItems);
            // update each spot in this order with the order number
            let purchaseSpotId = [];
            // let basketItems = JSON.parse(req.body.basketItems);
            let basketItems = req.body.basketItems;

            basketItems.forEach(spot => {
                purchaseSpotId.push(spot.id)
            });

            // console.log('MC2', purchaseSpotId, basketItems);

            fitmein.patchSpotPurchase(parseInt(res.msg.insertId), purchaseSpotId, (err, result) => {
                if(err) {
                    log.error(`POST v${version} - failed - postOrder/patchSpotPurchase - status: ${err.status} msg: ${err.msg} req: ${req.body}`);
                    next(err, null);
                } else {
                    next(null, res);
                }
            })
        }
    });
};

const getOrders = (req, next) => {
    fitmein.getOrders(req.headers, (err, res) => {
        if(err) {
            log.error(`POST v${version} - failed - getOrders - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getRisk - status: ${res.status}`);
            next(null, res);
        }
    });
};

module.exports = {
    postSpot: postSpot,
    getSpots: getSpots,
    patchSpot: patchSpot,
    deleteSpot: deleteSpot,
    postOrder: postOrder,
    getOrders: getOrders,
    patchSpotBasket: patchSpotBasket,
    patchSpotPurchase: patchSpotPurchase,
    patchSpotBasketRemove: patchSpotBasketRemove
}