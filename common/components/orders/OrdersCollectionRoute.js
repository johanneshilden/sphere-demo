import React                from 'react'

import DataStore            from '../../store/DataStore'
import OrdersCollection     from './OrdersCollection'

import {Panel} from 'react-bootstrap'

const OrdersCollectionRoute = React.createClass({
    fetchOrders: function() {
        let orders   = DataStore.fetchCollection('orders'),
            rejected = DataStore.fetchCollection('orders-rejected')
        this.setState({
            orders   : orders,
            rejected : rejected
        })
    },
    getInitialState: function() {
        return {
            orders   : [],
            rejected : []
        }
    },
    componentDidMount: function() {
        this.fetchOrders()
        DataStore.on('change', this.fetchOrders)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchOrders)
    },
    render: function() {
        return (
            <OrdersCollection 
              orders   = {this.state.orders} 
              rejected = {this.state.rejected} />
        )
    }
})

module.exports = OrdersCollectionRoute
