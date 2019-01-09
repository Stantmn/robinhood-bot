const express = require('express');
const router = express.Router();
const config = require('./../config');
const Robinhood = require('../rh');

router.get('/', async (req, res) => {

    res.status(200).send('asasasa');

});

module.exports = router;