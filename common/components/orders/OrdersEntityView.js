import Bootstrap                        from 'react-bootstrap'
import Griddle                          from 'griddle-react'
import React                            from 'react'
import TimeAgo                          from 'react-timeago'
import DataStore                        from '../../store/DataStore'

import {Modal, Panel, TabPane, TabbedArea, Table} from 'react-bootstrap'

const OrdersEntityView = React.createClass({
    render: function() {
        let order = this.props.order
        if (!order || !order.items) {
            return (
                <span>Error: Invalid or missing record.</span>
            )
        }
        let i = 0
        let items = order.items.map(item => {
            return (
                <tr key={i++}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.itemPrice}</td>
                    <td>{item.price}</td>
                </tr>
            )
        })
        return (
            <div>
                <Table striped bordered fill>
                    <col width={130} />
                    <col />
                    <tbody>
                        <tr>
                            <td><b>Customer</b></td>
                            <td>{order.customerName}</td>
                        </tr>
                        <tr>
                            <td><b>Created</b></td>
                            <td>
                                <TimeAgo 
                                  date      = {Number(order.created)} 
                                  formatter = {DataStore.timeFormatter} />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table striped bordered fill>
                    <thead>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Item price</th>
                        <th>Price</th>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>
                                <b>Order total:</b>
                            </td>
                            <td>
                                {order.total}
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        )
    }
})
 
module.exports = OrdersEntityView
