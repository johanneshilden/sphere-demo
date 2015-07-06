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
        var key = this.props.tab || 1;
        return {
            key: key
        };
    },
    handleSelect: function(key) {
        this.setState({key: key});
    },
    onNewCustomer: function() {
        this.setState({key: 1});
    },
    onRegisterPartial: function() {
        this.setState({key: 2});
    },
    componentDidMount: function() {
        DataStore.on('new-customer', this.onNewCustomer);
        DataStore.on('register-partial', this.onRegisterPartial);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('new-customer', this.onNewCustomer);
        DataStore.removeListener('register-partial', this.onRegisterPartial);
    },
    render: function() {
        return (
            <Panel className="panel-fill" header="Customers">
                <TabbedArea fill activeKey={this.state.key} onSelect={this.handleSelect}>
                    <TabPane eventKey={1} tab="All customers">
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
