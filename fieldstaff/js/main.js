var React                 = require('react')
var Router                = require('react-router')
var Bootstrap             = require('react-bootstrap')
var assign                = require('object-assign')
var EventEmitter          = require('events')

var AppDispatcher         = require('../../common/dispatcher/AppDispatcher')
var ComplaintsView        = require('../../common/components/complaints/ComplaintsView')
var ComplaintsEntityView  = require('../../common/components/complaints/ComplaintsEntityView')
var CustomersView         = require('../../common/components/customers/CustomersView')
var CustomersEntityView   = require('../../common/components/customers/CustomersEntityView')
var DataStore             = require('../../common/store/DataStore')
var GroundFork            = require('../../common/js/groundfork-js/groundfork')
var OrdersEntityView      = require('../../common/components/orders/OrdersEntityView')
var OrdersView            = require('../../common/components/orders/OrdersView')
var PerformanceView       = require('../../common/components/performance/PerformanceView')
var ProductsView          = require('../../common/components/products/ProductsView')
var ProductsEntityView    = require('../../common/components/products/ProductsEntityView')
var StockView             = require('../../common/components/stock/StockView')
var SyncComponent         = require('../../common/components/SyncComponent')
var TasksEntityView       = require('../../common/components/tasks/TasksEntityView')
var TasksView             = require('../../common/components/tasks/TasksView')
var NotificationComponent = require('../../common/components/NotificationComponent')

var Route                 = Router.Route
var RouteHandler          = Router.RouteHandler

var store = new GroundFork.BrowserStorage({
    namespace : 'sphere.fieldstaff'
})

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
                reverse = {}
            if (item) {
                var adjustAvailable = Number(request.payload.adjustAvailable),
                    adjustActual    = Number(request.payload.adjustActual)
                if (adjustAvailable) {
                    item.available += adjustAvailable
                    reverse.adjustAvailable = -adjustAvailable
                }
                if (adjustActual) {
                    item.actual += adjustActual
                    reverse.adjustActual = -adjustActual
                }
                store.insertItem(key, item)
                if (item.hasOwnProperty('_links') && item['_links'].hasOwnProperty('_parent')) {
                    var product = item['_links']['_parent'].href
                    store.updateCollectionWith(product, function(collection) {
                        if (!collection.hasOwnProperty('_links')) 
                            collection['_links'] = {}
                        collection['_links']['stock'] = {
                            'href': key
                        }
                        if (!collection.hasOwnProperty('_embedded')) 
                            collection['_embedded'] = {}
                        var _item = {}
                        for (var key in item) {
                            if ('_embedded' !== key) 
                                _item[key] = item[key]
                        }
                        collection['_embedded']['stock'] = _item
                    })
                }
            }
            return {
                "status" : 'success',
                "data"   : reverse
            }
        },
        'POST/orders': function(context, request) {
            let orderItems = request.payload.items
            if (!orderItems || !orderItems.length)
                return
            var stock, product
            orderItems.forEach(item => {
                product = DataStore.getItem(item['_links']['product'].href)
                if (product && (stock = product.getLink('stock'))) {
                    api.patch(stock, { 
                        adjustAvailable: -Number(item.quantity)
                    })
                    api.post('stock-movements', {
                        'action'   : 'Order created.',
                        'type'     : 'available',
                        'created'  : Date.now(),
                        'quantity' : -Number(item.quantity),
                        '_links'   : {
                            'order'   : request.payload['_links']['self'],
                            'stock'   : { 'href' : stock },
                            'product' : { 'href' : product.id }
                        }
                    })
                }
            })
        }
    }
})

var endpoint = new GroundFork.BasicHttpEndpoint({
    api               : api,
    url               : 'http://agile-oasis-7393.herokuapp.com/',
   //url    : 'http://localhost:3333/',
    clientKey         : 'fieldstaff-user1',
    clientSecret      : 'fieldstaff',
    onRequestStart    : function() {},
    onRequestComplete : function() {}
})

DataStore.api = api
DataStore.store = store
DataStore.endpoint = endpoint

const SyncStatusStore = assign ({}, EventEmitter.prototype, {
    inSync: false,
    setSyncStatus: function(newStatus) {
        if (newStatus !== this.inSync) {
            this.inSync = newStatus
            this.emit('change')
        }
    }
})

AppDispatcher.register(function(payload) {
    if (payload.actionType === 'sync-status-update') {
        SyncStatusStore.setSyncStatus(payload.inSync)
    }
})

