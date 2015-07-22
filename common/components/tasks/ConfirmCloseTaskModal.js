var Bootstrap                        = require('react-bootstrap');
var React                            = require('react');
var TimeAgo                          = require('react-timeago');
var AppDispatcher                    = require('../../dispatcher/AppDispatcher');
var DataStore                        = require('../../store/DataStore');

var Button                           = Bootstrap.Button;
var Modal                            = Bootstrap.Modal;
var Panel                            = Bootstrap.Panel;
var TabPane                          = Bootstrap.TabPane;
var TabbedArea                       = Bootstrap.TabbedArea;
var Table                            = Bootstrap.Table;

var ConfirmCloseTaskModal = React.createClass({
    confirmAction: function() {
        AppDispatcher.dispatch({
            actionType : 'command-invoke',
            command    : {
                method   : 'DELETE',
                resource : this.props.taskId
            },
            notification: {
                message : 'The task has been closed.',
                level   : 'success'
            }
        });
        this.props.close();
    },
    render: function() {
        return (
            <Modal
              onHide={this.props.close}
              show={this.props.show}>
                <Modal.Header>
                    <Modal.Title>Confirm action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                      onClick={this.props.close}>
                        Cancel
                    </Button>
                    <Button 
                      bsStyle='danger' 
                      onClick={this.confirmAction}>
                        Close task
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = ConfirmCloseTaskModal;
