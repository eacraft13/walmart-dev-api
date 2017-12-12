(function () {
    'use strict';

    var credentials = require('./secret/walmart'),
        walmart = require('walmart-dev-api')(credentials);

    /**
     * Example of using the search api
     */
    walmart.search
    .byQuery('ipod')
    .then(function (items) {
        console.log(items);
        process.exit();
    })
    .catch(function (err) {
        console.log(err);
        process.exit(1);
    });
})();
