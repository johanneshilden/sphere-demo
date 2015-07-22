var React                = require('react');
var Router               = require('react-router');
var Bootstrap            = require('react-bootstrap');
var NotificationSystem   = require('react-notification-system');
var ComplaintsView       = require('../../common/components/complaints/ComplaintsView');
var ComplaintsEntityView = require('../../common/components/complaints/ComplaintsEntityView');
var CustomersView        = require('../../common/components/customers/CustomersView');
var CustomersEntityView  = require('../../common/components/customers/CustomersEntityView');
var DataStore            = require('../../common/store/DataStore');
var GroundFork           = require('../../common/js/groundfork-js/groundfork');
var OrdersEntityView     = require('../../common/components/orders/OrdersEntityView');
var OrdersView           = require('../../common/components/orders/OrdersView');
var PerformanceView      = require('../../common/components/performance/PerformanceView');
var ProductsView         = require('../../common/components/products/ProductsView');
var ProductsEntityView   = require('../../common/components/products/ProductsEntityView');
var StockView            = require('../../common/components/stock/StockView');
var SyncComponent        = require('../../common/components/SyncComponent');
var TasksEntityView      = require('../../common/components/tasks/TasksEntityView');
var TasksView            = require('../../common/components/tasks/TasksView');

var Route                = Router.Route;
var RouteHandler         = Router.RouteHandler;

var store = new GroundFork.BrowserStorage({
    namespace : 'sphere.fieldstaff'
});

var api = new GroundFork.Api({
    storage            : store,
    debugMode          : true,
    interval           : 5,
    onBatchJobStart    : function() {},
    onBatchJobComplete : function() {},
    patterns           : {
        'PATCH/stock/:id': function(context, request) {
            var key = 'stock/' + context.id,
                item = store.getItem(key),
                reverse = {};
            if (item) {
                var adjustAvailable = Number(request.payload.adjustAvailable),
                    adjustActual    = Number(request.payload.adjustActual);
                if (adjustAvailable) {
                    item.available += adjustAvailable;
                    reverse.adjustAvailable = -adjustAvailable;
                }
                if (adjustActual) {
                    item.actual += adjustActual;
                    reverse.adjustActual = -adjustActual;
                }
                store.insertItem(key, item);
                if (item.hasOwnProperty('_links') && item['_links'].hasOwnProperty('_parent')) {
                    var product = item['_links']['_parent'].href;
                    store.updateCollectionWith(product, function(collection) {
                        if (!collection.hasOwnProperty('_links')) 
                            collection['_links'] = {};
                        collection['_links']['stock'] = {
                            'href': key
                        };
                        if (!collection.hasOwnProperty('_embedded')) 
                            collection['_embedded'] = {};
                        var _item = {};
                        for (var key in item) {
                            if ('_embedded' !== key) 
                                _item[key] = item[key];
                        }
                        collection['_embedded']['stock'] = _item;
                    });
                }
            }
            return {
                "status" : 'success',
                "data"   : reverse
            };
        },
        'POST/orders': function(context, request) {
            var orderItems = request.payload['_embedded'].items;
            if (!orderItems || !orderItems.length)
                return;
            for (var i = 0; i < orderItems.length; i++) {
                var item = orderItems[i];
                if (item.hasOwnProperty('_links') && item['_links'].hasOwnProperty('product')) {
                    var productHref = item['_links']['product'].href;
                    var product = DataStore.getItem(productHref),
                        stock = null;
                    if (product && (stock = product.getLink('stock'))) {
                        api.patch(stock, { 
                            adjustAvailable: -Number(item.quantity)
                        });
                        var orderHref = request.payload['_links']['self'];
                        api.post('stock-movements', {
                            'action'   : 'Order created.',
                            'type'     : 'available',
                            'quantity' : -Number(item.quantity),
                            '_links'   : {
                                'order'   : orderHref,
                                'stock'   : { 'href' : stock },
                                'product' : { 'href' : productHref }
                            }
                        });
                    }
                }
            }
        }
    }
});

var endpoint = new GroundFork.BasicHttpEndpoint({
    api               : api,
    url               : 'http://agile-oasis-7393.herokuapp.com/',
    //url               : 'http://localhost:3333/',
    clientKey         : 'fieldstaff-user1',
    clientSecret      : 'fieldstaff',
    onRequestStart    : function() {},
    onRequestComplete : function() {}
});

