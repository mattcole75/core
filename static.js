// Description: Static file web server
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 


const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Phobos static file server');
});

app.listen(port, () => console.log(`Static file server running on port: ${port}`));