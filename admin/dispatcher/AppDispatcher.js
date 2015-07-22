var Dispatcher    = require('flux').Dispatcher;
var assign        = require('object-assign');
var DataStore     = require('../store/DataStore');

var AppDispatcher = assign(new Dispatcher, {});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'command-invoke':
            DataStore.invokeCommand(payload.command);
            break;
        case 'alert':
            DataStore.emit('alert', payload.message);
            break;
        default:
    }
    return true;
});

module.exports = AppDispatcher;
