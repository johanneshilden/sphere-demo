var React                    = require('react');
var Bootstrap                = require('react-bootstrap');
var CustomerRegistrationForm = require('../component/customers/register');
var PendingRegistrationsView = require('../component/customers/pending');
var CustomersListView        = require('../component/customers/list');
var DataStore                = require('../store/DataStore');

var TabbedArea               = Bootstrap.TabbedArea;
var TabPane                  = Bootstrap.TabPane;
var Panel                    = Bootstrap.Panel;

var CustomersView = React.createClass({
    getInitialState: function() {
        return {
            key: 1
        };
    },
    handleSelect: function(key) {
        this.setState({key: key});
    },
    onStoreChange: function(command) {
        if (command && 'POST' === command.method && 'registrations' === command.resource) {
            this.setState({key: 3});
        }
    },
    componentDidMount: function() {
        DataStore.on('change', this.onStoreChange);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.onStoreChange);
    },
    render: function() {
        return (
            <Panel className="panel-fill" header="Customers">
                <TabbedArea fill activeKey={this.state.key} onSelect={this.handleSelect}>
                    <TabPane eventKey={1} tab="Customers">
                        <CustomersListView />
                    </TabPane>
                    <TabPane eventKey={2} tab="Register new customer">
                        <CustomerRegistrationForm />
                    </TabPane>
                    <TabPane eventKey={3} tab="Pending registrations">
                        <PendingRegistrationsView />
                    </TabPane>
                </TabbedArea>
            </Panel>
        );
    }
});

module.exports = CustomersView;
