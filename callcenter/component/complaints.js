var Bootstrap                = require('react-bootstrap');
var Griddle                  = require('griddle-react');
var React                    = require('react');
var TimeAgo                  = require('react-timeago');
var DataStore                = require('../store/DataStore');
var AppDispatcher            = require('../dispatcher/AppDispatcher');

var Modal                    = Bootstrap.Modal;
var ModalBody                = Bootstrap.Modal.Body;
var ModalHeader              = Bootstrap.Modal.Header;
var ModalTitle               = Bootstrap.Modal.Title;
var Panel                    = Bootstrap.Panel;
var Table                    = Bootstrap.Table;
var Button                   = Bootstrap.Button;

function timeFormatter(value, unit, suffix) {
    if ('second' == unit) {
        return 'less than a minute ago';
    }
    if (value !== 1) {
        unit += 's';
    }
    return value + ' ' + unit + ' ' + suffix;
}

var ComplaintsEntityView = React.createClass({
    getInitialState: function() {
        return {
            complaint: null
        };
    },
    fetchComplaint: function() {
        var complaint = DataStore.store.getItem(this.props.complaintId);
        complaint.customer = complaint['_embedded'].customer;
        var items = [],
            embedded = complaint['_embedded'].items;
        if (embedded) {
            for (var i = 0; i < embedded.length; i++) {
                var item = embedded[i];
                if (item.hasOwnProperty('_links') && item['_links'].hasOwnProperty('product')) {
                    var product = DataStore.store.getItem(item['_links'].product.href);
                    if (product) {
                        item.product = product;
                        items.push(item);
                    }
                }
            }
        }
        complaint.products = items;
        this.setState({
            complaint: complaint
        });
    },
    handleClose: function() {
        this.props.handleClose();
    },
    resolve: function(complaintId) {
        AppDispatcher.dispatch({
            actionType  : 'complaint-resolve',
            complaintId : complaintId
        });
    },
    componentDidMount: function() {
        DataStore.on('change', this.fetchComplaint);
        this.fetchComplaint();
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaint);
    },
    render: function() {
        var complaint = this.state.complaint;
        if (!complaint) {
            return <span>Error: Invalid record.</span>;
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
        var products = <span />;
        if (complaint.products) {
            var items = 
                complaint.products.map(function(item) {
                    return (
                        <tr key={item.product['_links']['self'].href}>
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
        var cmplStatus = <span>Unresolved</span>;
        var resolve = <span />;
        if (complaint.resolved) {
            cmplStatus = (
                <span>Resolved&nbsp;
                    <TimeAgo date={Number(complaint.resolved)} 
                        formatter={timeFormatter} />
                </span>
            );
        } else {
            resolve = (
                <Modal.Footer>
                    <Button onClick={this.resolve.bind(null, complaint['_links']['self'].href)} block>Resolve</Button>
                </Modal.Footer>
            );
        }
        return (
            <div>
                <Modal.Header closeButton onHide={this.handleClose}>
                    <Modal.Title>
                        Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered fill>
                        <col width="130" />
                        <col />
                        <tbody>
                            <tr>
                                <td><b>Customer</b></td>
                                <td>{complaint.customer.name}</td>
                            </tr>
                            <tr>
                                <td><b>Type</b></td>
                                <td>{complaint.type}</td>
                            </tr>
                            <tr>
                                <td><b>Created</b></td>
                                <td>
                                    <TimeAgo date={Number(complaint.created)} 
                                        formatter={timeFormatter} />
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
                </Modal.Body>
                {resolve}
            </div>
        );
    }
});

var ComplaintsView = React.createClass({
    fetchComplaints: function() {
        if (this.isMounted()) {
            var data = DataStore.fetchCollection('complaints');
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                data[i].customer = {"name": "-"};
                if (item.hasOwnProperty('_embedded') && item['_embedded'].hasOwnProperty('customer'))
                    data[i].customer = item['_embedded']['customer'];
            }
            this.setState({data: data});
        }
    },
    getInitialState: function() {
        return {
            data              : [],
            showModal         : false,
            selectedComplaint : null,
            collapsed         : window.innverWidth < 769
        }
    },
    handleResize: function(e) {
        var innerWidth = window.innerWidth,
            oldVal = this.state.collapsed,
            newVal = innerWidth < 769;
        if (oldVal != newVal)
            this.setState({collapsed: newVal});
    },
    componentDidMount: function() {
        this.fetchComplaints();
        DataStore.on('change', this.fetchComplaints);
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaints);
        window.removeEventListener('resize', this.handleResize);
    },
    closeModal: function() {
        this.setState({showModal: false});
    },
    render: function() {
        var self = this;
        var columns = this.state.collapsed
            ? ["customer", "created", "type", "resolved", "actions"]
            : ["customer", "created", "type", "description", "resolved", "actions"];
        var metadata = [
            {
                "columnName": "customer", 
                "displayName": "Customer",
                "customComponent": React.createClass({
                    render: function() {
                        return (
                            <span>{this.props.rowData.customer.name}</span>
                        );
                    }
                })
            }, 
            {
                "columnName": "created", 
                "displayName": "Created",
                "customComponent": React.createClass({
                    render: function() {
                        var created = this.props.rowData.created;
                        return (
                            <TimeAgo 
                                date={Number(created)} 
                                formatter={timeFormatter} />
                        );
                    }
                })
            }, 
            {"columnName": "type", "displayName": "Complaint type"},
            {"columnName": "description", "displayName": "Description"},
            {
                "columnName": "resolved", 
                "displayName": "Status",
                "customComponent": React.createClass({
                    render: function() {
                        var resolved = this.props.rowData.resolved;
                        if (!resolved)
                            return (
                                <span>Unresolved</span>
                            );
                        return (
                            <span>Resolved&nbsp;
                                <TimeAgo 
                                    date={Number(resolved)} 
                                    formatter={timeFormatter} />
                            </span>
                        );
                       
                    }
                })
            },
            {
                "columnName": "actions", 
                "displayName": "",
                "customComponent": React.createClass({
                    viewComplaint: function(complaint) {
                        self.setState({
                            selectedComplaint: complaint,
                            showModal: true
                        });
                    },
                    render: function() {
                        var links = this.props.rowData['_links'],
                            href  = links ? links.self.href : null;
                        return (
                            <span>
                                <a onClick={this.viewComplaint.bind(null, href)} href="javascript:">View</a>
                            </span>
                        );
                    }
                })
            }
        ];
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <ComplaintsEntityView 
                        handleClose={this.closeModal}
                        complaintId={this.state.selectedComplaint} />
                </Modal>
                <Panel header="Complaints">
                    <Griddle 
                        results={this.state.data} 
                        tableClassName="table table-bordered" 
                        showFilter={true}
                        initialSort="created"
                        initialSortAscending={false}
                        resultsPerPage="20"
                        useGriddleStyles={false}
                        columnMetadata={metadata}
                        columns={columns} />
                </Panel>
            </div>
        );
    }
});

module.exports = ComplaintsView;
