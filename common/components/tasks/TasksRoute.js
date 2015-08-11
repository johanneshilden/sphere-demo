import React                from 'react'

import DataStore            from '../../store/DataStore'
import TasksView            from './TasksView'

import {Panel} from 'react-bootstrap'

const TasksRoute = React.createClass({
    getInitialState: function() {
        return {
            task : null
        }
    },
    fetchTask: function() {
        var task = DataStore.getItem('tasks/' + this.props.params.id)
        this.setState({task: task})
    },
    componentDidMount: function() {
        this.fetchTask()
        DataStore.on('change', this.fetchTask)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTask)
    },
    render: function() {
        return (
            <Panel 
              header  = 'Tasks'
              bsStyle = 'primary'>
                <ol className='breadcrumb'>
                    <li>
                        <a href='#/tasks'>
                            Tasks
                        </a>
                    </li>
                    <li className='active'>
                        View task
                    </li>
                </ol>
                <TasksView task={this.state.task} />
            </Panel>
        )
    }
})

module.exports = TasksRoute