const App = React.createClass({
    timer: null,
    getInitialState: function() {
        return {
            taskCount : 0,
            inSync    : false
        }
    },
    countTasks: function() {
        let tasks = DataStore.fetchCollection('tasks')
        this.setState({
            taskCount : tasks.length
        })
    },
    componentDidMount: function() {
        this.countTasks()
        this.checkSyncStatus()
        DataStore.on('change', this.countTasks)
        DataStore.on('sync-complete', this.checkSyncStatus)
        SyncStatusStore.on('change', this.updateSyncStatus)
        this.timer = setInterval(() => {this.checkSyncStatus()}, 5000)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.countTasks)
        DataStore.removeListener('sync-complete', this.checkSyncStatus)
        SyncStatusStore.removeListener('change', this.updateSyncStatus)
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    checkSyncStatus: function() {
        if (navigator && !navigator.onLine)
            return
        endpoint.syncPoint((response) => {
            if (!response || !response.syncPoint)
                return
            console.log(response)
            let inSync = response.syncPoint == api.syncPoint()
            AppDispatcher.dispatch({
                actionType : 'sync-status-update',
                inSync     : inSync
            })
        })
    },
    updateSyncStatus: function() {
        if (this.state.inSync !== SyncStatusStore.inSync) {
            this.setState({inSync: SyncStatusStore.inSync})
        }
    },
    runSync: function() {
        DataStore.emit('sync-run')
    },
    render: function() {
        let badge = this.state.taskCount ? (
            <Bootstrap.Badge pullRight={true}>
                {this.state.taskCount}
            </Bootstrap.Badge>
        ) : (
            <span />
        )
//                    <Bootstrap.Button
//                      bsSize='small'
//                      bsStyle='default'
//                      className='btn-sync'
//                      onClick={this.handlePressSync}>
//                        <span 
//                          className='glyphicon glyphicon-cloud-download' 
//                          aria-hidden='true' />
//                        Sync
//                    </Bootstrap.Button>
//                            <li>
//                                <span className='nav-label'>Field staff</span>
//                            </li>

//<Bootstrap.OverlayTrigger placement='bottom' overlay={tooltip}>
//                                    </Bootstrap.OverlayTrigger>

        let tooltip = (
            <Bootstrap.Tooltip>
                Some resources have changed on other devices.
            </Bootstrap.Tooltip>
        )
        return (
            <div id='wrapper'>
                <nav 
                  className='navbar navbar-inverse navbar-fixed-top' 
                  role='navigation'>
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
                    <ul className='nav navbar-right top-nav'>
                        <li className='nav-sync-btn'>
                            {!this.state.inSync ? (
                                <Bootstrap.OverlayTrigger 
                                  placement='bottom' 
                                  overlay={tooltip}>
                                    <a className='badge-indicator' href='javascript:;' onClick={this.runSync}>
                                        <Bootstrap.Glyphicon 
                                          glyph='exclamation-sign' />
                                    </a>
                                </Bootstrap.OverlayTrigger>
                            ) : (
                                <span />
                            )}
                            <a href='javascript:;' onClick={this.runSync}>
                                <Bootstrap.Glyphicon 
                                  style={{fontSize: '130%', marginTop: '-.1em'}}
                                  glyph='refresh' />
                            </a>
                         </li>
                    </ul>
                    <div className='collapse navbar-collapse nav-collapse'>
                        <ul className='nav navbar-nav side-nav'>
                            <li>
                                <a href='#customers'>
                                    Customers
                                </a>
                            </li>
                            <li>
                                <a href='#complaints'>
                                    Complaints
                                </a>
                            </li>
                            <li>
                                <a href='#orders'>
                                    Orders
                                </a>
                            </li>
                            <li>
                                <a href='#products'>
                                    Products
                                </a>
                            </li>
                            <li>
                                <a href='#stock'>
                                    Stock
                                </a>
                            </li>
                            <li>
                                <a href='#tasks'>
                                    Tasks
                                    {badge}
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
        )
    }
})

//                            <li>
//                                <a href='#performance'>
//                                    <i className='fa fa-fw fa-tachometer'></i>Performance
//                                </a>
//                            </li>

const OrdersItemRoute = React.createClass({
    getInitialState: function() {
        return {
            order    : null,
            customer : null
        }
    },
    fetchOrder: function() {
        let order = DataStore.getItem('orders/' + this.props.params.id)
        if (order) {
            order.items.forEach(item => {
                item.product = item['_embedded']['product']
            })
            let customer = order.getEmbedded('customer')
            if (customer) {
                order.customer = customer
                customer.id = customer['_links']['self'].href
            }
            this.setState({
                order    : order,
                customer : customer
            })
        }
    },
    componentDidMount: function() {
        this.fetchOrder()
        DataStore.on('change', this.fetchOrder)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchOrder)
    },
    render: function() {
        if (!this.state.order || !this.state.customer)
            return (
                <span />
            )
        let customer = this.state.customer
        return (
            <div>
                <Bootstrap.Panel 
                  header='Orders'
                  bsStyle='primary'>
                    <ol className='breadcrumb'>
                        <li>
                            <a href='#/customers'>
                                Customers
                            </a>
                        </li>
                        <li>
                            <a href={'#/' + customer.id}>
                                {customer.name}
                            </a>
                        </li>
                        <li className='active'>
                            View order
                        </li>
                    </ol>
                    <OrdersEntityView order={this.state.order} />
                </Bootstrap.Panel>
            </div>
        )
    }
})

