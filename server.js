// Description: The entry point for the Core application, a collection of webservices to authenticate users and support various applications
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

'use strict';
const dotenv = require('dotenv').config();
const database = require('./configuration/database');
const config = require('./configuration/config');
const application = config.get('application');
const express = require('./configuration/express');

const port = process.env.APP_PORT || 1337;

if(dotenv.error) {
    console.log(dotenv.error);
    process.exit(1);
}

const app = express();

database.connect(error => {
    if(error) {
      console.log('Database connection failed: ', error);
      process.exit(1);
    }
    else {
        app.listen(port, () => {
            console.log(application + ' server is running on port: ' + port);
        });
    }
});