var $               = require('jquery');
var React           = require('react');
var Backbone        = require('backbone');
var Bootstrap       = require('react-bootstrap');
var Griddle         = require('griddle-react');
var CustomersView   = require('../component/customers');
var DataStore       = require('../store/DataStore');
var GroundFork      = require('./groundfork-js/groundfork');
var AppDispatcher   = require('../dispatcher/AppDispatcher');

var Alert           = Bootstrap.Alert;
var Button          = Bootstrap.Button;
var ButtonToolbar   = Bootstrap.ButtonToolbar;
var Nav             = Bootstrap.Nav;
var NavItem         = Bootstrap.NavItem;
var Navbar          = Bootstrap.Navbar;
var Panel           = Bootstrap.Panel;
var ProgressBar     = Bootstrap.ProgressBar;

var store = new GroundFork.BrowserStorage({
    namespace: "sphere.callcenter"
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

var NavComponent = React.createClass({
    render: function() {
        return (
            <div>
                <Navbar className="navbar-fixed-top" brand={<a href="#">Sphere</a>} toggleNavKey={0}>
                    <Nav eventKey={0}>
                       <NavItem eventKey={1} href="#customers">Customers</NavItem> 
                    </Nav>
                </Navbar>
                <p className="nav-info">Call Center</p>
            </div>
        );
    }
});
           
var Router = Backbone.Router.extend({
    routes: {
        customers: "manageCustomers"
    },
    manageCustomers: function() {
        React.render(
            <CustomersView />,
            document.getElementById('main')
        );
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
$('.nav a').on('click', function() {
    if ($('body').width() < 768) {
        $(".navbar-toggle").click();
    }
});
