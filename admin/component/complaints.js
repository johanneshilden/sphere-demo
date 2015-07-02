var Bootstrap                = require('react-bootstrap');
var Griddle                  = require('griddle-react');
var React                    = require('react');
var TimeAgo                  = require('react-timeago');
var DataStore                = require('../store/DataStore');

var Panel                    = Bootstrap.Panel;

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
            data: []
        }
    },
    componentDidMount: function() {
        this.fetchComplaints();
        DataStore.on('change', this.fetchComplaints);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaints);
    },
    render: function() {
        var title = <h4>Complaints</h4>;
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
                    timeFormatter: function(value, unit, suffix) {
                        if ('second' == unit) {
                            return 'less than a minute ago';
                        }
                        if (value !== 1) {
                            unit += 's';
                        }
                        return value + ' ' + unit + ' ' + suffix;
                    },
                    render: function() {
                        var created = this.props.rowData.created;
                        return (
                            <TimeAgo 
                                date={Number(created)} 
                                formatter={this.timeFormatter} />
                        );
                    }
                })
            }, 
            {"columnName": "type", "displayName": "Complaint type"},
            {"columnName": "description", "displayName": "Description"}
        ];
        return (
            <Panel header={title}>
                <Griddle 
                    results={this.state.data} 
                    tableClassName="table table-bordered" 
                    showFilter={true}
                    initialSort="created"
                    initialSortAscending={false}
                    resultsPerPage="20"
                    useGriddleStyles={false}
                    columnMetadata={metadata}
                    columns={["customer", "created", "type", "description"]} />
            </Panel>
        );
    }
});

module.exports = ComplaintsView;
