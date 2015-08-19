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
    useCompression : false,
    namespace      : 'sphere.fieldstaff'
})

function getLink(obj, resource) {
    if (!obj || !obj.hasOwnProperty('_links') || !obj['_links'].hasOwnProperty(resource))
        return null;
    return obj['_links'][resource].href;
}

const api = new GroundFork.Api({
    storage            : store,
    debugMode          : true,
    interval           : 5, 
    onSyncComplete     : function(log) {
        log.forEach(item => {
            //if ('POST' === item.command.up.method && 'stock-movements' === item.command.up.resource) {
            //    let move  = item.command.up.payload,
            //        stock = DataStore.getItem(move['_links']['stock'].href)
            //    if (stock && stock.available < 0) {
            //        let order = DataStore.getItem(move['_links']['order'].href)
            //        AppDispatcher.dispatch({
            //            actionType : 'command-invoke',
            //            command    : {
            //                method   : 'DELETE',
            //                resource : order.id
            //            }
            //        })
            //        AppDispatcher.dispatch({
            //            actionType : 'command-invoke',
            //            command    : {
            //                method   : 'POST',
            //                resource : 'orders-rejected',
            //                payload  : order
            //            },
            //            notification: {
            //                message : 'An order was temporarily rejected due to insufficient stock of one or more products.',
            //                level   : 'warning'
            //            }
            //        })
            //        order.items.forEach(item => {
            //            let productId = item['_links']['product'].href,
            //                product = DataStore.getItem(productId)
            //            if (product && (stock = product.getLink('stock'))) {
            //                AppDispatcher.dispatch({
            //                    actionType : 'command-invoke',
            //                    command    : {
            //                        method   : 'POST',
            //                        resource : 'stock-movements',
            //                        payload  : {
            //                            'action'   : 'Order blocked due to insufficient stock.',
            //                            'type'     : 'available',
            //                            'created'  : Date.now(),
            //                            'quantity' : Number(item.quantity),
            //                            '_links'   : {
            //                                'order'   : { 'href' : order.id },
            //                                'stock'   : { 'href' : stock },
            //                                'product' : { 'href' : productId }
            //                            }
            //                        }
            //                    }
            //                })
            //            }
            //        })
            //    }
            //}
        })
    },
    patterns           : {
        'POST/stock-movements': function(context, request) {
            let payload   = request.payload,
                uri       = getLink(payload, 'self'),
                stock     = getLink(payload, 'stock'),
                stockItem = this.getItem(stock)
            api._route({
                method   : 'PATCH',
                resource : stock,
                payload  : {
                    available : stockItem.available + payload.quantity
                }
            }, this)
        },
        'DELETE/stock-movements/:id': function(context, request) {
            let key       = 'stock-movements/' + context.id,
                move      = this.getItem(key),
                stock     = getLink(move, 'stock'),
                stockItem = this.getItem(stock)
            api._route({
                method   : 'PATCH',
                resource : stock,
                payload  : {
                    available : stockItem.available - move.quantity
                }
            }, this)
        }
    }
//        'PUT/orders/:id': function(context, request) {
//            let key        = 'orders/' + context.id,
//                order      = this.getItem(key),
//                payload    = request.payload,
//                orderItems = payload.items,
//                movements  = payload['_links']['stock-movements'] || [],
//                messages   = []
//            if (!order) {
//                return { 
//                    "status"   : 'error',
//                    "_error"   : "MISSING_KEY", 
//                    "resource" : key 
//                }
//            }
//            var stock, diffMap = {}
//            if (order.items) {
//                order.items.forEach(item => {
//                    let product = this.getItem(getLink(item, 'product'))
//                    if (product && (stock = getLink(product, 'stock'))) {
//                        diffMap[stock] = {
//                            diff    : item.quantity,
//                            product : item['_links']['product'] 
//                        }
//                    }
//                })
//            }
//            orderItems.forEach(item => {
//                let product = this.getItem(getLink(item, 'product'))
//                if (product && (stock = getLink(product, 'stock'))) {
//                    if (!diffMap.hasOwnProperty(stock)) {
//                        diffMap[stock] = {
//                            diff    : 0,
//                            product : item['_links']['product'] 
//                        }
//                    }
//                    diffMap[stock].diff -= item.quantity
//                }
//            })
//            for (var _key in diffMap) {
//                let stockItem = this.getItem(_key),
//                    diff      = diffMap[_key].diff,
//                    newStock  = stockItem.available + diff
//                api._route({
//                    method   : 'PATCH',
//                    resource : _key,
//                    payload  : {
//                        available : newStock
//                    }
//                }, this)
//                if (newStock < 0) {
//                    messages.push({
//                        type  : 'stock_availability_exceeded',
//                        stock : _key,
//                        order : key
//                    })
//                }
//                if (diff) {
//                    let resp = api._route({
//                        method   : 'POST',
//                        resource : 'stock-movements',
//                        payload  : {
//                            'action'   : 'Order edited.',
//                            'type'     : 'available',
//                            'created'  : Date.now(),
//                            'quantity' : diff,
//                            '_links'   : {
//                                'order'   : key,
//                                'stock'   : { 'href' : _key },
//                                'product' : diffMap[_key].product
//                            }
//                        }
//                    }, this)
//                    movements.push(resp.data['_links']['self'])
//                }
//            }
//            payload['_links']['stock-movements'] = movements
//            this.insertItem(key, payload)
//            var oldLinked = getLink(order, '_collection')
//            var newLinked = getLink(payload, '_collection')
//            if (oldLinked !== newLinked) {
//                if (oldLinked) {
//                    this.removeFromCollection(oldLinked, key, 'orders')
//                    this.updateCollectionWith(oldLinked, embedCollection.bind(this, 'orders'))
//                }
//                if (newLinked) {
//                    this.addToCollection(newLinked, key, 'orders')
//                    this.updateCollectionWith(newLinked, embedCollection.bind(this, 'orders'))
//                }
//            }
//            oldLinked = getLink(order, '_parent')
//            newLinked = getLink(request.payload, '_parent')
//            if (oldLinked !== newLinked) {
//                if (oldLinked) 
//                    removeFromParent.call(this, oldLinked, 'orders')
//                if (newLinked) 
//                    addToParent.call(this, newLinked, key, 'orders')
//            }
//            return {
//                "status" : 'success',
//                "data"   : order
//            }
//        },
//        'POST/orders': function(context, request) {
//            let payload    = request.payload,
//                uri        = getLink(payload, 'self'),
//                orderItems = payload.items,
//                movements  = [],
//                messages   = []
//            var stock
//            orderItems.forEach(item => {
//                let product = this.getItem(getLink(item, 'product'))
//                if (product && (stock = getLink(product, 'stock'))) {
//                    let stockItem = this.getItem(stock),
//                        diff      = -Number(item.quantity),
//                        newStock  = stockItem.available + diff
//                    api._route({
//                        method   : 'PATCH',
//                        resource : stock,
//                        payload  : {
//                            available : newStock
//                        }
//                    }, this)
//                    if (newStock < 0) {
//                        messages.push({
//                            type  : 'stock_availability_exceeded',
//                            stock : stock,
//                            order : uri
//                        })
//                    }
//                    let resp = api._route({
//                        method   : 'POST',
//                        resource : 'stock-movements',
//                        payload  : {
//                            'action'   : 'Order created.',
//                            'type'     : 'available',
//                            'created'  : Date.now(),
//                            'quantity' : diff,
//                            '_links'   : {
//                                'order'   : uri,
//                                'stock'   : { 'href' : stock },
//                                'product' : item['_links']['product'] 
//                            }
//                        }
//                    }, this)
//                    movements.push(resp.data['_links']['self'])
//                }
//            })
//            payload['_links']['stock-movements'] = movements
//            this.insertItem(uri, payload);
//            var linked
//            if ((linked = getLink(payload, '_collection'))) {
//                this.addToCollection(linked, uri, 'orders')
//                this.updateCollectionWith(linked, collection => {
//                    this.embedCollection('orders', collection)
//                })
//            } 
//            if ((linked = getLink(payload, '_parent'))) {
//                this.addToParent(linked, uri, 'orders')
//            }
//            this.addToCollection('orders', uri)
//            return {
//                "status"   : 'success',
//                "data"     : payload,
//                "messages" : messages
//            }
//        },
//        'DELETE/orders/:id': function(context, request) {
//            let key      = 'orders/' + context.id,
//                order    = this.getItem(key)
//            if (!order) {
//                return { 
//                    "status"   : 'error',
//                    "_error"   : "MISSING_KEY", 
//                    "resource" : key 
//                }
//            }
//            if (order['_links']['activities']) {
//                api._route({
//                    method   : 'DELETE',
//                    resource : order['_links']['activities'].href
//                }, this)
//            }
//            if (order['_links']['stock-movements']) {
//                order['_links']['stock-movements'].forEach(item => {
//                    api._route({
//                        method   : 'DELETE',
//                        resource : item.href
//                    }, this)
//                })
//            }
//            var stock
//            if (order.items) {
//                order.items.forEach(item => {
//                    let product = this.getItem(getLink(item, 'product'))
//                    if (product && (stock = getLink(product, 'stock'))) {
//                        let stockItem = this.getItem(stock),
//                            newStock  = stockItem.available + Number(item.quantity)
//                        api._route({
//                            method   : 'PATCH',
//                            resource : stock,
//                            payload  : {
//                                available : newStock
//                            }
//                        }, this)
//                    }
//                })
//            }
//            var linked
//            this.removeItem(key)
//            if ((linked = getLink(order, '_collection'))) {
//                this.removeFromCollection(linked, key, 'orders');
//                this.updateCollectionWith(linked, collection => {
//                    this.embedCollection('orders', collection)
//                })
//            } 
//            if ((linked = getLink(order, '_parent'))) {
//                this.removeFromParent(linked, 'orders')
//            }
//            this.removeFromCollection('orders', key);
//            return {
//                "status"   : 'success',
//                "resource" : 'orders',
//                "data"     : order
//            }
//        }
//    }
})

