var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var TimeAgo             = require('react-timeago');
var DataStore           = require('../../store/DataStore');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');
var BootstrapPager      = require('../BootstrapPager');

var Panel               = Bootstrap.Panel;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Table               = Bootstrap.Table;

var ActivitiesView = React.createClass({
    render: function() {
        var metadata = [
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
            {'columnName': 'type', 'displayName': 'Activity type'},
            {'columnName': 'activity', 'displayName': 'Originated from'},
            {
                'columnName': 'resource', 
                'displayName': 'Resource',
                'customComponent': React.createClass({
                    render: function() {
                        var resource = this.props.rowData.resource;
                        if (!resource)
                            return <span />;
                        return (
                            <span>
                                <a href={'#' + resource}>
                                    {resource}
                                </a>
                            </span>
                        );
                    }
                })
            }
        ];
        return (
            <Griddle
              results={this.props.activities} 
              resultsPerPage={20}
              useGriddleStyles={false}
              columnMetadata={metadata}
              initialSort='created'
              initialSortAscending={false}
              useCustomPagerComponent={true}
              onRowClick={function(row) { 
                  var resource = row.props.data.resource;
                  if (resource) 
                      window.location.hash = resource;
              }}
              customPagerComponent={BootstrapPager}
              columns={['created', 'type', 'activity', 'resource']}
              tableClassName='table table-bordered table-select' />
        );
    }
});

module.exports = ActivitiesView;