DataStore.api = api;
DataStore.store = store;
DataStore.endpoint = endpoint;

var App = React.createClass({
    handlePressSync: function() {
        DataStore.emit('sync-run');
    },
    render: function() {
        return (
            <div id='wrapper'>
                <nav 
                  className='navbar navbar-inverse navbar-fixed-top' 
                  role='navigation'>
                    <Bootstrap.Button
                      bsSize='small'
                      bsStyle='default'
                      className='btn-sync'
                      onClick={this.handlePressSync}>
                        <span 
                          className='glyphicon glyphicon-cloud-download' 
                          aria-hidden='true' />
                        Sync
                    </Bootstrap.Button>
                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.nav-collapse'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <a className='navbar-brand' href='index.html'>
                            <img src='../common/images/sphere-logo.png' alt='' />
                        </a>
                    </div>
                    <div className='collapse navbar-collapse nav-collapse'>
                        <ul className='nav navbar-nav side-nav'>
                            <li>
                                <span className='nav-label'>Field staff</span>
                            </li>
                            <li>
                                <a href='#customers'>
                                    <i className='fa fa-fw fa-user'></i>Customers
                                </a>
                            </li>
                            <li>
                                <a href='#complaints'>
                                    <i className='fa fa-fw fa-ticket'></i>Complaints
                                </a>
                            </li>
                            <li>
                                <a href='#orders'>
                                    <i className='fa fa-fw fa-line-chart'></i>Orders
                                </a>
                            </li>
                            <li>
                                <a href='#products'>
                                    <i className='fa fa-fw fa-barcode'></i>Products
                                </a>
                            </li>
                            <li>
                                <a href='#stock'>
                                    <i className='fa fa-fw fa-cubes'></i>Stock
                                </a>
                            </li>
                            <li>
                                <a href='#tasks'>
                                    <i className='fa fa-fw fa-thumb-tack'></i>Tasks
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div id='page-wrapper'>
                    <div className='container-fluid'>
                        <SyncComponent />
                        <RouteHandler />
                    </div>
                </div>
            </div>
        );
    }
});

//                            <li>
//                                <a href='#performance'>
//                                    <i className='fa fa-fw fa-tachometer'></i>Performance
//                                </a>
//                            </li>

var OrdersItemRoute = React.createClass({
    getInitialState: function() {
        return {
            order: null
        };
    },
    fetchOrder: function() {
        var order = DataStore.getItem('orders/' + this.props.params.id);
        if (order && order.hasOwnProperty('_embedded')) {
            order.products = order['_embedded']['items'];
        }
        this.setState({order: order});
    },
    componentDidMount: function() {
        this.fetchOrder();
        DataStore.on('change', this.fetchOrder);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchOrder);
    },
    render: function() {
        return (
            <div>
                <Bootstrap.Panel 
                  header='Orders'
                  bsStyle='primary'>
                    <ol className='breadcrumb'>
                        <li>
                            <a href='#orders'>
                                Orders
                            </a>
                        </li>
                        <li className='active'>
                            View order
                        </li>
                    </ol>
                    <OrdersEntityView 
                      order={this.state.order} />
                </Bootstrap.Panel>
            </div>
        )
    }
});

var OrdersRoute = React.createClass({
    fetchOrders: function() {
        var data = DataStore.fetchCollection('orders');
        this.setState({data: data});
    },
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {
        this.fetchOrders();
        DataStore.on('change', this.fetchOrders);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchOrders);
    },

    render: function() {
        return (
            <Bootstrap.Panel 
              className='panel-fill'
              bsStyle='primary'  
              header='Orders'>
                <OrdersView 
                  orders={this.state.data} />
            </Bootstrap.Panel>
        )
    }
});

