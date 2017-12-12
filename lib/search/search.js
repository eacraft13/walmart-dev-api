var _ = require('lodash');
var config = require('./config');
var request = require('request'),
    throttledRequest = require('throttled-request')(request);

/**
 * Walmart search api
 * Api limits: 5000/day & 5/second (1/120 milliseconds)
 * @param {object} credentials
 * @returns {object}
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
         * @param {number} page - page number for items list
         * @returns {Promise}
         */
        byQuery: function (query, page) {
            page = page || 1;

            return new Promise(function (resolve, reject) {
                throttledRequest({
                    uri: config.uri,
                    qs: _.assign(
                        {},
                        config.params,
                        {
                            apiKey: credentials.key,
                            query: query,
                            numItems: 25,
                            start: ((page - 1) * 25) + 1
                        }
                    )
                }, function (err, res, body) {
                    var data;

                    if (err)
                        return reject(err);

                    if (res.statusCode !== 200)
                        return reject(`${res.statusCode} (${res.statusMessage})`);

                    try {
                        if (body)
                            data = JSON.parse(body);

                        if (!data.items)
                            return reject('No results.');
                    } catch (e) {
                        return reject(`Error parsing response (${body}).`);
                    }

                    return resolve(
                        _.assign(data.items, {
                            '@numItems': data.numItems,
                            '@totalResults': data.totalResults,
                            '@start': data.start
                        })
                    );
                });
            });
        }
    };
};
