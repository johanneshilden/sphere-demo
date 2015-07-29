var Dispatcher    = require('flux').Dispatcher;
var DataStore     = require('../store/DataStore');
var assign        = require('object-assign');

var AppDispatcher = assign(new Dispatcher, {});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'customer-partial-registration':
            var response = DataStore.invokeCommand({
                method   : 'POST',
                resource : 'tasks',
                payload  : payload.task
            });
            if ('success' !== response.status) 
                return;
            if (!payload.customer.hasOwnProperty('_links'))
                payload.customer['_links'] = {};
            if (response.hasOwnProperty('data') && response.data.hasOwnProperty('_links') && response.data['_links'].hasOwnProperty('self')) {
                payload.customer['_links']['task'] = response.data['_links']['self'];
            } else if (response.hasOwnProperty('command') && response.command.hasOwnProperty('up') && response.command.up.hasOwnProperty('task')) {
                payload.customer['_links']['task'] = { href: response.command.up['task'] };
            }
            var response = DataStore.invokeCommand({
                method   : 'POST',
                resource : 'registrations',
                payload  : payload.customer
            });
            if ('success' === response.status) {
                DataStore.emit('change');
                //DataStore.emit('customer-activity-register');
                //var notification = payload.notification;
                //if (notification)
                //    DataStore.emit('notification', notification);
                //else
                //    DataStore.emit('notification', {
                //        message : 'The customer activity was successfully registered.',
                //        level   : 'success'
                //    });
            }
            break;
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
