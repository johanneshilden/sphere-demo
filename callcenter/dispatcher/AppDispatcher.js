var Dispatcher    = require('flux').Dispatcher;
var DataStore     = require('../store/DataStore');
var assign        = require('object-assign');

var AppDispatcher = assign(new Dispatcher, {});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
//        case 'customer-registration':
//            DataStore.registerCustomer(payload.customer);
//            break;
//        case 'create-complaint':
//            DataStore.createComplaint(payload.complaint);
//            break;
//        case 'complaint-resolve':
//            DataStore.resolveComplaint(payload.complaintId);
//            break;
//        case 'create-contact':
//            DataStore.createContact(payload.contact);
//            break;
//        case 'delete-contact':
//            DataStore.deleteContact(payload.contact);
//            break;
        case 'command-invoke':
            DataStore.invokeCommand(payload.command);
            break;
//        case 'alert':
//            DataStore.emit('alert', payload.message);
//            break;
        default:
    }
    return true;
});

module.exports = AppDispatcher;
