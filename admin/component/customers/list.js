var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../../store/DataStore');

var Panel     = Bootstrap.Panel;

var CustomersListView = React.createClass({
    fetchCustomers: function() {
        var data = DataStore.fetchCollection('customers');
        this.setState({data: data});
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
            {"columnName": "priceCategory", "displayName": "Price category"},
            {
                "columnName": "active", 
                "displayName": "Status",
                "customComponent": React.createClass({
                    render: function() {
                        return (
                            <span>{true === this.props.rowData.active ? 'Active' : 'Dormant'}</span>
                        );
                    }
                })
            },
            {
                "columnName": "edit", 
                "displayName": "",
                "customComponent": React.createClass({
                    render: function() {
                        return (
                            <a href={'#customers/edit/' + this.props.rowData.key}>Edit</a>
                        );
                    }
                })
            }
        ];
        return (
            <Panel>
                <Griddle 
                    results={this.state.data} 
                    tableClassName="table table-bordered" 
                    showFilter={true}
                    resultsPerPage="20"
                    useGriddleStyles={false}
                    columnMetadata={metadata}
                    columns={["name", "address", "tin", "phone", "area", "priceCategory", "active", "edit"]} />
            </Panel>
        );
    }
});

module.exports = CustomersListView;
