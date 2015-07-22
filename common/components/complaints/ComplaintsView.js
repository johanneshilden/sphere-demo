var Bootstrap            = require('react-bootstrap');
var Griddle              = require('griddle-react');
var React                = require('react');
var TimeAgo              = require('react-timeago');
var DataStore            = require('../../store/DataStore');
var AppDispatcher        = require('../../dispatcher/AppDispatcher');
var ComplaintsEntityView = require('./ComplaintsEntityView');
var BootstrapPager       = require('../BootstrapPager');

var Panel                = Bootstrap.Panel;
var Modal                = Bootstrap.Modal;
var Button               = Bootstrap.Button;
var Table                = Bootstrap.Table;

var ComplaintsView = React.createClass({
    getInitialState: function() {
        return {
            collapsed    : window.innverWidth < 769,
            modalVisible : false,
            complaint    : null,
            complaintId  : null
        };
    },
    getDefaultProps: function() {
        return {
            showCustomer: true
        }
    },
    handleResize: function(e) {
        var innerWidth = window.innerWidth,
            oldVal = this.state.collapsed,
            newVal = innerWidth < 769;
        if (oldVal != newVal)
            this.setState({collapsed: newVal});
    },
    viewComplaint: function(row) {
        var complaintId = row.props.data['_links']['self'].href;
        this.fetchComplaint(complaintId);
        this.setState({
            modalVisible : true,
            complaintId  : complaintId
        });
    },
    fetchComplaint: function(_id) {
        var complaintId = _id || this.state.complaintId;
        if (!complaintId)
            return;
        var complaint = DataStore.getItem(complaintId);
        if (complaint && complaint.hasOwnProperty('_embedded')) {
            if (complaint['_embedded'].hasOwnProperty('items')) {
                for (var i = 0; i < complaint['_embedded']['items'].length; i++) {
                    var item = complaint['_embedded']['items'][i];
                    DataStore.store.embed(item, 'product');
                    item.product = item['_embedded']['product'];
                }
            }
            complaint.products = complaint['_embedded']['items'];
            complaint.customer = complaint['_embedded']['customer'];
        }
        this.setState({
            complaint: complaint
        });
    },
    closeModal: function() {
        this.setState({modalVisible: false});
    },
    componentDidMount: function() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        DataStore.on('change', this.fetchComplaint);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
        DataStore.removeListener('change', this.fetchComplaint);
    },
    renderModal: function() {
        if (!this.state.modalVisible)
            return <span />;
        return (
            <Modal 
              onHide={this.closeModal}>
                <Modal.Header 
                  closeButton 
                  onHide={this.closeModal}>
                    <Modal.Title>
                        Complaint details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ComplaintsEntityView complaint={this.state.complaint} />
                </Modal.Body>
            </Modal>
        );
    },
    render: function() {
        var metadata = [
            {
                'columnName': 'customer', 
                'displayName': 'Customer',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <span>{this.props.rowData.customer.name}</span>
                        );
                    }
                })
            },
            {
                'columnName': 'created', 
                'displayName': 'Created',
                'customComponent': React.createClass({
                    render: function() {
                        var created = this.props.rowData.created;
                        return (
                            <TimeAgo 
                              date={Number(created)} 
                              formatter={DataStore.timeFormatter} />
                        );
                    }
                })
            },
            {
                'columnName': 'type', 
                'displayName': 'Type',
                'customComponent': React.createClass({
                    render: function() {
                        var type = 'quality' === this.props.rowData.type ? 'Quality' : 'Service';
                        return (
                            <span>{type}</span>
                        );
                    }
                })
            },
            {
                'columnName': 'resolved', 
                'displayName': 'Resolved',
                'customComponent': React.createClass({
                    render: function() {
                        var resolved = this.props.rowData.resolved;
                        if (!resolved) {
                            return (
                                <span>
                                    <Bootstrap.Glyphicon
                                      style={{marginRight: '.3em'}}
                                      glyph='exclamation-sign' />
                                    Unresolved
                                </span>
                            )
                        }
                        return (
                            <TimeAgo 
                              date={Number(resolved)} 
                              formatter={DataStore.timeFormatter} />
                        );
                    }
                })
            },
            {
                'columnName': 'description', 
                'displayName': 'Description',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <span>{this.props.rowData.description}</span>
                        );
                    }
                })
            },
        ];
        var columns = this.state.collapsed
            ? ['created', 'type', 'resolved']
            : ['created', 'type', 'description', 'resolved'];
        if (true === this.props.showCustomer) {
            columns.unshift('customer');
        }
        return (
            <div>
                {this.renderModal()}
                <Griddle 
                  results={this.props.complaints} 
                  showFilter={true}
                  resultsPerPage={20}
                  initialSort='created'
                  initialSortAscending={false}
                  useGriddleStyles={false}
                  rowDecorator={ function(data) { return data.resolved ? '' : 'unresolved' } }
                  columnMetadata={metadata}
                  onRowClick={this.viewComplaint}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  tableClassName='table table-bordered table-select' 
                  columns={columns} />
            </div>
        );
    }
});

module.exports = ComplaintsView;
