var React                    = require('react');
var Bootstrap                = require('react-bootstrap');
var CustomerRegistrationForm = require('../component/customers/register');
var PendingRegistrationsView = require('../component/customers/pending');
var CustomersListView        = require('../component/customers/list');
var DataStore                = require('../store/DataStore');

var TabbedArea               = Bootstrap.TabbedArea;
var TabPane                  = Bootstrap.TabPane;

var CustomersView = React.createClass({
    getInitialState: function() {
        return {
            key: 1
        };
    },
    handleSelect: function(key) {
        this.setState({key: key});
    },
    onNewRegistration: function() {
        this.setState({key: 3});
    },
    componentDidMount: function() {
        DataStore.on('new-registration', this.onNewRegistration);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('new-registration', this.onNewRegistration);
    },
    render: function() {
        return (
            <div>
                <h4>Customers</h4>
                <hr />
                <TabbedArea activeKey={this.state.key} onSelect={this.handleSelect}>
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
            </div>
        );
    }
});

module.exports = CustomersView;
