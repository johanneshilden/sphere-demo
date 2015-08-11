import React                from 'react'

import DataStore            from '../../store/DataStore'
import OrdersCollection     from './OrdersCollection'

import {Panel} from 'react-bootstrap'

const OrdersCollectionRoute = React.createClass({
    fetchOrders: function() {
        var orders = DataStore.fetchCollection('orders')
        this.setState({orders: orders})
    },
    getInitialState: function() {
        return {
            orders : []
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
            <Panel 
              className = 'panel-fill'
              bsStyle   = 'primary'
              header    = 'Orders'>
                <OrdersCollection orders={this.state.orders} />
            </Panel>
        )
    }
})

module.exports = OrdersCollectionRoute
