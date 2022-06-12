// Description: a function to initiate a MySql database connection
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const mySql = require('mysql');
const config = require('./config');

let state = {
    pool: null
};

exports.connect = (done) => {
    state.pool = mySql.createPool(config.get('db'));
    done();
};

exports.getPool = () => {
    return state.pool;
}