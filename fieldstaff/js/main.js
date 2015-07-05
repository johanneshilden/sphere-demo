var $                   = require('jquery');
var Backbone            = require('backbone');
var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var DataStore           = require('../store/DataStore');
var GroundFork          = require('./groundfork-js/groundfork');
var ProductsView        = require('../component/products');
var OrdersView          = require('../component/orders/list');
var StockView           = require('../component/stock/list');
var TasksView           = require('../component/tasks');
var CustomersView       = require('../component/customers');
var CustomersEntityView = require('../component/customers/view');
var ComplaintsView      = require('../component/complaints');
var AppDispatcher       = require('../dispatcher/AppDispatcher');

var Alert               = Bootstrap.Alert;
var Badge               = Bootstrap.Badge;
var Button              = Bootstrap.Button;
var ButtonToolbar       = Bootstrap.ButtonToolbar;
var Nav                 = Bootstrap.Nav;
var NavItem             = Bootstrap.NavItem;
var Navbar              = Bootstrap.Navbar;
var Panel               = Bootstrap.Panel;
var ProgressBar         = Bootstrap.ProgressBar;

var store = new GroundFork.BrowserStorage({
    namespace: "sphere.fieldstaff"
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
    clientKey: "fieldstaff-user1",
    clientSecret: "fieldstaff",
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
        var taskCount = DataStore.fetchTasks().count;
        var badge = <span />;
        if (taskCount) {
            badge = (
                <span>&nbsp;<Badge>{taskCount}</Badge></span>
            );
        }
        return (
            <div>
                <Navbar className="navbar-fixed-top" brand={<a href="#">Sphere</a>} toggleNavKey={0}>
                    <Nav eventKey={0}>
                       <NavItem eventKey={1} href="#orders">Orders</NavItem> 
                       <NavItem eventKey={2} href="#stock">Stock</NavItem> 
                       <NavItem eventKey={3} href="#customers">Customers</NavItem> 
                       <NavItem eventKey={4} href="#complaints">Complaints</NavItem> 
                       <NavItem eventKey={5} href="#tasks">Tasks{badge}</NavItem> 
                       <NavItem eventKey={6} href="#products">Products</NavItem> 
                    </Nav>
                </Navbar>
                <p className="nav-info">Field Staff</p>
            </div>
        );
    }
});
           
var Router = Backbone.Router.extend({
    routes: {
        "orders"        : "manageOrders",
        "stock"         : "manageStock",
        "customers/:id" : "viewCustomer",
        "customers"     : "manageCustomers",
        "complaints"    : "manageComplaints",
        "registrations" : "manageRegistrations",
        "tasks"         : "manageTasks",
        "products"      : "manageProducts",
        "developer"     : "developer"
    },
    developer: function() {
        React.render(
            <DeveloperView />,
            document.getElementById('main')
        );
    },
    manageOrders: function() {
        React.render(
            <OrdersView />,
            document.getElementById('main')
        );
    },
    manageStock: function() {
        React.render(
            <StockView />,
            document.getElementById('main')
        );
    },
    viewCustomer: function(customerId) {
        React.render(
            <CustomersEntityView 
                customerId={customerId} />,
            document.getElementById('main')
        );
    },
    manageCustomers: function() {
        React.render(
            <CustomersView />,
            document.getElementById('main')
        );
    },
    manageComplaints: function() {
        React.render(
            <ComplaintsView />,
            document.getElementById('main')
        );
    },
    manageRegistrations: function() {
        React.render(
            <CustomersView tab={3} />,
            document.getElementById('main')
        );
    },
    manageTasks: function() {
        React.render(
            <TasksView />,
            document.getElementById('main')
        );
    },
    manageProducts: function() {
        React.render(
            <ProductsView />,
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

