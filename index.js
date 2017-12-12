module.exports = function (credentials) {
    'use strict';

    return {
        search: require('./lib/search/search')(credentials),
    };
};
