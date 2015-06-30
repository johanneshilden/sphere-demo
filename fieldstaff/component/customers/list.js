var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../../store/DataStore');

var Panel     = Bootstrap.Panel;

var CustomersListView = React.createClass({
    fetchCustomers: function() {
        if (this.isMounted()) {
            var data = DataStore.fetchCollection('customers');
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
            {"columnName": "priceCategory", "displayName": "Price category"},
            {
                "columnName": "position", 
                "displayName": "Location",
                "customComponent": React.createClass({
                    render: function() {
                        var position = this.props.rowData.position;
                        if (!position || !position.latitude || !position.longitude) {
                            return (
                                <span>Unknown</span>
                            );
                        }
                        return (
                            <span><a href={'http://maps.google.com/?ie=UTF8&hq=&ll=' + position.latitude + ',' + position.longitude + '&z=16'}>Show</a></span>
                        );
                    }
                })
            },

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
                    columns={["name", "address", "tin", "phone", "area", "priceCategory", "position"]} />
            </Panel>
        );
    }
});

module.exports = CustomersListView;
