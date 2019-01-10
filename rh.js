'use strict';

const request = require('request-promise');
const config = require('./config');

const RobinhoodWebApi = (token) => {
    let api = {};
    let header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Connection': 'keep-alive',
        'X-Robinhood-API-Version': '1.152.0',
        'User-Agent': 'Robinhood/5.32.0 (com.robinhood.release.Robinhood; build:3814; iOS 10.3.3)'
    };
    header.Authorization = 'Bearer ' + token;

    api.expire_token = () => {
        return request({
            method: 'POST',
            headers: header,
            uri: config.url + config.endpoints.logout,
            body: {
                client_id: config.clientId,
                token: config.refresh_token
            },
            json: true,
        });
    };

    api.investment_profile = () => {
        return request({
            headers: header,
            uri: config.url + config.endpoints.investment_profile,
            json: true
        });
    };

    api.fundamentals = (ticker) => {
        return request({
            uri: config.url + [config.endpoints.fundamentals, '/'].join(String(ticker).toUpperCase())
        });
    };

    api.instruments = (symbol) => {
        return request({
            headers: header,
            uri: config.url + config.endpoints.instruments,
            qs: {'query': symbol.toUpperCase()}
        });
    };

    api.quote_data = (symbol) => {
        symbol = Array.isArray(symbol) ? symbol = symbol.join(',') : symbol;
        return request({
            uri: config.url + config.endpoints.quotes,
            qs: {'symbols': symbol.toUpperCase()}
        });
    };

    api.popularity = async (symbol) => {

        try {

            const result = await api.quote_data(symbol);
            const symbol_uuid = JSON.parse(result).results[0].instrument.split('/')[4];
            return request({
                uri: config.url + config.endpoints.instruments + symbol_uuid + '/popularity/'
            });

        } catch (e) {
            throw (e);
        }
    };

    api.accounts = () => {
        return request({
            headers: header,
            uri: config.url + config.endpoints.accounts
        });
    };

    api.user = () => {
        return request({
            headers: header,
            uri: config.url + config.endpoints.user
        });
    };

    api.dividends = () => {
        return request({
            headers: header,
            uri: config.url + config.endpoints.dividends
        });
    };

    api.earnings = (options) => {
        return request({
            headers: header,
            uri: _config.url + config.endpoints.earnings +
                (options.instrument ? "?instrument=" + options.instrument :
                    options.symbol ? "?symbol=" + options.symbol :
                        "?range=" + (options.range ? options.range : 1) + "day")
        });
    };

    api.orders = (options) => {
        if (typeof options["updated_at"] !== "undefined") {
            options['updated_at[gte]'] = options.updated_at;
            delete options["updated_at"];
        }
        return request({
            headers: header,
            uri: config.url + config.endpoints.orders,
            qs: options
        })
    };

    api.order = (orderId) => {
        return request({
            headers: header,
            uri: config.url + config.endpoints.orders,
            qs: {id: orderId},
        })
    };

    api.cancel_order = (orderId) => {
        return request({
            method : "POST",
            headers: header,
            uri : config.url + config.endpoints.cancel_order.replace("{{order_id}}", orderId),
        })
    };

    return api;
};

module.exports = RobinhoodWebApi;