var StockRoute = React.createClass({
    fetchStock: function() {
        var stock = DataStore.fetchCollection('stock');
        for (var i = 0; i < stock.length; i++) {
            DataStore.store.embed(stock[i], 'product');
        }
        var activity = DataStore.fetchCollection('stock-movements');
        for (var i = 0; i < activity.length; i++) {
            DataStore.store.embed(activity[i], 'product');
            if (activity[i].hasOwnProperty('_embedded') && activity[i]['_embedded'].hasOwnProperty('product'))
                activity[i].productName = activity[i]['_embedded']['product'].name;
        }
        this.setState({
            stock    : stock,
            activity : activity
        });
    },
    getInitialState: function() {
        return {
            data     : [],
            activity : []
        };
    },
    componentDidMount: function() {
        this.fetchStock();
        DataStore.on('change', this.fetchStock);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchStock);
    },
    render: function() {
        return (
            <StockView 
              stock={this.state.stock} 
              activity={this.state.activity} />
        )
    }
});

var CustomersRoute = React.createClass({
    fetchCustomers: function() {
        var data = DataStore.fetchCollection('customers');
        for (var i = 0; i < data.length; i++) {
            data[i].href = data[i]['_links']['self'].href;
        }
        this.setState({data: data});
    },
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {
        this.fetchCustomers();
        DataStore.on('change', this.fetchCustomers);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomers);
    },
    render: function() {
        return (
            <CustomersView 
              customers={this.state.data} />
        )
    }
});

var RegistrationsRoute = React.createClass({
    render: function() {
        return (
            <span>Hello</span>
        )
    }
});

var CustomersItemRoute = React.createClass({
    render: function() {
        return (
            <CustomersEntityView 
              customerId={this.props.params.id} />
        )
    }
});

var ComplaintsRoute = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },
    fetchComplaints: function() {
        var data = DataStore.fetchCollection('complaints');
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            DataStore.store.embed(item, 'customer');
            data[i].customer = item['_embedded']['customer'];
        }
        this.setState({data: data});
    },
    componentDidMount: function() {
        this.fetchComplaints();
        DataStore.on('change', this.fetchComplaints);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaints);
    },
    render: function() {
        return (
            <Bootstrap.Panel 
              header='Complaints'
              bsStyle='primary'>
                <ComplaintsView complaints={this.state.data} />
            </Bootstrap.Panel>
        );
    }
});
 
var ComplaintsItemRoute = React.createClass({
    getInitialState: function() {
        return {
            complaint: null
        };
    },
    fetchComplaint: function() {
        var complaint = DataStore.getItem('complaints/' + this.props.params.id);
        if (complaint && complaint.hasOwnProperty('_embedded')) {
            if (complaint['_embedded'].hasOwnProperty('items')) {
                for (var i = 0; i < complaint['_embedded']['items'].length; i++) {
                    var item = complaint['_embedded']['items'][i];
                    DataStore.store.embed(item, 'product');
                    item.product = item['_embedded']['product'];
                }
            }
            complaint.products = complaint['_embedded']['items'];
            complaint.customer = complaint['_embedded']['customer'];
        }
        this.setState({complaint: complaint});
    },
    componentDidMount: function() {
        this.fetchComplaint();
        DataStore.on('change', this.fetchComplaint);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaint);
    },
    render: function() {
        return (
            <div>
                <Bootstrap.Panel 
                  header='Complaints'
                  bsStyle='primary'>
                    <ol className='breadcrumb'>
                        <li>
                            <a href='#complaints'>
                                Complaints
                            </a>
                        </li>
                        <li className='active'>
                            View complaint
                        </li>
                    </ol>
                    <ComplaintsEntityView 
                      complaint={this.state.complaint} />
                </Bootstrap.Panel>
            </div>
        )
    }
});

var ContactsItemRoute = React.createClass({
    getInitialState: function() {
        return {
            contact: null
        };
    },
    fetchContact: function() {
        var contact = DataStore.getItem('contacts/' + this.props.params.id);
        if (contact && contact.hasOwnProperty('_embedded')) {
            contact.customer = contact['_embedded']['customer'];
        }
        this.setState({contact: contact});
    },
    componentDidMount: function() {
        this.fetchContact();
        DataStore.on('change', this.fetchContact);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchContact);
    },
    render: function() {
        var contact = this.state.contact;
        if (!contact)
            return <span />;
        return (
            <Bootstrap.Panel 
              header='Contacts'
              bsStyle='primary'>
                <ol className='breadcrumb'>
                    <li>
                        <a href='#customers'>
                            Customers
                        </a>
                    </li>
                    <li>
                        <a href={'#' + contact.customer['_links']['self'].href}>
                            {contact.customer.name}
                        </a>
                    </li>
                     <li className='active'>
                        Contact information
                    </li>
                </ol>
                <Bootstrap.Table bordered striped>
                    <col width='180' />
                    <col />
                    <tr>
                        <td><b>Type</b></td>
                        <td>{contact.type}</td>
                    </tr>
                    <tr>
                        <td><b>Info</b></td>
                        <td>{contact.info}</td>
                    </tr>
                    <tr>
                        <td><b>Comment</b></td>
                        <td>{contact.meta}</td>
                    </tr>
                </Bootstrap.Table>
            </Bootstrap.Panel>
        )
    }
});

