var Dispatcher    = require('flux').Dispatcher;
var DataStore     = require('../store/DataStore');
var assign        = require('object-assign');

var AppDispatcher = assign(new Dispatcher, {});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'command-invoke':
            var response = DataStore.invokeCommand(payload.command);
            if ('success' === response.status) {
                DataStore.emit('change');
                var notification = payload.notification;
                if ('activities' === payload.command.resource) {
                    DataStore.emit('customer-activity-register');
                    if (!notification) {
                        DataStore.emit('notification', {
                            message : 'The customer activity was successfully registered.',
                            level   : 'success'
                        });
                    }
                }
                if (notification)
                    DataStore.emit('notification', notification);
            }
            break;
        case 'customer-activity':
            var response = DataStore.invokeCommand(payload.command);
            if ('success' !== response.status) 
                return;
            var activity = payload.activity;
            if (!activity.hasOwnProperty('_links'))
                activity['_links'] = {};
            if (response.hasOwnProperty('data') && response.data.hasOwnProperty('_links') && response.data['_links'].hasOwnProperty('self')) {
                activity['_links']['resource'] = response.data['_links']['self'];
            } else if (response.hasOwnProperty('command') && response.command.hasOwnProperty('up') && response.command.up.hasOwnProperty('resource')) {
                activity['_links']['resource'] = {
                    href: response.command.up.resource
                };
            }
            var response = DataStore.invokeCommand({
                method   : 'POST',
                resource : 'activities',
                payload  : activity
            });
            if ('success' === response.status) {
                DataStore.emit('change');
                DataStore.emit('customer-activity-register');
                var notification = payload.notification;
                if (notification)
                    DataStore.emit('notification', notification);
                else
                    DataStore.emit('notification', {
                        message : 'The customer activity was successfully registered.',
                        level   : 'success'
                    });
            }
            break;
        default:
            break;
    }
    return true;
});

module.exports = AppDispatcher;
