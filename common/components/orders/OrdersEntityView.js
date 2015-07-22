var Bootstrap                        = require('react-bootstrap');
var Griddle                          = require('griddle-react');
var React                            = require('react');
var TimeAgo                          = require('react-timeago');
var DataStore                        = require('../../store/DataStore');

var Modal                            = Bootstrap.Modal;
var Panel                            = Bootstrap.Panel;
var TabPane                          = Bootstrap.TabPane;
var TabbedArea                       = Bootstrap.TabbedArea;
var Table                            = Bootstrap.Table;

var OrdersEntityView = React.createClass({
    render: function() {
        var order = this.props.order;
        if (!order) {
            return <span>Error: Invalid or missing record.</span>;
        }
        var products = <span />,
            i = 0;
        if (order.products) {
            var items = 
                order.products.map(function(item) {
                    return (
                        <tr key={i++}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                        </tr>
                    );
                });
            if (items.length) {
                products = (
                    <div>
                        <h4>Products</h4>
                        <Table striped bordered fill>
                            <thead>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={2}>
                                        <b>Order total:</b>
                                    </td>
                                    <td>
                                        {order.total}
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                );
            }
        }
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
                                  date={Number(order.created)} 
                                  formatter={DataStore.timeFormatter} />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {products}
            </div>
        );
    }
});
 
module.exports = OrdersEntityView;