var TasksItemRoute = React.createClass({
    getInitialState: function() {
        return {
            task: null
        };
    },
    fetchTask: function() {
        var task = DataStore.getItem('tasks/' + this.props.params.id);
        this.setState({task: task});
    },
    componentDidMount: function() {
        this.fetchTask();
        DataStore.on('change', this.fetchTask);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTask);
    },
    render: function() {
        return (
            <div>
                <Bootstrap.Panel 
                  header='Tasks'
                  bsStyle='primary'>
                    <ol className='breadcrumb'>
                        <li>
                            <a href='#tasks'>
                                Tasks
                            </a>
                        </li>
                        <li className='active'>
                            View task
                        </li>
                    </ol>
                    <TasksEntityView 
                      task={this.state.task} />
                </Bootstrap.Panel>
            </div>
        );
    }
});

var TasksRoute = React.createClass({
    fetchTasks: function() {
        var tasks = DataStore.fetchCollection('tasks');
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            tasks[i].href = task['_links']['self'].href;
        }
        this.setState({tasks: tasks});
    },
    getInitialState: function() {
        return {
            tasks: []
        };
    },
    componentDidMount: function() {
        this.fetchTasks();
        DataStore.on('change', this.fetchTasks);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTasks);
    },
    render: function() {
        return (
            <Bootstrap.Panel 
              bsStyle='primary'
              header='Tasks'>
                <TasksView 
                  tasks={this.state.tasks} />
            </Bootstrap.Panel>
        )
    }
});

var ProductsItemRoute = React.createClass({
    render: function() {
        return (
            <ProductsEntityView 
              productId={this.props.params.id} />
        )
    }
});

var ProductsRoute = React.createClass({
    fetchProducts: function() {
        var data = DataStore.fetchCollection('products');
        for (var i = 0; i < data.length; i++) {
            data[i].href = data[i]['_links']['self'].href;
        }
        this.setState({data: data});
    },
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {
        this.fetchProducts();
        DataStore.on('change', this.fetchProducts);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchProducts);
    },
    render: function() {
        return (
            <ProductsView 
              products={this.state.data} />
        )
    }
});

var PerformanceRoute = React.createClass({
    render: function() {
        return (
            <PerformanceView />
        )
    }
});

var NotificationComponent = React.createClass({
    componentDidMount: function() {
        DataStore.on('notification', this.addNotification);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('notification', this.addNotification);
    },
    addNotification: function(notification) {
        this.refs.notifications.addNotification(notification);
    },
    render: function() {
        return (
            <NotificationSystem ref='notifications' />
        );
    }
});

var routes = (
    <Route handler={App}>
        <Route path='orders/:id' handler={OrdersItemRoute} />
        <Route path='orders' handler={OrdersRoute} />
        <Route path='stock' handler={StockRoute} />
        <Route path='customers' handler={CustomersRoute} />
        <Route path='registrations' handler={RegistrationsRoute} />
        <Route path='customers/:id' handler={CustomersItemRoute} />
        <Route path='complaints/:id' handler={ComplaintsItemRoute} />
        <Route path='complaints' handler={ComplaintsRoute} />
        <Route path='contacts/:id' handler={ContactsItemRoute} />
        <Route path='tasks/:id' handler={TasksItemRoute} />
        <Route path='tasks' handler={TasksRoute} />
        <Route path='products/:id' handler={ProductsItemRoute} />
        <Route path='products' handler={ProductsRoute} />
        <Route path='performance' handler={PerformanceRoute} />
    </Route>
);

Router.run(routes, Router.HashLocation, function(Root) {
    React.render(
        <div>
            <NotificationComponent />
            <Root />
        </div>, 
        document.getElementById('main')
    );
});

