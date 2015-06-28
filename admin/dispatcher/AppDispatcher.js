var Dispatcher    = require('flux').Dispatcher;
var assign        = require('object-assign');
var DataStore     = require('../store/DataStore');

var AppDispatcher = assign(new Dispatcher, {});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'alert':
            DataStore.emit('alert', payload.message);
            break;
        case 'toggle-customer-active':
            DataStore.patchCustomer(payload.patch);
            break;
        case 'update-customer':
            DataStore.updateCustomer(payload.update);
            break;
        default:
    }
    return true;
});

module.exports = AppDispatcher;
