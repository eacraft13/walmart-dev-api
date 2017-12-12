var _ = require('lodash');
var config = require('./config');
var request = require('request'),
    throttledRequest = require('throttled-request')(request);

/**
 * Walmart search api
 * Api limits: 5000/day & 5/second (1/120 milliseconds)
 * @param {object} credentials
 */
module.exports = function (credentials) {
    'use strict';

    throttledRequest.configure({
        requests: 3,
        milliseconds: 1001
    });

    return {
        /**
         * Search by query
         * @param {string} query
         * @returns {Promise}
         */
        byQuery: function (query) {
            return new Promise(function (resolve, reject) {
                throttledRequest({
                    url: config.uri,
                    qs: _.assign(
                        {},
                        config.params,
                        {
                            apiKey: credentials.key,
                            query: query
                        }
                    )
                }, function (err, res, body) {
                    var data;

                    if (err)
                        reject(err);

                    if (res.statusCode !== 200)
                        reject(res.statusCode + ' : ' + body);

                    try {
                        if (body)
                            data = JSON.parse(body);
                    } catch (e) {
                        reject(res.statusCode + ' : ' + body);
                    }

                    resolve(data ? data.items : []);
                });
            });
        }
    };
};
