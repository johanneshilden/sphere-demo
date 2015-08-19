import { Dispatcher }  from 'flux'
import DataStore       from '../store/DataStore'
import assign          from 'object-assign'

const AppDispatcher = assign(new Dispatcher, {})

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'command-invoke':
            {
                let response = DataStore.invokeCommand(payload.command)
                if ('success' === response.status) {
                    DataStore.emit('change')
                    let notification = payload.notification
                    if ('activities' === payload.command.resource) {
                        DataStore.emit('customer-activity-register')
                        if (!notification) {
                            DataStore.emit('notification', {
                                message : 'The customer activity was successfully registered.',
                                level   : 'success'
                            })
                        }
                    }
                    if (notification) {
                        DataStore.emit('notification', notification)
                    }
                }
                break
            }
        case 'customer-activity':
            {
                let response = DataStore.invokeCommand(payload.command)
                let activity = payload.activity
                activity.resourceType = payload.command.resource
                let _response = DataStore.invokeCommand({
                    method   : 'POST',
                    resource : 'activities',
                    payload  : activity
                })
                if ('POST' === payload.command.method) {
                    let links = payload.command.payload['_links'],
                        item  = links['self'].href
                    links['_parent'] = activity['_links']['self']
                    DataStore.invokeCommand({
                        method   : 'PATCH',
                        resource : item,
                        payload  : { '_links': links }
                    })
                }
                DataStore.emit('change')
                DataStore.emit('customer-activity-register')
                let notification = payload.notification
                if (notification) {
                    DataStore.emit('notification', notification)
                } else {
                    DataStore.emit('notification', {
                        message : 'The customer activity was successfully registered.',
                        level   : 'success'
                    })
                }
                break
            }
        case 'customer-partial-registration':
            {
                let response = DataStore.invokeCommand({
                    method   : 'POST',
                    resource : 'tasks',
                    payload  : payload.task
                })
                if (!payload.customer.hasOwnProperty('_links'))
                    payload.customer['_links'] = {}
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('_links') && response.data['_links'].hasOwnProperty('self')) {
                    payload.customer['_links']['task'] = response.data['_links']['self']
                } else if (response.hasOwnProperty('command') && response.command.hasOwnProperty('up') && response.command.up.hasOwnProperty('task')) {
                    payload.customer['_links']['task'] = { href: response.command.up['task'] }
                }
                let _response = DataStore.invokeCommand({
                    method   : 'POST',
                    resource : 'registrations',
                    payload  : payload.customer
                })
                DataStore.emit('change')
                let notification = payload.notification
                if (notification) {
                    DataStore.emit('notification', notification)
                } else {
                    DataStore.emit('notification', {
                        message : 'The registered customer is pending review.',
                        level   : 'success'
                    })
                }
                break
            }
        default:
            break
    }
})

module.exports = AppDispatcher
