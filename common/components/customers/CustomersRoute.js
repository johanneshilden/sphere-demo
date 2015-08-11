import React                from 'react'

import DataStore            from '../../store/DataStore'
import CustomersView        from './CustomersView'

const CustomersRoute = React.createClass({
    getDefaultProps: function() {
        return {
            allowEdit : false
        }
    },
    getInitialState: function() {
        return {
            customer : null
        }
    },
    fetchCustomer: function() {
        let customer = DataStore.getItem('customers/' + this.props.params.id)
        if (customer) {
            let activities = customer.getEmbedded('activities') || [],
                orders     = customer.getEmbedded('orders')     || [],
                complaints = customer.getEmbedded('complaints') || [],
                tasks      = customer.getEmbedded('tasks')      || []
            this.setState({
                customer   : customer,
                activities : activities.map(item => {
                    if (item.resource) {
                        item._resource = item.getLink(item.resource)
                    }
                    return item
                }),
                orders     : orders.map(order => {
                    order.id = order['_links']['self'].href
                    return order
                }),
                contacts   : customer.getEmbedded('contacts')   || [],
                complaints : complaints.map(complaint => {
                    complaint.id = complaint['_links']['self'].href
                    return complaint
                }),
                tasks      : tasks.map(task => {
                    task.id = task['_links']['self'].href
                    return task
                })
            })
        }
    },
    componentDidMount: function() {
        this.fetchCustomer()
        DataStore.on('change', this.fetchCustomer)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomer)
    },
    render: function() {
        return (
            <CustomersView 
              allowEdit  = {this.props.allowEdit}
              customer   = {this.state.customer}
              orders     = {this.state.orders}
              contacts   = {this.state.contacts}
              complaints = {this.state.complaints}
              tasks      = {this.state.tasks}
              activities = {this.state.activities} />
        )
    }
})

module.exports = CustomersRoute
