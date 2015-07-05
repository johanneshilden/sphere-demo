var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../../store/DataStore');

var Panel     = Bootstrap.Panel;

var OrdersListView = React.createClass({
    fetchCustomers: function() {
        if (this.isMounted()) {
            var data = DataStore.fetchCollection('orders');
            this.setState({data: data});
        }
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    componentDidMount: function() {
        this.fetchCustomers();
        DataStore.on('change', this.fetchCustomers);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomers);
    },
    render: function() {
        var metadata = [
            {"columnName": "name", "displayName": "Name"}, 
            {"columnName": "address", "displayName": "Address"}, 
            {"columnName": "tin", "displayName": "TIN number"}, 
            {"columnName": "phone", "displayName": "Phone number"}, 
            {"columnName": "area", "displayName": "Area"}, 
            {"columnName": "priceCategory", "displayName": "Price category"}
        ];
        return (
            <Panel header="Orders">
                <Griddle 
                    results={this.state.data} 
                    tableClassName="table table-bordered" 
                    showFilter={true}
                    resultsPerPage="20"
                    useGriddleStyles={false}
                    columnMetadata={metadata}
                    columns={["name", "address", "tin", "phone", "area", "priceCategory"]} />
            </Panel>
        );
    }
});

module.exports = OrdersListView;
