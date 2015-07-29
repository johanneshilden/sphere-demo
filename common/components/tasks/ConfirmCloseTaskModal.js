import Bootstrap       from 'react-bootstrap'
import React           from 'react'
import TimeAgo         from 'react-timeago'

import AppDispatcher   from '../../dispatcher/AppDispatcher'
import DataStore       from '../../store/DataStore'

import {Button, Modal, Panel, TabPane, TabbedArea, Table} from 'react-bootstrap'

const ConfirmCloseTaskModal = React.createClass({
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
        })
        this.props.close()
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
                        <Bootstrap.Glyphicon 
                          glyph='ok' />
                        Close task
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
})

module.exports = ConfirmCloseTaskModal
