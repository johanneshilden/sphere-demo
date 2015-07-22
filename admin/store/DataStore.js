var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var GroundFork   = require('../js/groundfork-js/groundfork');

var Response     = GroundFork.ApiResponse;

var DataStore = assign({}, EventEmitter.prototype, {

    fetchCollection: function(collection) {
        var data = [];
        var items = this.store.getItem(collection);
        if (items && items.hasOwnProperty('_links') && items['_links'].hasOwnProperty(collection)) {
            var collection = items['_links'][collection];
            for (var key in collection) {
                var item = collection[key],
                    href = item.href, 
                    obj = null;
                if (href && (obj = this.store.getItem(href))) {
                    obj.key = href.split('/')[1];
                    data.push(obj);
                }
            }
        }
        return data;
    },

    invokeCommand: function(command) {
        if ('POST' === command.method) {
            command.payload._local = true;
        }
        var response = this.api.command(command);
        if ('success' === response.status) 
            this.emit('change', command);
    }

});

module.exports = DataStore;
