var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var BootstrapPager      = require('../BootstrapPager');

var Panel               = Bootstrap.Panel;

var ProductsView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage: 8
        };
    },
    render: function() {
        var metadata = [
            {'columnName': 'sku', 'displayName': 'SKU'}, 
            {'columnName': 'name', 'displayName': 'Name'}, 
            {'columnName': 'unitSize', 'displayName': 'Unit size'}
        ];
        return (
            <Panel 
              bsStyle='primary'
              header='Products'>
                <Griddle 
                  results={this.props.products} 
                  showFilter={true}
                  resultsPerPage={this.props.resultsPerPage}
                  useGriddleStyles={false}
                  columnMetadata={metadata}
                  onRowClick={function(row) { window.location.hash = row.props.data.href; }}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  tableClassName='table table-bordered table-select' 
                  columns={['sku', 'name', 'unitSize']} />
            </Panel>
        );
    }
});

module.exports = ProductsView;
