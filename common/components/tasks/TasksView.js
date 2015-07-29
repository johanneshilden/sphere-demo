import Bootstrap               from 'react-bootstrap'
import Griddle                 from 'griddle-react'
import React                   from 'react'
import TimeAgo                 from 'react-timeago'

import AppDispatcher           from '../../dispatcher/AppDispatcher'
import BootstrapPager          from '../BootstrapPager'
import ConfirmCloseTaskModal   from './ConfirmCloseTaskModal'
import DataStore               from '../../store/DataStore'
import TaskDueComponent        from './TasksDueComponent'

import {Label, Button, Modal, Panel} from 'react-bootstrap'

const TasksView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage : 8
        }
    },
    getInitialState: function() {
        return {
            taskId : null
        }
    },
    confirmCloseTask: function(task) {
        this.setState({
            taskId : task.id
        })
    },
    closeModal: function() {
        this.setState({taskId: null})
    },
    render: function() {
        var self = this
        const metadata = [
            {
                'columnName'      : 'created',
                'displayName'     : 'Created',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <TimeAgo 
                              date      = {Number(this.props.rowData.created)}
                              formatter = {DataStore.timeFormatter} />
                        )
                    }
                })
            }, 
            {
                'columnName'      : 'due',
                'displayName'     : 'Due',
                'customComponent' : TaskDueComponent 
            }, 
            {
                'columnName'  : 'description', 
                'displayName' : 'Description'
            },
            {
                'columnName'      : 'actions',
                'displayName'     : '',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <Button 
                              onClick = {() => self.confirmCloseTask(this.props.rowData)}
                              bsSize  = 'xsmall'
                              block>
                                <Bootstrap.Glyphicon glyph='ok' />
                                Close
                            </Button>
                        )
                    }
                })
            }
        ]

        const rowMetaData = {
          'bodyCssClassName': function(data) {
                let now     = new Date(),
                    dueDate = new Date(data.due)
                if (now.setHours(0,0,0,0) == dueDate.setHours(0,0,0,0)) {
                    return 'task-due-today'
                } else if (now > dueDate) {
                    return 'task-overdue'
                } 
            }
        }

        const columns = ['created', 'due', 'description', 'actions']

        return (
            <div>
                <ConfirmCloseTaskModal
                  show   = {!!this.state.taskId}
                  taskId = {this.state.taskId}
                  close  = {this.closeModal} />
                <Griddle 
                  results                 = {this.props.tasks}
                  resultsPerPage          = {this.props.resultsPerPage}
                  rowMetadata             = {rowMetaData}
                  useGriddleStyles        = {false}
                  columnMetadata          = {metadata}
                  useCustomPagerComponent = {true}
                  customPagerComponent    = {BootstrapPager}
                  tableClassName          = 'table table-bordered table-select'
                  columns                 = {columns} />
            </div>
        )
    }
})

module.exports = TasksView
