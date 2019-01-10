const express = require('express');
const router = express.Router();
const config = require('./../config');
const robinhood = require('../rh')(config.token);

router.get('/', async (req, res) => {


    const ip = await robinhood.dividends();

    res.status(200).send(ip);

});

module.exports = router;