var Bootstrap             = require('react-bootstrap');
var Griddle               = require('griddle-react');
var React                 = require('react');
var TimeAgo               = require('react-timeago');
var DataStore             = require('../../store/DataStore');
var AppDispatcher         = require('../../dispatcher/AppDispatcher');
var ConfirmCloseTaskModal = require('./ConfirmCloseTaskModal');
var BootstrapPager        = require('../BootstrapPager');

var Button                = Bootstrap.Button;
var Modal                 = Bootstrap.Modal;
var Panel                 = Bootstrap.Panel;

var TasksView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage: 8
        };
    },
    getInitialState: function() {
        return {
            modalVisible: false,
            taskHref: null
        };
    },
    confirmCloseTask: function(task) {
        this.setState({
            modalVisible: true,
            taskHref: task
        });
    },
    closeModal: function() {
        this.setState({modalVisible: false});
    },
    render: function() {
        var self = this;
        var metadata = [
            {
                'columnName': 'created', 
                'displayName': 'Created',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <TimeAgo 
                              date={Number(this.props.rowData.created)} 
                              formatter={DataStore.timeFormatter} />
                        );
                    }
                })
            }, 
            {
                'columnName': 'due', 
                'displayName': 'Due',
                'customComponent': React.createClass({
                    render: function() {
                        var date = new Date(Number(this.props.rowData.due));
                        return (
                            <span>{date.toDateString()}</span>
                        );
                    }
                })
            }, 
            {'columnName': 'description', 'displayName': 'Description'},
            {
                'columnName': 'actions', 
                'displayName': '',
                'customComponent': React.createClass({
                    closeTask: function(row) {
                        self.confirmCloseTask(row);
                    },
                    render: function() {
                        return (
                            <Button 
                              onClick={this.closeTask.bind(null, this.props.rowData['href'])} 
                              bsSize='xsmall'
                              block>
                                <Bootstrap.Glyphicon
                                  glyph='ok' />
                                Close
                            </Button>
                        );
                    }
                })
            }
        ];
        return (
            <div>
                <ConfirmCloseTaskModal
                  show={this.state.modalVisible}
                  taskId={this.state.taskHref}
                  close={this.closeModal} />
                <Griddle 
                  results={this.props.tasks} 
                  resultsPerPage={this.props.resultsPerPage}
                  useGriddleStyles={false}
                  columnMetadata={metadata}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  tableClassName='table table-bordered table-select' 
                  columns={['created', 'due', 'description', 'actions']} />
            </div>
        );
    }
});

module.exports = TasksView;
