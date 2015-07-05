var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var GroundFork   = require('../js/groundfork-js/groundfork');

var Response     = GroundFork.ApiResponse;

var DataStore = assign({}, EventEmitter.prototype, {

    fetchCollection: function(collection) {
        var data = [];
        var items = this.store.getItem(collection);
        if (items && items.hasOwnProperty('_embedded') && items['_embedded'].hasOwnProperty(collection)) {
            var collection = items['_embedded'][collection];
            for (var key in collection) {
                var item = collection[key],
                    href = item['_links']['self'].href, 
                    obj = null;
                if (href) {
                    obj = this.store.getItem(href);
                    obj.key = href.split('/')[1];
                    data.push(obj);
                }
            }
        }
        return data;
    },

    registerCustomer: function(customer) {
        customer._local = 'true';
        var response = this.api.command({
            method   : 'POST',
            resource : 'registrations',
            payload  : customer
        });
        this.emit('change');
        this.emit('new-registration');
    },

    createComplaint : function(complaint) {
        complaint._local = 'true';
        var response = this.api.command({
            method   : 'POST',
            resource : 'complaints',
            payload  : complaint 
        });
        this.emit('change');
        this.emit('new-complaint');
        this.emit('alert', 'The complaint was registered.');
    },

    resolveComplaint: function(complaintId) {
        this.api.command({
            method   : 'PATCH',
            resource : complaintId,
            payload  : {
                resolved: Date.now()
            }
        });
        this.emit('change');
    }
 
});

module.exports = DataStore;
