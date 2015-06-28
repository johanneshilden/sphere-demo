var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../store/DataStore');

var Panel     = Bootstrap.Panel;

var ProductsView = React.createClass({
    fetchProducts: function() {
        var data = DataStore.fetchCollection('products');
        this.setState({data: data});
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    componentDidMount: function() {
        this.fetchProducts();
        DataStore.on('change', this.fetchProducts);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchProducts);
    },
    render: function() {
        var title = <h4>Products</h4>;
        var metadata = [
            {"columnName": "sku", "displayName": "SKU"}, 
            {"columnName": "name", "displayName": "Name"}, 
            {"columnName": "unitSize", "displayName": "Unit size"}
        ];
        return (
            <Panel header={title}>
                <Griddle 
                    results={this.state.data} 
                    showFilter={true}
                    resultsPerPage="20"
                    useGriddleStyles={false}
                    columnMetadata={metadata}
                    tableClassName="table table-bordered" 
                    columns={["sku", "name", "unitSize"]} />
            </Panel>
        );
    }
});

module.exports = ProductsView;
