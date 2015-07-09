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

    patchCustomer: function(patch) {
        this.api.command({
            method   : 'PATCH',
            resource : 'customers/' + patch.customerId,
            payload  : patch.data 
        });
        this.emit('change');
    },

    updateCustomer: function(update) {
        this.api.command({
            method   : 'PUT',
            resource : 'customers/' + update.customerId,
            payload  : update.data 
        });
        this.emit('change');
        this.emit('alert', 'The customer was updated.');
        window.location.hash = 'customers';
    }

});

module.exports = DataStore;
