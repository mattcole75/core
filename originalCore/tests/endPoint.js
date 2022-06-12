// Description: Setup configuration for supertest
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

let supertest = require('supertest');
const config = require('../configuration/config');
const version = config.get('version');
const baseUrl = 'http://localhost:1337/api/' + version;

const endPoint = supertest(baseUrl);

module.exports = endPoint;