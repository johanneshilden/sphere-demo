var fs         = require('fs');
var GroundFork = require('./js/groundfork-js/groundfork');
var request    = require('request');

//function MemStorage() {
//    this._data = {};
//}
//
//MemStorage.prototype.insertItem = function(key, value) {
//    this._data[key] = JSON.stringify(value);
//};
//
//MemStorage.prototype.getItem = function(key) {
//    return JSON.parse(this._data[key]);
//};
//
//MemStorage.prototype.removeItem = function(key) {
//    delete this._data[key];
//};
//
//MemStorage.prototype.hasItem = function(key) {
//    return !!this._data[key];
//};
//
//MemStorage.prototype.updateCollectionWith = function(key, update) {
//    var collection = JSON.parse(this._data[key]);
//    if (!collection) {
//        collection = {
//            "_links": {
//                "self": {"href": key}
//            },
//            "count": 0
//        };
//        collection['_links'][key] = [];
//    }
//    update(collection);
//    this._data[key] = JSON.stringify(collection);
//};
//
//MemStorage.prototype.addToCollection = function(key, value, item) {
//    this.updateCollectionWith(key, function(collection) {
//        if (!item)
//            item = key;
//        if (!collection.hasOwnProperty('_links')) {
//            collection['_links'] = {};
//        }
//        if (!collection['_links'].hasOwnProperty(item)) {
//            collection['_links'][item] = [];
//        }
//        var items = collection['_links'][item];
//        for (var i = 0; i < items.length; i++) {
//            if (items[i].href === value) 
//                return;
//        }
//        items.push({"href": value});
//        collection['_links'][item] = items;
//        if (collection.hasOwnProperty('count'))
//            collection.count++;
//    });
//};
//
//MemStorage.prototype.removeFromCollection = function(key, value, item) {
//    this.updateCollectionWith(key, function(collection) {
//        if (!item)
//            item = key;
//        if (!collection.hasOwnProperty('_links')) 
//            return;
//        var items = collection['_links'][item];
//        if (!items)
//            return;
//        for (var i = 0; i < items.length; i++) {
//            if (items[i].href === value) {
//                items.splice(i, 1);
//                collection['_links'][item] = items;
//                if (collection.hasOwnProperty('count'))
//                    collection.count--;
//                return;
//            }
//        }
//    });
//};
//
//MemStorage.prototype.firstAvailableKey = function(resource) {
//    var i = 1;
//    while (this._data.hasOwnProperty(resource + '/' + i))
//        i++;
//    return resource + '/' + i;
//};
//
//MemStorage.prototype.getSelfHref = function(obj) {
//    return getSelfHref(obj);
//};
//
//MemStorage.prototype.keys = function() {
//    return Object.getOwnPropertyNames(this._data);
//}
//
//MemStorage.prototype.toString = function() {
//    return JSON.stringify(this._data, null, 4);
//}

var store = new GroundFork.BrowserStorage({
    namespace : 'sphere.installer'
});

var api = new GroundFork.Api({
    storage: store,
    debugMode: false,
    interval: 1,
    onBatchJobStart: function() {
        console.log('Batch job start.');
    },
    onBatchJobComplete: function() {
        console.log('Batch job complete.');
    }
});

var config = {
    //url    : 'http://localhost:3333/',
    url    : 'http://agile-oasis-7393.herokuapp.com/',
    key    : 'root',
    secret : 'root'
};

var endpoint = new GroundFork.BasicHttpEndpoint({
    api: api,
    url: config.url,
    clientKey: config.key,
    clientSecret: config.secret, 
    requestHandler: GroundFork.BasicHttpEndpoint.nodeRequestHandler,
    onRequestStart: function() {
        console.log('Request start.');
    },
    onRequestComplete: function() {
        console.log('Request complete.');
    }
});

fs.readFile('install.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var obj;
    try {
        obj = JSON.parse(data);
    } catch(e) {
        console.log(e);
        return;
    }

    request.post({
        url: config.url + 'log/reset'
    }, function(err, httpResponse, resp) {
        if (err) {
            console.log(err);
        } else {
            console.log('Log reset.');
        }
    }.bind(this)).auth(config.key, config.secret, true);

    var count = 0;
    for (var key in obj) {
        var batch = obj[key];
        for (var i = 0; i < batch.length; i++) {
            var payload = batch[i];

            /*  Insert a max. number of customers */
            if ('customers' === key) {
                count++;
                if (count > 100)   // 1000
                    continue;
            }

            var response = api.command({
                method: 'POST',
                resource: key,
                payload: payload
            });
            var itemId = response.data['_links']['self'].href;

            // ----
            if ('products' === key) {
                api.command({
                    method: 'POST',
                    resource: 'stock',
                    payload: {
                        "_links": { 
                          "product": { "href": itemId },
                          "_parent": { "href": itemId } 
                        },
                        "actual": 10,
                        "available": 10
                    }
                });
                api.command({
                    method: 'POST',
                    resource: 'prices',
                    payload: {
                        "_links": { 
                          "product": { "href": itemId },
                          "_parent": { "href": itemId } 
                        },
                        "Default": 100,
                        "Duka": 100,
                        "Cafe": 100,
                        "Wholesale": 80,
                        "Retail": 100,
                        "Distributor": 60,
                        "Partner": 90
                    }
                });
            }
            // ----

            console.log(itemId);
        }
    }

    var prev = null;

    endpoint.sync(['sink'], 
        function(r) {
            console.log('Sync complete.');
        },
        function() {
            // .. 
        },
        function(p, q) {
            var complete = Math.ceil(100 * p/q);
            if (complete === prev)
                return;
            prev = complete;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write('[ ');
            var str = '';
            for (var i = 0; i < complete; i++) {
                str += '-';
            }
            while (i++ < 100)
                str += ' ';
            process.stdout.write(str + ' ] ');
        }
    );

});

