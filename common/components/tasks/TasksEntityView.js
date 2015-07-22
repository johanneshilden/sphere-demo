var Bootstrap                        = require('react-bootstrap');
var Griddle                          = require('griddle-react');
var React                            = require('react');
var TimeAgo                          = require('react-timeago');
var AppDispatcher                    = require('../../dispatcher/AppDispatcher');
var DataStore                        = require('../../store/DataStore');
var ConfirmCloseTaskModal            = require('./ConfirmCloseTaskModal');

var Button                           = Bootstrap.Button;
var Modal                            = Bootstrap.Modal;
var Panel                            = Bootstrap.Panel;
var TabPane                          = Bootstrap.TabPane;
var TabbedArea                       = Bootstrap.TabbedArea;
var Table                            = Bootstrap.Table;

var TasksEntityView = React.createClass({
    getInitialState: function() {
        return {
            modalVisible: false
        };
    },
    confirmCloseTask: function() {
        this.setState({modalVisible: true});
    },
    closeModal: function() {
        this.setState({modalVisible: false});
    },
    render: function() {
        var task = this.props.task;
        if (!task) {
            return <span>Error: Invalid or missing record.</span>;
        }
        var date = new Date(Number(task.due));
        var taskHref = task['_links']['self'].href;
        return (
            <div>
                <ConfirmCloseTaskModal
                  show={this.state.modalVisible}
                  taskId={taskHref}
                  close={this.closeModal} />
                <Table striped bordered fill>
                    <col width={130} />
                    <col />
                    <tbody>
                        <tr>
                            <td><b>Created</b></td>
                            <td>
                                <TimeAgo 
                                  date={Number(task.created)} 
                                  formatter={DataStore.timeFormatter} />
                            </td>
                        </tr>
                        <tr>
                            <td><b>Due</b></td>
                            <td><span>{date.toDateString()}</span></td>
                        </tr>
                        <tr>
                            <td><b>Description</b></td>
                            <td>{task.description}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2}>
                                <Button 
                                  onClick={this.confirmCloseTask} 
                                  block>
                                    <Bootstrap.Glyphicon
                                      glyph='ok' />
                                    Close
                                </Button>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        );
    }
});
 
module.exports = TasksEntityView;
