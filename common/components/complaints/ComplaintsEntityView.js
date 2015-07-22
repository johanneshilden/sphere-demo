var Bootstrap                        = require('react-bootstrap');
var Griddle                          = require('griddle-react');
var React                            = require('react');
var TimeAgo                          = require('react-timeago');
var DataStore                        = require('../../store/DataStore');
var AppDispatcher                    = require('../../dispatcher/AppDispatcher');

var Panel                            = Bootstrap.Panel;
var TabPane                          = Bootstrap.TabPane;
var TabbedArea                       = Bootstrap.TabbedArea;
var Button                           = Bootstrap.Button;
var Table                            = Bootstrap.Table;
var Modal                            = Bootstrap.Modal;

var ComplaintsEntityView = React.createClass({
    resolve: function() {
        var patch = {
            resolved: Date.now()
        };
        var complaint = this.props.complaint;
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method   : 'PATCH',
                resource : complaint['_links']['self'].href,
                payload  : patch
            },
            activity   : {
                'type'     : 'complaint-resolve',
                'activity' : '',
                'created'  : Date.now(),
                '_links'   : {
                    '_collection' : complaint['_links']['customer']
                }
            }, 
            notification : {
                message : 'The complaint was successfully resolved.',
                level   : 'success'
            }
        });
    },
    render: function() {
        var complaint = this.props.complaint;
        if (!complaint) {
            return <span>Error: Invalid or missing record.</span>;
        }
        var description = null;
        if (complaint.description) {
            description = (
                <tr>
                    <td><b>Description</b></td>
                    <td>{complaint.description}</td>
                </tr>
            );
        }
        var products = <span />
            i = 0;
        if (complaint.products) {
            var items = 
                complaint.products.map(function(item) {
                    return (
                        <tr key={i++}>
                            <td>{item.product.name}</td>
                            <td>{item.batch}</td>
                            <td>{item.quantity}</td>
                            <td>{item.comment}</td>
                        </tr>
                    );
                });
            if (items.length) {
                products = (
                    <div>
                        <h4>Products</h4>
                        <Table striped bordered fill>
                            <thead>
                                <th>Product name</th>
                                <th>Batch</th>
                                <th>Quantity</th>
                                <th>Comment</th>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                        </Table>
                    </div>
                );
            }
        }
        var cmplStatus = (
            <span>
                Unresolved
            </span>
        );
        var resolve = <span />;
        if (complaint.resolved) {
            cmplStatus = (
                <span>Resolved&nbsp;
                    <TimeAgo 
                      date={Number(complaint.resolved)} 
                      formatter={DataStore.timeFormatter} />
                </span>
            );
        } else {
            resolve = (
                <div>
                    <Button 
                      onClick={this.resolve} 
                      block>
                        <Bootstrap.Glyphicon
                          glyph='ok' />
                        Resolve
                    </Button>
                </div>
            );
        }
        return (
            <div>
                <Table striped bordered fill>
                    <col width={130} />
                    <col />
                    <tbody>
                        <tr>
                            <td><b>Customer</b></td>
                            <td>{complaint.customer.name}</td>
                        </tr>
                        <tr>
                            <td><b>Type</b></td>
                            <td>{'quality' === complaint.type ? 'Quality' : 'Service'}</td>
                        </tr>
                        <tr>
                            <td><b>Created</b></td>
                            <td>
                                <TimeAgo 
                                  date={Number(complaint.created)} 
                                  formatter={DataStore.timeFormatter} />
                            </td>
                        </tr>
                        <tr>
                            <td><b>Status</b></td>
                            <td>{cmplStatus}</td>
                        </tr>
                        {description}
                    </tbody>
                </Table>
                {products}
                {resolve}
            </div>
        );
    }
});

module.exports = ComplaintsEntityView;
