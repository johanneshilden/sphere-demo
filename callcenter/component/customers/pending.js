var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../../store/DataStore');

var Panel     = Bootstrap.Panel;

var PendingRegistrationsView = React.createClass({
    fetchRegistrations: function() {
        if (this.isMounted()) {
            var data = DataStore.fetchCollection('registrations');
            this.setState({data: data});
        }
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    componentDidMount: function() {
        this.fetchRegistrations();
        DataStore.on('change', this.fetchRegistrations);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchRegistrations);
    },
    render: function() {
        var metadata = [
            {
                "columnName": "_local", 
                "displayName": "Local",
                "customComponent": React.createClass({
                    render: function() {
                        if (this.props.rowData._local)
                            return (
                                <span className="glyphicon glyphicon-flag"></span>
                            );
                        else
                            return (
                                <span />
                            );
                    }
                })
            }, 
            {"columnName": "name", "displayName": "Name"}, 
            {"columnName": "address", "displayName": "Address"}, 
            {"columnName": "phone", "displayName": "Phone number"}, 
            {"columnName": "area", "displayName": "Area"},
            {"columnName": "priceCategory", "displayName": "Price category"}
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
                    columns={["_local", "name", "address", "phone", "area", "priceCategory"]} />
            </Panel>
        );
    }
});

module.exports = PendingRegistrationsView;
