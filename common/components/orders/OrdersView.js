var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var TimeAgo             = require('react-timeago');
var DataStore           = require('../../store/DataStore');
var BootstrapPager      = require('../BootstrapPager');
var OrdersEntityView    = require('./OrdersEntityView');

var Panel               = Bootstrap.Panel;
var TabPane             = Bootstrap.TabPane;
var TabbedArea          = Bootstrap.TabbedArea;
var Modal               = Bootstrap.Modal;

var OrdersView = React.createClass({
    getInitialState: function() {
        return {
            modalVisible : false,
            order        : null
        };
    },
    getDefaultProps: function() {
        return {
            resultsPerPage: 8
        };
    },
    closeModal: function() {
        this.setState({modalVisible: false});
    },
    viewOrder: function(row) {
        var order = DataStore.getItem(row.props.data['_links']['self'].href);
        if (order && order.hasOwnProperty('_embedded')) {
            order.products = order['_embedded'].items;
        }
        this.setState({
            modalVisible : true,
            order        : order
        });
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
                        Order details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OrdersEntityView order={this.state.order} />
                </Modal.Body>
            </Modal>
        );
    },
    render: function() {
        var metadata = [
            {'columnName': 'customerName', 'displayName': 'Customer'},
            {
                'columnName': 'created', 
                'displayName': 'Created',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <TimeAgo date={Number(this.props.rowData.created)} 
                              formatter={DataStore.timeFormatter} />
                        );
                    }
                })
            },
            {'columnName': 'total', 'displayName': 'Order total'}
        ];
        return (
            <div>
                {this.renderModal()}
                <Griddle 
                  results={this.props.orders} 
                  showFilter={true}
                  resultsPerPage={this.props.resultsPerPage}
                  columnMetadata={metadata}
                  useGriddleStyles={false}
                  onRowClick={this.viewOrder}
                  initialSort='created'
                  initialSortAscending={false}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  tableClassName='table table-bordered table-select' 
                  columns={['customerName', 'created', 'total']} />
            </div>
        );
    }
});

module.exports = OrdersView;
