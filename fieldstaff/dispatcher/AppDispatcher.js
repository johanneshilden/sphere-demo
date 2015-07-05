var Dispatcher    = require('flux').Dispatcher;
var DataStore     = require('../store/DataStore');
var assign        = require('object-assign');

var AppDispatcher = assign(new Dispatcher, {});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'complete-registration':
            DataStore.emit('register-partial', payload.partial);
            break;
        case 'delete-registration':
            DataStore.deleteTemplate(payload.href);
            DataStore.emit('alert', 'The customer registration was deleted.');
            break;
        case 'create-customer':
            DataStore.createCustomer(payload.customer);
            DataStore.deleteTemplate(payload.customer.template);
            break;
        case 'create-complaint':
            DataStore.createComplaint(payload.complaint);
            break;
        case 'complaint-resolve':
            DataStore.resolveComplaint(payload.complaintId);
            break;
        case 'alert':
            DataStore.emit('alert', payload.message);
            break;
        default:
    }
    return true;
});

module.exports = AppDispatcher;