const OrdersRoute = React.createClass({
    fetchOrders: function() {
        var orders = DataStore.fetchCollection('orders')
        this.setState({orders: orders})
    },
    getInitialState: function() {
        return {
            orders : []
        }
    },
    componentDidMount: function() {
        this.fetchOrders()
        DataStore.on('change', this.fetchOrders)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchOrders)
    },
    render: function() {
        return (
            <Bootstrap.Panel 
              className='panel-fill'
              bsStyle='primary'  
              header='Orders'>
                <OrdersView orders={this.state.orders} />
            </Bootstrap.Panel>
        )
    }
})

const StockItemRoute = React.createClass({
    render: function() {
        return (
            <ProductsEntityView 
              productId={this.props.params.id} 
              parentResource='Stock' />
        )
    }
})

const StockRoute = React.createClass({
    fetchStock: function() {
        let embedProduct = (item) => {
            item.embed('product')
            item.product = item.getEmbedded('product')
            item.productName = item.product.name
        }
        let stock = DataStore.fetchCollection('stock')
        stock.forEach(embedProduct)
        let activity = DataStore.fetchCollection('stock-movements')
        activity.forEach(embedProduct)
        this.setState({
            stock    : stock,
            activity : activity
        })
    },
    getInitialState: function() {
        return {
            data     : [],
            activity : []
        }
    },
    componentDidMount: function() {
        this.fetchStock()
        DataStore.on('change', this.fetchStock)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchStock)
    },
    render: function() {
        return (
            <StockView 
              stock={this.state.stock} 
              activity={this.state.activity} />
        )
    }
})

const CustomersRoute = React.createClass({
    fetchCustomers: function() {
        let data = DataStore.fetchCollection('customers')
        this.setState({data: data})
    },
    getInitialState: function() {
        return {
            data: []
        }
    },
    componentDidMount: function() {
        this.fetchCustomers()
        DataStore.on('change', this.fetchCustomers)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomers)
    },
    render: function() {
        return (
            <CustomersView customers={this.state.data} />
        )
    }
})

const CustomersItemRoute = React.createClass({
    getInitialState: function() {
        return {
            customer : null
        }
    },
    fetchCustomer: function() {
        let customer = DataStore.getItem('customers/' + this.props.params.id)
        if (customer) {
            let activities = customer.getEmbedded('activities') || [],
                orders     = customer.getEmbedded('orders')     || [],
                complaints = customer.getEmbedded('complaints') || [],
                tasks      = customer.getEmbedded('tasks')      || []
            this.setState({
                customer   : customer,
                activities : activities.map(item => {
                    item.resource = item.getLink('resource')
                    return item
                }),
                orders     : orders.map(order => {
                    order.id = order['_links']['self'].href
                    return order
                }),
                contacts   : customer.getEmbedded('contacts')   || [],
                complaints : complaints.map(complaint => {
                    complaint.id = complaint['_links']['self'].href
                    return complaint
                }),
                tasks      : tasks.map(task => {
                    task.id = task['_links']['self'].href
                    return task
                })
            })
        }
    },
    componentDidMount: function() {
        this.fetchCustomer()
        DataStore.on('change', this.fetchCustomer)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomer)
    },
    render: function() {
        return (
            <CustomersEntityView 
              customer   = {this.state.customer}
              orders     = {this.state.orders}
              contacts   = {this.state.contacts}
              complaints = {this.state.complaints}
              tasks      = {this.state.tasks}
              activities = {this.state.activities} />
        )
    }
})

const ComplaintsRoute = React.createClass({
    getInitialState: function() {
        return {
            complaints : []
        }
    },
    fetchComplaints: function() {
        let complaints = DataStore.fetchCollection('complaints')
        complaints.forEach(item => {
            item.customer = item.getEmbedded('customer')
        })
        this.setState({complaints: complaints})
    },
    componentDidMount: function() {
        this.fetchComplaints()
        DataStore.on('change', this.fetchComplaints)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaints)
    },
    render: function() {
        return (
            <Bootstrap.Panel 
              header='Complaints'
              bsStyle='primary'>
                <ComplaintsView 
                  complaints={this.state.complaints} />
            </Bootstrap.Panel>
        )
    }
})

