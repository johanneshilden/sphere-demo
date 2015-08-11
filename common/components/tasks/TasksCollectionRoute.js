import React                from 'react'

import DataStore            from '../../store/DataStore'
import TasksCollection      from './TasksCollection'

import {Panel} from 'react-bootstrap'

const TasksCollectionRoute = React.createClass({
    fetchTasks: function() {
        var tasks = DataStore.fetchCollection('tasks')
        this.setState({tasks: tasks})
    },
    getInitialState: function() {
        return {
            tasks : []
        }
    },
    componentDidMount: function() {
        this.fetchTasks()
        DataStore.on('change', this.fetchTasks)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTasks)
    },
    render: function() {
        return (
            <Panel 
              bsStyle = 'primary'
              header  = 'Tasks'>
                <TasksCollection tasks={this.state.tasks} />
            </Panel>
        )
    }
})

module.exports = TasksCollectionRoute
