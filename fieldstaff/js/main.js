import Bootstrap                 from 'react-bootstrap'
import EventEmitter              from 'events'
import React                     from 'react'
import Router                    from 'react-router'
import assign                    from 'object-assign'

import AppDispatcher             from '../../common/dispatcher/AppDispatcher'
import DataStore                 from '../../common/store/DataStore'
import GroundFork                from '../../common/js/groundfork-js/groundfork'
import NotificationComponent     from '../../common/components/NotificationComponent'
import SyncComponent             from '../../common/components/SyncComponent'

import ComplaintsCollectionRoute from '../../common/components/complaints/ComplaintsCollectionRoute'
import ComplaintsEditRoute       from '../../common/components/complaints/ComplaintsEditRoute'
import ComplaintsRoute           from '../../common/components/complaints/ComplaintsRoute'
import ContactsEditRoute         from '../../common/components/contacts/ContactsEditRoute'
import ContactsRoute             from '../../common/components/contacts/ContactsRoute'
import CustomersCollectionRoute  from '../../common/components/customers/CustomersCollectionRoute'
import CustomersEditRoute        from '../../common/components/customers/CustomersEditRoute'
import CustomersRoute            from '../../common/components/customers/CustomersRoute'
import DeveloperRoute            from '../../common/components/DeveloperRoute'
import OrdersCollectionRoute     from '../../common/components/orders/OrdersCollectionRoute'
import OrdersEditRoute           from '../../common/components/orders/OrdersEditRoute'
import OrdersRoute               from '../../common/components/orders/OrdersRoute'
import PerformanceRoute          from '../../common/components/performance/PerformanceRoute'
import ProductsCollectionRoute   from '../../common/components/products/ProductsCollectionRoute'
import ProductsRoute             from '../../common/components/products/ProductsRoute'
import StockCollectionRoute      from '../../common/components/stock/StockCollectionRoute'
import StockRoute                from '../../common/components/stock/StockRoute'
import TasksCollectionRoute      from '../../common/components/tasks/TasksCollectionRoute'
import TasksRoute                from '../../common/components/tasks/TasksRoute'

import {Route, RouteHandler} from 'react-router'
import {Badge, Glyphicon, Navbar, Nav, NavItem, CollapsibleNav, MenuItem, DropdownButton} from 'react-bootstrap'

const store = new GroundFork.BrowserStorage({
    namespace : 'sphere.fieldstaff'
})