const ComplaintsItemRoute = React.createClass({
    getInitialState: function() {
        return {
            complaint : null
        }
    },
    fetchComplaint: function() {
        let complaint = DataStore.getItem('complaints/' + this.props.params.id)
        if (complaint) {
            if (complaint.items) {
                complaint.items.forEach(item => {
                    item.product = item['_embedded']['product']
                })
            }
            complaint.customer = complaint.getEmbedded('customer')
        }
        this.setState({complaint: complaint})
    },
    componentDidMount: function() {
        this.fetchComplaint()
        DataStore.on('change', this.fetchComplaint)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaint)
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
})

const ContactsItemRoute = React.createClass({
    getInitialState: function() {
        return {
            contact : null
        }
    },
    fetchContact: function() {
        var contact = DataStore.getItem('contacts/' + this.props.params.id)
        contact.customer = contact.getEmbedded('customer')
        this.setState({contact: contact})
    },
    componentDidMount: function() {
        this.fetchContact()
        DataStore.on('change', this.fetchContact)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchContact)
    },
    render: function() {
        let contact = this.state.contact
        if (!contact)
            return <span />
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
})

const TasksItemRoute = React.createClass({
    getInitialState: function() {
        return {
            task : null
        }
    },
    fetchTask: function() {
        var task = DataStore.getItem('tasks/' + this.props.params.id)
        if (task) {
            this.setState({task: task})
        } else {
            window.location.hash = '#/tasks'
        }
    },
    componentDidMount: function() {
        this.fetchTask()
        DataStore.on('change', this.fetchTask)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTask)
    },
    render: function() {
        return (
            <div>
                <Bootstrap.Panel 
                  header='Tasks'
                  bsStyle='primary'>
                    <ol className='breadcrumb'>
                        <li>
                            <a href='#/tasks'>
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
        )
    }
})

const TasksRoute = React.createClass({
    fetchTasks: function() {
        var tasks = DataStore.fetchCollection('tasks')
        this.setState({tasks: tasks})
    },
    getInitialState: function() {
        return {
            tasks : []
        }
    },
    componentDidMount: function() {
        this.fetchTasks()
        DataStore.on('change', this.fetchTasks)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchTasks)
    },
    render: function() {
        return (
            <Bootstrap.Panel 
              bsStyle = 'primary'
              header  = 'Tasks'>
                <TasksView tasks={this.state.tasks} />
            </Bootstrap.Panel>
        )
    }
})

const ProductsItemRoute = React.createClass({
    render: function() {
        return (
            <ProductsEntityView productId={this.props.params.id} />
        )
    }
})

const ProductsRoute = React.createClass({
    fetchProducts: function() {
        let products = DataStore.fetchCollection('products')
        this.setState({products: products})
    },
    getInitialState: function() {
        return {
            products : []
        }
    },
    componentDidMount: function() {
        this.fetchProducts()
        DataStore.on('change', this.fetchProducts)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchProducts)
    },
    render: function() {
        return (
            <ProductsView products={this.state.products} />
        )
    }
})

const PerformanceRoute = React.createClass({
    render: function() {
        return (
            <PerformanceView />
        )
    }
})

var routes = (
    <Route handler={App}>
        <Route path ='orders/:id'     handler={OrdersItemRoute}     />
        <Route path ='orders'         handler={OrdersRoute}         />
        <Route path ='stock/:id'      handler={StockItemRoute}      />
        <Route path ='stock'          handler={StockRoute}          />
        <Route path ='customers'      handler={CustomersRoute}      />
        <Route path ='customers/:id'  handler={CustomersItemRoute}  />
        <Route path ='complaints/:id' handler={ComplaintsItemRoute} />
        <Route path ='complaints'     handler={ComplaintsRoute}     />
        <Route path ='contacts/:id'   handler={ContactsItemRoute}   />
        <Route path ='tasks/:id'      handler={TasksItemRoute}      />
        <Route path ='tasks'          handler={TasksRoute}          />
        <Route path ='products/:id'   handler={ProductsItemRoute}   />
        <Route path ='products'       handler={ProductsRoute}       />
        <Route path ='performance'    handler={PerformanceRoute}    />
    </Route>
)

Router.run(routes, Router.HashLocation, function(Root) {
    React.render(
        <div>
            <NotificationComponent />
            <Root />
        </div>, 
        document.getElementById('main')
    )
})

// Close responsive Bootstrap nav when selecting an item
$('.navbar-fixed-top a').on('click', function(e) {
    if ($('body').width() < 768 && 'LI' === e.target.parentNode.nodeName) {
        $(".navbar-toggle").click();
    }
});

