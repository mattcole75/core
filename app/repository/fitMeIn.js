// Description: Provides the repository for the user FitMeIn Application
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const {postSpotSchema, putSpotSchema, postOrderSchema, patchSpotBasketSchema, patchSpotPurchaseSchema, patchSpotBasketRemoveSchema} = require('../../data/validation/schema/fitMeInSchema');
const validate = require('../../data/validation/validate');

const postSpot = (req, next) => {
    
    const errors = validate(req, postSpotSchema);

    if(errors.length > 0)
        next({status: 400, msg: 'Bad Request'}, null);
    else {

        const values = [req.ownerUserId, req.title, req.description, req.appointmentDateTime, req.duration, req.price, req.imageUrl];

        database.getPool().query(
            'insert into Spot (ownerUserId, title, description, appointmentDateTime, duration,  price, imageUrl) values (?)',
            [values],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else
                    next(null, {status: 201, msg: res});
            }
        );
    }
};

const getSpots = (req, next) => {

    const sqlQuery = `select id, ownerUserId, title, description, appointmentDateTime, duration, price, imageUrl 
                        from Spot where inBasketUserId is null and purchaseOrderId is null`;

    database.getPool().query (
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, spots: res});
        }
    );
};

const patchSpot = (req, next) => {

    const errors = validate(req, putSpotSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const sqlQuery = `update Spot set title = '${req.title}', description = '${req.description}', appointmentDateTime = '${req.appointmentDateTime}', duration = ${req.duration}, price = ${req.price}, imageUrl = '${req.imageUrl}' where id = ${req.id}`;

        database.getPool().query (
            sqlQuery,
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.affectedRows !== 1 && res.changedRows !== 1 && res.insertId !== 0)
                    next({status: 400, msg: res.message});
                else
                    next(null, {status: 200, msg: res});
            }
        );
    }
};

const patchSpotBasket = (req, next) => {

    const errors = validate(req, patchSpotBasketSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const sqlQuery = `update Spot set inBasketUserID = '${req.inBasketUserID}', inBasketDateTime = now() where id = ${req.id}`;

        database.getPool().query (
            sqlQuery,
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.affectedRows !== 1 && res.changedRows !== 1 && res.insertId !== 0)
                    next({status: 400, msg: res.message});
                else
                    next(null, {status: 200, msg: res});
            }
        );
    }
};

const patchSpotBasketRemove = (req, next) => {

    const errors = validate(req, patchSpotBasketRemoveSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const sqlQuery = `update Spot set inBasketUserID = null where id = ${req.id}`;

        database.getPool().query (
            sqlQuery,
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.affectedRows !== 1 && res.changedRows !== 1 && res.insertId !== 0)
                    next({status: 400, msg: res.message});
                else
                    next(null, {status: 200, msg: res});
            }
        );
    }
};

const patchSpotPurchase = (orderId, spotIds, next) => {

    const sqlQuery = `update Spot set purchaseOrderId = '${orderId}' where id in(${spotIds.join(',')})`;

    database.getPool().query(
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else if (res.affectedRows !== 1 && res.changedRows !== 1 && res.insertId !== 0)
                next({status: 400, msg: res.message});
            else
                next(null, {status: 201, msg: res});
        }
    );
};

const deleteSpot = (id, next) => {

    const sqlQuery = 'delete from Spot where id = ?';

    database.getPool().query (
        sqlQuery,
        [id],
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, msg: res});
        }
    );
};

const postOrder = (req, next) => {
    
    const errors = validate(req, postOrderSchema);

    if(errors.length > 0)
        next({status: 400, msg: 'Bad Request'}, null);
    else {

        const values = [req.localId, JSON.stringify(req.basketItems), req.total];

        database.getPool().query(
            'insert into `Order` (localId, basketItems, total) values (?)',
            [values],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else
                    next(null, {status: 201, msg: res});
            }
        );
    }
};

const getOrders = (req, next) => {

    const values = [req.localid];
    const sqlQuery = 'select id, basketItems, total, created as date from `Order` where localId = (?)';

    database.getPool().query (
        sqlQuery,
        [values],
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else {
                next(null, {status: 200, orders: res});
            }
        }
    );
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