const api = new GroundFork.Api({
    storage            : store,
    debugMode          : true,
    interval           : 5,
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
                        for (var _key in item) {
                            if ('_embedded' !== _key) 
                                _item[_key] = item[_key]
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

const endpoint = new GroundFork.BasicHttpEndpoint({
    api               : api,
    url               : 'http://agile-oasis-7393.herokuapp.com/',
//    url               : 'http://localhost:3333/',
    clientKey         : 'fieldstaff-user1',
    clientSecret      : 'fieldstaff'
})

DataStore.api = api
DataStore.store = store
DataStore.endpoint = endpoint

const SyncStatusStore = assign ({}, EventEmitter.prototype, {
    inSync        : false,
    setSyncStatus : function(newStatus) {
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

const AppNavigation = React.createClass({
    getInitialState: function() {
        return {
            navExpanded : false
        }
    },
    navToggle: function() {
        let expanded = !this.state.navExpanded
        this.setState({
            navExpanded : expanded
        })
    },
    selectNavItem: function(key, item) {
        this.setState({
            navExpanded : false
        })
        location.hash = '/' + item.substr(1)
    },
    runSync: function() {
        DataStore.emit('sync-run')
    },
    render: function() {
        let brand = (
            <a href='#'>
                <img 
                  src = '../common/images/sphere-logo.png'
                  alt = '' />
            </a>
        )

        const menuItems = {
            1 : {
                'label' : 'Customers',
                'href'  : '#customers'
            },
            2 : {
                'label' : 'Complaints',
                'href'  : '#complaints'
            },
            3 : {
                'label' : 'Orders',
                'href'  : '#orders'
            },
            4 : {
                'label' : 'Products',
                'href'  : '#products'
            },
            5 : {
                'label' : 'Stock',
                'href'  : '#stock'
            },
            6 : {
                'label' : (
                    <span>
                        {!!this.props.taskCount ? (
                            <Badge pullRight={true}>
                                {this.props.taskCount}
                            </Badge>
                        ) : <span />}
                        Tasks
                    </span>
                ),
                'href'  : '#tasks'
            }
        }

//            7 : {
//                'label' : 'Performance',
//                'href'  : '#performance'
//            }

        let notifications = []

        if (false === this.props.appInSync) {
            notifications.push({
                text : 'Some resources are out of sync with other devices'
            })
        }

        let i = 1
        return (
            <div>
                <Navbar 
                  brand        = {brand}
                  fixedTop     = {true}
                  fluid        = {true}
                  navExpanded  = {this.state.navExpanded}
                  onToggle     = {this.navToggle}
                  inverse      = {true}
                  toggleNavKey = {0}>
                    <CollapsibleNav eventKey={0}> 
                        <Nav navbar
                          onSelect  = {this.selectNavItem}
                          className = 'collapsed'>
                            {Object.keys(menuItems).map(key => {
                                let item = menuItems[key]
                                return (
                                    <NavItem 
                                      key      = {key}
                                      eventKey = {i++}
                                      href     = {item.href}>
                                      {item.label}
                                    </NavItem>     
                                )
                            })}
                        </Nav>
                        <Nav navbar right>
                            {notifications.length ? (
                                <DropdownButton 
                                  eventKey  = {3}
                                  title     = {<Glyphicon glyph='bell' />}>
                                    {notifications.map(item => {
                                        return (
                                            <MenuItem 
                                              key      = {i}
                                              eventKey = {i++}>
                                                {item.text}
                                            </MenuItem>
                                        )
                                    })}
                                </DropdownButton>
                            ) : null}
                            <NavItem 
                              eventKey  = {1}
                              className = 'btn-sync'
                              href      = 'javascript:;'
                              onClick   = {this.runSync}>
                                <Glyphicon glyph='refresh' />
                                Sync
                            </NavItem>
                        </Nav>
                    </CollapsibleNav>
                </Navbar>
                <div id='sidebar-wrapper'>
                    <ul className='sidebar-nav'>
                        {Object.keys(menuItems).map(key => {
                            let item = menuItems[key]
                            return (
                                <li key={key}>
                                    <a href={item.href}>
                                        {item.label}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
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
        endpoint.syncPoint(response => {
            if (!response || !response.syncPoint)
                return
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
        return (
            <div id='wrapper'>
                <AppNavigation 
                  appInSync = {this.state.inSync}
                  taskCount = {this.state.taskCount} />
                <div id='page-content-wrapper'>
                    <div className='container-fluid'>
                        <SyncComponent />
                        <RouteHandler />
                   </div>
                </div>
            </div>
        )
    }
})

const CustomersRouteEditable = React.createClass({
    render: function() {
        return (
            <CustomersRoute 
              params    = {this.props.params}
              allowEdit = {true} />
        )
    }
})

const routes = (
    <Route handler={App}>
        <Route path ='complaints/:id/edit' handler={ComplaintsEditRoute}        />
        <Route path ='complaints/:id'      handler={ComplaintsRoute}            />
        <Route path ='complaints'          handler={ComplaintsCollectionRoute}  />
        <Route path ='contacts/:id/edit'   handler={ContactsEditRoute}          />
        <Route path ='contacts/:id'        handler={ContactsRoute}              />
        <Route path ='customers/:id/edit'  handler={CustomersEditRoute}         />
        <Route path ='customers/:id'       handler={CustomersRouteEditable}     />
        <Route path ='customers'           handler={CustomersCollectionRoute}   />
        <Route path ='developer'           handler={DeveloperRoute}             />
        <Route path ='orders/:id/edit'     handler={OrdersEditRoute}            />
        <Route path ='orders/:id'          handler={OrdersRoute}                />
        <Route path ='orders'              handler={OrdersCollectionRoute}      />
        <Route path ='performance'         handler={PerformanceRoute}           />
        <Route path ='products/:id'        handler={ProductsRoute}              />
        <Route path ='products'            handler={ProductsCollectionRoute}    />
        <Route path ='stock/:id'           handler={StockRoute}                 />
        <Route path ='stock'               handler={StockCollectionRoute}       />
        <Route path ='tasks/:id'           handler={TasksRoute}                 />
        <Route path ='tasks'               handler={TasksCollectionRoute}       />
    </Route>
)

Router.run(routes, Router.HashLocation, (Root) => {
    React.render(
        <div>
            <NotificationComponent />
            <Root />
        </div>, 
        document.getElementById('main')
    )
})
