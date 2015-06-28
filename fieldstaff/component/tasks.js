var React     = require('react');
var Bootstrap = require('react-bootstrap');
var Griddle   = require('griddle-react');
var DataStore = require('../store/DataStore');

var Panel     = Bootstrap.Panel;

var TasksView = React.createClass({
    getInitialState: function() {
        return {
            registrationCount: 0
        };
    },
    collectTasks: function() {
        var registrations = DataStore.fetchCollection('registrations');
        this.setState({registrationCount: registrations.length});
    },
    componentDidMount: function() {
        this.collectTasks();
    },
    render: function() {
        var registrations = '',
            count = this.state.registrationCount;
        if (this.state.registrationCount) {
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
