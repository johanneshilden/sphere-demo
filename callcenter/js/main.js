var $                   = require('jquery');
var React               = require('react');
var Backbone            = require('backbone');
var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var CustomersView       = require('../component/customers');
var CustomersEntityView = require('../component/customers/view');
var ComplaintsView      = require('../component/complaints');
var DataStore           = require('../store/DataStore');
var GroundFork          = require('./groundfork-js/groundfork');
var AppDispatcher       = require('../dispatcher/AppDispatcher');

var Alert               = Bootstrap.Alert;
var Button              = Bootstrap.Button;
var ButtonToolbar       = Bootstrap.ButtonToolbar;
var Nav                 = Bootstrap.Nav;
var NavItem             = Bootstrap.NavItem;
var Navbar              = Bootstrap.Navbar;
var Panel               = Bootstrap.Panel;
var ProgressBar         = Bootstrap.ProgressBar;

var store = new GroundFork.BrowserStorage({
    namespace: "sphere.callcenter"
});

var api = new GroundFork.Api({
    storage: store,
    debugMode: true,
    onBatchJobStart: function() {},
    onBatchJobComplete: function() {}
});

var endpoint = new GroundFork.BasicHttpEndpoint({
    api: api,
    url: "http://agile-oasis-7393.herokuapp.com/",
    //url: "http://localhost:3333/",
    clientKey: "callcenter-user1",
    clientSecret: "callcenter",
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
                <Navbar className="navbar-fixed-top" brand={<a href="#"><img src="../common/assets/images/sphere-logo.png" style={{marginTop: '-2px'}} alt="" /></a>} toggleNavKey={0}>
                    <Nav eventKey={0}>
                        {items}
                    </Nav>
                </Navbar>
                <p className="nav-info">Call Center</p>
            </div>
        );
    }
});
           
var Router = Backbone.Router.extend({
    routes: {
        "customers/:id" : "viewCustomer",
        "customers"     : "manageCustomers",
        "complaints"    : "manageComplaints"
    },
    manageCustomers: function() {
        React.render(
            <CustomersView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 1);
    },
    viewCustomer: function(customerId) {
        React.render(
            <CustomersEntityView 
                customerId={customerId} />,
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

var websocket = new WebSocket("ws://agile-oasis-7393.herokuapp.com/"); 

websocket.onopen = function(e) { 
    console.log('WebSocket connection established.');
}; 

websocket.onclose = function(e) { 
    console.log('WebSocket connection established.');
}; 

websocket.onmessage = function(e) { 
    console.log('<message>');
    console.log(e);
}; 

websocket.onerror = function(e) { 
    console.log('error');
};


