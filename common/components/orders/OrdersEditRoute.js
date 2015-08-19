import React                from 'react'

import DataStore            from '../../store/DataStore'
import {OrdersEditForm}     from './OrdersForm'

import {Panel}              from 'react-bootstrap'

const OrdersEditRoute = React.createClass({
    getInitialState: function() {
        return {
            order    : null,
            customer : null
        }
    },
    fetchOrder: function() {
        let order = DataStore.getItem('orders/' + this.props.params.id)
        if (order) {
            order.items.forEach(item => {
                item.product = item['_embedded']['product']
            })
            let orderItems = []
            if (order.items) {
                order.items.forEach(item => {
                    orderItems.push({
                        id  : item['_links']['product'].href,
                        qty : item.quantity
                    })
                })
            }
            this.setState({
                order    : order,
                customer : order.getEmbedded('customer'),
                items    : orderItems
            })
        }
    },
    componentDidMount: function() {
        this.fetchOrder()
        DataStore.on('change', this.fetchOrder)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchOrder)
    },
    render: function() {
        if (!this.state.order || !this.state.customer)
            return (
                <span />
            )
        let customer = this.state.customer
        return (
            <Panel 
              header  = 'Orders'
              bsStyle = 'primary'>
                <ol className='breadcrumb'>
                    <li>
                        <a href='#/customers'>
                            Customers
                        </a>
                    </li>
                    <li>
                        <a href={'#/' + customer.id}>
                            {customer.name}
                        </a>
                    </li>
                    <li className='active'>
                        Edit order
                    </li>
                </ol>
                <OrdersEditForm 
                  order            = {this.state.order} 
                  initialSelection = {this.state.items}
                  customer         = {this.state.customer} />
            </Panel>
        )
    }
})

module.exports = OrdersEditRoute
