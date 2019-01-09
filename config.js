const dotenv = require('dotenv').config();

const config = {
    token: process.env.TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
    scope: process.env.SCOPE
};
module.exports = config;