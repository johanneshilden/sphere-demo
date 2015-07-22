var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var DataStore           = require('../../store/DataStore');
var BootstrapPager      = require('../BootstrapPager');

var Panel               = Bootstrap.Panel;
var TabPane             = Bootstrap.TabPane;
var TabbedArea          = Bootstrap.TabbedArea;

var StockView = React.createClass({
    getInitialState: function() {
        return {
            activeKey: 1
        };
    },
    handleSelect: function(key) {
        this.setState({key: key});
    },
    render: function() {
        var stockMetadata = [
            {
                'columnName': 'product', 
                'displayName': 'Product',
                'customComponent': React.createClass({
                    render: function() {
                        var product = this.props.rowData['_embedded'].product;
                        return (
                            <span>{product.name}</span>
                        );
                    }
                })
            }, 
            {'columnName': 'actual', 'displayName': 'Actual qty.'}, 
            {'columnName': 'available', 'displayName': 'Available qty.'}
        ];
        var activityMetadata = [
            { 'columnName': 'action', 'displayName': 'Action' },
            { 'columnName': 'productName', 'displayName': 'Product' },
            { 'columnName': 'type', 'displayName': 'Quantity changed' },
            { 'columnName': 'quantity', 'displayName': 'Change' }
        ];
        return (
            <Panel 
              className='panel-fill'
              bsStyle='primary'
              header='Stock'>
                <TabbedArea fill 
                  animation={false}
                  activeKey={this.state.key} 
                  onSelect={this.handleSelect}>
                    <TabPane eventKey={1} tab='Summary'>
                        <Panel>
                            <Griddle 
                              results={this.props.stock} 
                              showFilter={true}
                              resultsPerPage={8}
                              useGriddleStyles={false}
                              useCustomPagerComponent={true}
                              customPagerComponent={BootstrapPager}
                              columnMetadata={stockMetadata}
                              tableClassName='table table-bordered table-select' 
                              columns={['product', 'actual', 'available']} />
                        </Panel>
                    </TabPane>
                    <TabPane eventKey={2} tab='Activity'>
                        <Panel>
                            <Griddle 
                              results={this.props.activity} 
                              showFilter={true}
                              resultsPerPage={8}
                              useGriddleStyles={false}
                              columnMetadata={activityMetadata}
                              useCustomPagerComponent={true}
                              customPagerComponent={BootstrapPager}
                              columnMetadata={activityMetadata}
                              tableClassName='table table-bordered table-select' 
                              columns={['action', 'productName', 'type', 'quantity']} />
                        </Panel>
                    </TabPane>
                </TabbedArea>
            </Panel>
        );
    }
});

module.exports = StockView;
