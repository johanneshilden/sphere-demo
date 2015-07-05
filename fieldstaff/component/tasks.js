var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../store/DataStore');

var Panel     = Bootstrap.Panel;

var TasksView = React.createClass({
    getInitialState: function() {
        return {
            tasks: {
                registrations: [],
                count: 0
            }
        };
    },
    componentDidMount: function() {
        var tasks = DataStore.fetchTasks();
        this.setState({
            tasks: tasks
        });
    },
    render: function() {
        var registrations = <span />,
            count = this.state.tasks.registrations.length;
        if (count) {
            registrations = (
                <a href="#registrations" className="list-group-item">
                    You have <b>{count} new customer registration{count > 1 ? 's' : ''}</b> awaiting review.
                </a>
            );
        }
        return (
            <div>
                <h4>Tasks</h4>
                <hr />
                <div className="list-group">
                    {registrations}
                </div>
            </div>
        );
    }
});

module.exports = TasksView;
