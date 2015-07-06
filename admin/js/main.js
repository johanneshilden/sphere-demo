var $                 = require('jquery');
var React             = require('react');
var Backbone          = require('backbone');
var Bootstrap         = require('react-bootstrap');
var CustomerEditForm  = require('../component/customers/edit');
var CustomersListView = require('../component/customers/list');
var ComplaintsView    = require('../component/complaints');
var DataStore         = require('../store/DataStore');
var Griddle           = require('griddle-react');
var GroundFork        = require('./groundfork-js/groundfork');
var AppDispatcher     = require('../dispatcher/AppDispatcher');

var Alert             = Bootstrap.Alert;
var Button            = Bootstrap.Button;
var ButtonToolbar     = Bootstrap.ButtonToolbar;
var Nav               = Bootstrap.Nav;
var NavItem           = Bootstrap.NavItem;
var Navbar            = Bootstrap.Navbar;
var Panel             = Bootstrap.Panel;
var ProgressBar       = Bootstrap.ProgressBar;

var store = new GroundFork.BrowserStorage({
    namespace: "sphere.admin"
});

var api = new GroundFork.Api({
    storage: store,
    debugMode: false,
    onBatchJobStart: function() {},
    onBatchJobComplete: function() {}
});

var endpoint = new GroundFork.BasicHttpEndpoint({
    api: api,
    url: "http://agile-oasis-7393.herokuapp.com/",
    //url: "http://localhost:3333/",
    clientKey: "admin-user1",
    clientSecret: "administrator",
    onRequestStart: function() {},
    onRequestComplete: function() {}
});
 
DataStore.api = api;
DataStore.store = store;
 
var AlertComponent = React.createClass({
    getInitialState: function() {
        return {
            messages: {},
            counter: 0
        }
    },
    handleMessage: function(message) {
        var messages = this.state.messages,
            counter = this.state.counter;
        messages[++counter] = message;
        this.setState({
            messages: messages,
            counter: counter
        })
    },
    componentDidMount: function() {
        DataStore.on('alert', this.handleMessage);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('alert', this.handleMessage);
    },
    handleAlertDismiss: function(id) {
        var messages = this.state.messages;
        delete messages[id];
        this.setState({messages:messages})
    },
    render: function() {
        var obj = this.state.messages,
            messages = [];
        for (var key in obj) {
            messages.push({
                id: key,
                text: obj[key]
            });
        }
        return (
            <div>
            {messages.map(function(message) {
                return (
                    <Alert
                        bsStyle="info"
                        onDismiss={this.handleAlertDismiss.bind(this, message.id)}
                        key={message.id}>
                        {message.text}
                    </Alert>
                );
            }.bind(this))}
            </div>
        );
    }
});

var SyncComponent = React.createClass({
    handleSync: function() {
        this.setState({
            syncRunning: true,
            syncStep: 0,
            syncTotal: 0
        });
        endpoint.sync(["sink"],
            this.onSyncSuccess,
            this.onSyncError,
            this.updateProgress);
    },
    onSyncSuccess: function() {
        this.setState({syncRunning: false});
        DataStore.emit("change")
    },
    onSyncError: function() {
        this.setState({syncRunning: false});
    },
    updateProgress: function(step, total) {
        this.setState({
            syncStep: step,
            syncTotal: total
        });
    },
    getInitialState: function() {
        return {
            syncStep: 0,
            syncTotal: 0,
            syncRunning: false
        };
    },
    render: function() {
        var progressBar = <span />;
        if (this.state.syncRunning)
            progressBar = 
                <div>
                    <h6>Processing change log.</h6>
                    <ProgressBar
                        style={{marginBottom: 0}}
                        max={this.state.syncTotal}
                        now={this.state.syncStep} />
                </div>
        return (
            <Panel>
                <ButtonToolbar>
                    <Button
                        bsSize="xsmall"
                        bsStyle="default"
                        onClick={this.handleSync}>
                        <span className="glyphicon glyphicon-cloud-download" aria-hidden="true"></span>
                        &nbsp;Sync
                    </Button>
                </ButtonToolbar>
                {progressBar}
            </Panel>
        );
    }
});

var menuItems = [
    { 
        href: '#customers',
        label: 'Customers'
    },
    {
        href: '#complaints',
        label: 'Complaints'
    }
];

var NavComponent = React.createClass({
    getInitialState: function() {
        return {
            active: 0
        };
    },
    switchKey: function(key) {
        this.setState({
            active: key
        });
    },
    componentDidMount: function() {
        DataStore.on('menu-key', this.switchKey);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('menu-key', this.switchKey);
    },
    render: function() {
        var items = [];
        for (var i = 0; i < menuItems.length; i++) {
            var item = menuItems[i],
                key = i + 1;
            var navItem = (
                <NavItem key={key} active={key === this.state.active} eventKey={key} href={item.href}>{item.label}</NavItem> 
            );
            items.push(navItem);
        }
        return (
            <div>
                <Navbar className="navbar-fixed-top" brand={<a href="#">Sphere</a>} toggleNavKey={0}>
                    <Nav eventKey={0}>
                        {items}
                    </Nav>
                </Navbar>
                <p className="nav-info">Administration</p>
            </div>
        );
    }
});

var Router = Backbone.Router.extend({
    routes: {
        "customers/edit/:id" : "editCustomer",
        "customers"          : "manageCustomers",
        "complaints"         : "manageComplaints"
    },
    editCustomer: function(key) {
        React.render(
            <CustomerEditForm 
                customerId={key} />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 1);
    },
    manageCustomers: function() {
        React.render(
            <CustomersListView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 1);
    },
    manageComplaints: function() {
        React.render(
            <ComplaintsView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 2);
    }
});

new Router;
Backbone.history.start();

React.render(
    <SyncComponent />,
    document.getElementById('sync-widget')
);

React.render(
    <AlertComponent />,
    document.getElementById('modal-overlay')
);

React.render(
    <NavComponent />,
    document.getElementById('navbar-container')
);

// Close responsive Bootstrap nav when selecting an item
$('.navbar-fixed-top a').on('click', function() {
    if ($('body').width() < 768) {
        $(".navbar-toggle").click();
    }
});