const endpoint = new GroundFork.BasicHttpEndpoint({
    api               : api,
    url               : 'http://agile-oasis-7393.herokuapp.com/',
   //url    : 'http://localhost:3333/',
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

// //-------------
// 
// api.command({
//     "method"   : "POST",
//     "resource" : "orders",
//     "payload"  : {
//         "created": 1439491210099,
//         "customerName": "Teacher Shop",
//         "items": [
//           {
//             "quantity": 23,
//             "_embedded": {
//               "product": {
//                 "unitSize": "60x100g",
//                 "_links": {
//                   "prices": {
//                     "href": "prices/_94S0"
//                   },
//                   "self": {
//                     "href": "products/_94S0"
//                   },
//                   "stock": {
//                     
//                   }
//                 },
//                 "name": "Frozen Acai Energiser",
//                 "sku": "001acaie",
//                 "description": "Not him old music think his found enjoy merry. Listening acuteness dependent at or an. Apartments thoroughly unsatiable terminated how themselves. She are ten hours wrong walls stand early. Domestic perceive on an ladyship extended received do. Why jennings our whatever his learning perceive. Is against no he without subject. Bed connection unreserved preference partiality not unaffected. Years merit trees so think in hoped we as."
//               }
//             },
//             "_links": {
//               "product": {
//                 "href": "products/_94S0"
//               }
//             },
//             "price": 300,
//             "itemPrice": 100
//           }
//         ],
//         "_embedded": {
//           "customer": {
//             "phone": 25562440128,
//             "area": "Kinondoni",
//             "tin": "58-12976962",
//             "address": "Temboni, Saranga",
//             "_links": {
//               "activities": [
//                 {
//                   "href": "activities/_yPfZ"
//                 },
//                 {
//                   "href": "activities/_eDsg"
//                 },
//                 {
//                   "href": "activities/_Z8I6"
//                 },
//                 {
//                   "href": "activities/_WaTj"
//                 },
//                 {
//                   "href": "activities/_YwFr"
//                 },
//                 {
//                   "href": "activities/_xzUP"
//                 }
//               ],
//               "self": {
//                 "href": "customers/_94S0"
//               },
//               "orders": [
//                 {
//                   "href": "orders/_yPfZ"
//                 },
//                 {
//                   "href": "orders/_eDsg"
//                 },
//                 {
//                   "href": "orders/_Z8I6"
//                 },
//                 {
//                   "href": "orders/_WaTj"
//                 },
//                 {
//                   "href": "orders/_YwFr"
//                 },
//                 {
//                   "href": "orders/_xzUP"
//                 }
//               ]
//             },
//             "name": "Teacher Shop",
//             "priceCategory": "Retail",
//             "position": {
//               "latitude": -6.78725,
//               "longitude": 39.137914
//             }
//           }
//         },
//         "user": "Demo user",
//         "_links": {
//           "_collection": {
//             "href": "customers/_94S0"
//           },
//           "customer": {
//             "href": "customers/_94S0"
//           },
//           "self": {
//             "href": "orders/_O4cZ"
//           },
//           "_parent": {
//             "href": "activities/_O4cZ"
//           }
//         },
//         "total": 300,
//         "itemCount": 3
//       }
// })
