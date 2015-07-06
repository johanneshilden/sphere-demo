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

var menuItems = [
    {
        href: '#orders',
        label: 'Orders'
    },
    {
        href: '#stock',
        label: 'Stock'
    },
    {
        href: '#customers',
        label: 'Customers'
    },
    {
        href: '#complaints',
        label: 'Complaints'
    },
    {
        href: '#tasks',
        label: 'Tasks'
    },
    {
        href: '#products',
        label: 'Products'
    },
];

var NavComponent = React.createClass({
    getInitialState: function() {
        return {
            taskCount: 0,
            active: 0
        };
    },
    switchKey: function(key) {
        this.setState({
            active: key
        });
    },
    fetchTaskCount: function() {
        var taskCount = DataStore.fetchTasks().count;
        this.setState({
            taskCount: taskCount
        });
    },
    componentDidMount: function() {
        DataStore.on('change', this.fetchTaskCount);
        DataStore.on('menu-key', this.switchKey);
        this.fetchTaskCount();
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTaskCount);
        DataStore.removeListener('menu-key', this.switchKey);
    },
    render: function() {
       var taskCount = this.state.taskCount;
        var badge = <span />;
        if (taskCount) {
            badge = (
                <span>&nbsp;<Badge>{taskCount}</Badge></span>
            );
        }
        var items = [];
        for (var i = 0; i < menuItems.length; i++) {
            var item = menuItems[i],
                key = i + 1;
            var navItem = (
                <NavItem key={key} active={key === this.state.active} eventKey={key} href={item.href}>{item.label}{'#tasks' === item.href ? badge : ''}</NavItem> 
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
        DataStore.emit('menu-key', 1);
    },
    manageStock: function() {
        React.render(
            <StockView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 2);
    },
    viewCustomer: function(customerId) {
        React.render(
            <CustomersEntityView 
                customerId={customerId} />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 3);
    },
    manageCustomers: function() {
        React.render(
            <CustomersView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 3);
    },
    manageComplaints: function() {
        React.render(
            <ComplaintsView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 4);
    },
    manageRegistrations: function() {
        React.render(
            <CustomersView tab={3} />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 4);
    },
    manageTasks: function() {
        React.render(
            <TasksView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 5);
    },
    manageProducts: function() {
        React.render(
            <ProductsView />,
            document.getElementById('main')
        );
        DataStore.emit('menu-key', 6);
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

