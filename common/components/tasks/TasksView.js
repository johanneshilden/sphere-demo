import Bootstrap              from 'react-bootstrap'
import React                  from 'react'
import TimeAgo                from 'react-timeago'

import ConfirmCloseTaskModal  from './ConfirmCloseTaskModal'
import DataStore              from '../../store/DataStore'
import TaskDueComponent       from './TasksDueComponent'

import {Glyphicon, Button, Table} from 'react-bootstrap'

const TasksView = React.createClass({
    getInitialState: function() {
        return {
            modalVisible : false
        }
    },
    confirmCloseTask: function() {
        this.setState({modalVisible: true})
    },
    closeModal: function() {
        this.setState({modalVisible: false})
    },
    render: function() {
        let task = this.props.task
        if (!task) {
            return <span>Error: Invalid or missing record.</span>
        }
        let date = new Date(Number(task.due))
        return (
            <div>
                <ConfirmCloseTaskModal
                  show   = {this.state.modalVisible}
                  taskId = {task.id}
                  close  = {this.closeModal} />
                <Table striped bordered fill>
                    <col width='130' />
                    <col />
                    <tbody>
                        <tr>
                            <td><b>Created</b></td>
                            <td>
                                <TimeAgo 
                                  date      = {Number(task.created)}
                                  formatter = {DataStore.timeFormatter} />
                            </td>
                        </tr>
                        <tr>
                            <td><b>Due</b></td>
                            <td>
                                <TaskDueComponent rowData={{due: task.due}} />
                            </td>
                        </tr>
                        <tr>
                            <td><b>Description</b></td>
                            <td>{task.description}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2}>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
                <div>
                    <Button 
                      onClick={this.confirmCloseTask} 
                      block>
                        <Glyphicon glyph='ok' />
                        Close
                    </Button>
                </div>
            </div>
        )
    }
})

module.exports = TasksView
