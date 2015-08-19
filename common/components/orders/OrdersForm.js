import Bootstrap           from 'react-bootstrap'
import {Dispatcher}        from 'flux'
import EventEmitter        from 'events'
import React               from 'react'
import assign              from 'object-assign'

import AppDispatcher       from '../../dispatcher/AppDispatcher'
import BasketComponent     from '../BasketComponent'
import DataStore           from '../../store/DataStore'
import FormItemStore       from '../../store/FormItemStore'

import {Glyphicon, Button, ButtonGroup, Input, Table} from 'react-bootstrap'

const ProactiveStore = assign({}, FormItemStore)

ProactiveStore.value = false

AppDispatcher.register(payload => {
    if ('order-form-proactive-assign' === payload.actionType) {
        ProactiveStore.setValue(payload.proactive)
    } else if ('order-form-reset' === payload.actionType) {
        ProactiveStore.reset()
    } else if ('order-form-refresh' === payload.actionType) {
        ProactiveStore.refresh()
    }
})

const MyForm = React.createClass({
    getInitialState: function() {
        return {
            isProactive : false
        }
    },
    updateValue: function() {
        this.setState({
            isProactive : ProactiveStore.getValue()
        })
    },
    componentDidMount: function() {
        ProactiveStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        ProactiveStore.removeListener('change', this.updateValue)
    },
    handleChangeProactive: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update(false)
    },
    _update: function(value) {
         AppDispatcher.dispatch({
             actionType : 'order-form-proactive-assign',
             proactive  : value
         })
    },
    render: function() {
        return (
            <div>
                {this.props.filterComponent}
                {this.props.hasValidItem ? (
                    <div 
                      style     = {{marginTop: '1em'}}
                      className = {'form-group has-feedback' + this.props.validState ? ' has-' + this.props.validState : ''}>
                        <div className='row'>
                            <div className='col-xs-4'>
                                <input 
                                  className    = 'form-control'
                                  placeholder  = 'Quantity'
                                  value        = {this.props.value}
                                  defaultValue = {1}
                                  onChange     = {this.props.onChange}
                                  type         = 'text' />
                                {this.props.hint ? (
                                    <p className='help-block'>
                                        {this.props.hint}
                                    </p>
                                ) : <span />}
                            </div>
                            <div className='col-xs-8'>
                                <button 
                                  className = 'btn btn-primary btn-block'
                                  onClick   = {this.props.onItemSelected}>
                                    <span 
                                      className  = 'glyphicon glyphicon-plus-sign'
                                      ariaHidden = 'true' />
                                    Add item
                                </button>
                            </div>
                        </div>
                    </div>
                ) : <span />}
                {!this.props.selectionIsEmpty ? (
                    <div className='form-group'>
                        <div className='help-pull-right'>
                            <div className='checkbox'>
                                <label>
                                    <input
                                      ref      = 'proactive'
                                      type     = 'checkbox'
                                      onChange = {this.handleChangeProactive}
                                      value    = {this.state.isProactive} />
                                    Proactive
                                </label>
                            </div>
                            <span className='help-block'>
                                Check if call was made by the user.
                            </span>
                        </div>
                        <hr />
                        <button 
                          className = 'btn btn-default btn-block'
                          onClick   = {this.props.onSubmit}>
                            <span 
                              className  = 'glyphicon glyphicon-ok'
                              ariaHidden = 'true' />
                            Submit
                        </button>
                    </div>
                ) : <span />}
            </div>
        )
    }
})

const EditForm = React.createClass({
    reset: function() {
        this._update(false)
    },
    _update: function(value) {
         AppDispatcher.dispatch({
             actionType : 'order-form-proactive-assign',
             proactive  : value
         })
    },
    render: function() {
        return (
            <div>
                {this.props.filterComponent}
                {this.props.hasValidItem ? (
                    <div 
                      style     = {{marginTop: '1em'}}
                      className = {'form-group has-feedback' + this.props.validState ? ' has-' + this.props.validState : ''}>
                        <div className='row'>
                            <div className='col-xs-4'>
                                <input 
                                  className    = 'form-control'
                                  placeholder  = 'Quantity'
                                  value        = {this.props.value}
                                  defaultValue = {1}
                                  onChange     = {this.props.onChange}
                                  type         = 'text' />
                                {this.props.hint ? (
                                    <p className='help-block'>
                                        {this.props.hint}
                                    </p>
                                ) : <span />}
                            </div>
                            <div className='col-xs-8'>
                                <button 
                                  className = 'btn btn-primary btn-block'
                                  onClick   = {this.props.onItemSelected}>
                                    <span 
                                      className  = 'glyphicon glyphicon-plus-sign'
                                      ariaHidden = 'true' />
                                    Add item
                                </button>
                            </div>
                        </div>
                    </div>
                ) : <span />}
                {!this.props.selectionIsEmpty ? (
                    <div className='form-group'>
                        <hr />
                        <button 
                          className = 'btn btn-default btn-block'
                          onClick   = {this.props.onSubmit}>
                            <span 
                              className  = 'glyphicon glyphicon-ok'
                              ariaHidden = 'true' />
                            Submit
                        </button>
                    </div>
                ) : <span />}
            </div>
        )
    }
})

const MyFilterComponent = React.createClass({
    render: function() {
        let feedback = ''
        if (this.props.itemIsSelected) {
            feedback = ' has-success'
        } else if (this.props.results.length) {
            feedback = ' has-warning'
        } else if (this.props.value.length > 2) {
            feedback = ' has-error'
        }
        return (
            <div>
                <div className={'form-group has-feedback' + feedback} style={{marginBottom: 0}}>
                    <label htmlFor='cart-filter-input'>Add a product</label>
                    <input 
                      id        = 'cart-filter-input'
                      className = 'form-control'
                      value     = {this.props.value}
                      onChange  = {this.props.onChange}
                      type      = 'text' />
                </div>
                {this.props.results.length ? (
                    <table className='table table-striped table-bordered cart-filter-results'>
                        <tbody>
                            {this.props.results.map(result => {
                                return (
                                    <tr 
                                      style   = {{cursor: 'pointer'}}
                                      onClick = {() => this.props.onSelectItem(result)}
                                      key     = {result.key}>
                                        {this.props.itemFields.map(field => {
                                            return (
                                                <td key={field}>{result.item[field]}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                        {this.props.hasMoreResults ? (
                            <tfoot>
                                <tr key={0} onClick={this.props.expandResults}>
                                    <td colSpan='100'>
                                        &hellip;&nbsp;show {this.props.more} more result{1 !== this.props.more ? 's' : ''}
                                    </td>
                                </tr>
                            </tfoot>
                        ) : null}
                    </table>
                ) : <span />}
            </div>
        )
    }
})

const MyEditor = React.createClass({
    focusInput: function(component) {
        if (component)
            React.findDOMNode(component).focus()
    },
    abortEdit: function(event) {
        if (!event.relatedTarget || 'BUTTON' !== event.relatedTarget.nodeName) {
            this.props.onUserAbort()
        }
    },
    render: function() {
        var btnClass 
        switch (this.props.validState) { 
            case 'success':
                btnClass = 'success'
                break
            case 'error':
                btnClass = 'danger'
                break
            default:
                btnClass = 'primary'
        }
        if (this.props.editMode) {
            return (
                <div 
                  style     = {{marginBottom: 0}}
                  className = {'form-group has-feedback' + (this.props.validState ? ' has-' + this.props.validState : '')}>
                    <div className='input-group input-group-sm'>
                        <input 
                          ref       = {this.focusInput}
                          value     = {this.props.value}
                          onChange  = {this.props.onChange}
                          onBlur    = {this.abortEdit}
                          className = 'form-control'
                          type      = 'text' />
                        <span className='input-group-btn'>
                            <button 
                              onClick   = {this.props.onUpdate}
                              className = {'btn btn-' + btnClass}
                              type      = 'button'>
                                <span 
                                  className  = 'glyphicon glyphicon-ok'
                                  ariaHidden = 'true' />
                                Update
                            </button>
                        </span>
                    </div>
                    {this.props.hint ? (
                        <p className='help-block'>
                            {this.props.hint}
                        </p>
                    ) : <span />}
                </div>
            )
        } else {
            return (
                <div className='input-group input-group-sm'>
                    <input readOnly
                      className = 'form-control disabled'
                      onClick   = {this.props.beginEdit}
                      value     = {this.props.quantity}
                      type      = 'text' />
                </div>
            )
        }
    }
})

const MyRow = React.createClass({
    render: function() {
        //let diff = this.props.quantity - this.props.initialQty,
        //    diffMsg = null
        //if (this.props.initialQty) {
        //    if (diff > 0) {
        //        diffMsg = '+' + diff
        //    } else if (diff < 0) {
        //        diffMsg = diff
        //    }
        //}
        let price = isNaN(this.props.item.itemPrice) 
            ? this.props.item.itemPrice 
            : (this.props.item.itemPrice * this.props.quantity)
        return (
            <tr>
                <td style={{verticalAlign: 'middle'}}>
                    {this.props.item.name}<br />
                    <small style={{color: '#9a9a9a'}}>{this.props.item.sku}</small>
                </td>
                <td style={{verticalAlign: 'middle'}}>
                    <span style={{float: 'right'}}>&times;&nbsp;</span>
                    {this.props.item.itemPrice}
                </td>
                <td style={{verticalAlign: 'middle'}}>
                    {this.props.editor}
                </td>
                <td style={{verticalAlign: 'middle'}}>{price}</td>
                <td style={{verticalAlign: 'middle'}}>
                    <button 
                      className = 'btn btn-default btn-xs btn-block'
                      onClick   = {this.props.removeItem}>
                        <span 
                          className  = 'glyphicon glyphicon-remove'
                          ariaHidden = 'true' />
                          Remove
                    </button>
                </td>
            </tr>
        )
    }
})

//                <td style={{verticalAlign: 'middle', textAlign: 'center'}}>
//                    {diffMsg}
//                </td>

const MyContainer = React.createClass({
    render: function() {
        let tot = 0,
            selection = this.props.selection
        for (var i = 0; i < selection.length; i++) {
            let item  = selection[i],
                price =  item._store.originalProps.item.itemPrice
            if (isNaN(price)) {
                tot = 'N/a'
                break
            } else {
                tot += price * item._store.originalProps.row.qty
            }
        }
        if (0 === selection.length) {
            return (
                <div className='panel panel-default'>
                    <div className='panel-body'>
                        The selection is empty.
                    </div>
                </div>
            )
        } else {
            return (
                <table className='table table-bordered'>
                    <col width='350' />
                    <col width='180' />
                    <col width='200' />
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Item price</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th colSpan='3' />
                        </tr>
                    </thead>
                    <tbody>
                        {selection}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='3'>
                                <b>Total</b>
                            </td>
                            <td colSpan='100'>
                                {tot}
                            </td>
                         </tr>
                    </tfoot>
                </table>
            )
        }
    }
})

function validateQty(item, newQty, initialQty) {
    let diff = newQty - initialQty
    if (diff > item._embedded.stock.available) {
        return {
            state : 'error',
            hint  : 'Insufficient stock.' 
        }
    }
    return {
        state : 'success',
        hint  : ''
    }
}

const OrdersRegistrationForm = React.createClass({
    getInitialState: function() {
        let collection    = DataStore.fetchCollection('products'),
            items         = {},
            priceCategory = this.props.customer.priceCategory
        collection.forEach(item => { 
            let prices = item.getEmbedded('prices')
            item.itemPrice = 0
            if (prices) 
                item.itemPrice = prices[priceCategory] || 'Not available'
            items[item.id] = item 
        })
        return {
            items : items
        }
    },
    handleSubmit: function(selection) {
        let itemCount = 0, 
            tot = 0
        let items = selection.map(item => {
            let qty = Number(item.qty),
                _item = this.state.items[item.id],
                price = isNaN(_item.itemPrice) ? 'N/a' : (_item.itemPrice * qty)
            itemCount += qty
            if (!isNaN(price)) {
                tot += price
            }
            let orderItem = {
                'quantity'    : qty,
                'itemPrice'   : _item.itemPrice,
                'price'       : price,
                '_links'      : { 
                    'product' : {
                        'href': item.id
                    } 
                }
            }
            DataStore.store.embed(orderItem, 'product')
            return orderItem
        })
        let order = {
            'created'      : Date.now(),
            'customerName' : this.props.customer.name, 
            'total'        : tot,
            'user'         : 'Demo user',
            'items'        : items,
            'itemCount'    : itemCount,
            '_links'       : {
                'customer'    : { href: this.props.customer.id },
                '_collection' : { href: this.props.customer.id }
            }
        }
        DataStore.store.embed(order, 'customer')
        let activity = {
            'type'      : 'order-create',
            'activity'  : this.props.activityType,
            'created'   : Date.now(),
            '_links'    : {
                '_collection' : { href: this.props.customer.id }
            }
        }
        if ('Customer call' === this.props.activityType) {
            activity.proactive = !!ProactiveStore.getValue()
        }
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method   : 'POST',
                resource : 'orders',
                payload  : order
            },
            activity   : activity
        })
        var stock
        items.forEach(item => {
            let productId = item['_links']['product'].href,
                product = DataStore.getItem(productId)
            if (product && (stock = product.getLink('stock'))) {
                AppDispatcher.dispatch({
                    actionType : 'command-invoke',
                    command    : {
                        method   : 'POST',
                        resource : 'stock-movements',
                        payload  : {
                            'action'   : 'Order created.',
                            'type'     : 'available',
                            'created'  : Date.now(),
                            'quantity' : -Number(item.quantity),
                            '_links'   : {
                                'order'   : order['_links']['self'],
                                'stock'   : { 'href' : stock },
                                'product' : { 'href' : productId }
                            }
                        }
                    }
                })
            }
        })
        this.props.close()
    },
    render: function() {
        return (
            <BasketComponent
              ref                = 'basket'
              formComponent      = {MyForm}
              filterComponent    = {MyFilterComponent}
              editorComponent    = {MyEditor}
              containerComponent = {MyContainer}
              rowComponent       = {MyRow}
              onSubmit           = {this.handleSubmit}
              validator          = {validateQty}
              items              = {this.state.items}
              itemFields         = {['name', 'itemPrice']}
              filterKeys         = {['name', 'sku']}
              filterMaxResults   = {10}
              filterMinStrLength = {2} 
              selection          = {[]} />
        )
    }
})

const OrdersEditForm = React.createClass({
    getInitialState: function() {
        let collection    = DataStore.fetchCollection('products'),
            items         = {},
            priceCategory = this.props.customer.priceCategory
        collection.forEach(item => { 
            let prices = item.getEmbedded('prices')
            item.itemPrice = 0
            if (prices) 
                item.itemPrice = prices[priceCategory] || 'Not available'
            items[item.id] = item 
        })
        return {
            items : items
        }
    },
    handleSubmit: function(selection) {
        var stock, diffMap = {}
        if (this.props.order.items) {
            this.props.order.items.forEach(item => {
                let product = DataStore.getItem(item['_links']['product'].href)
                if (product && (stock = product.getLink('stock'))) {
                    diffMap[stock] = {
                        diff    : item.quantity,
                        product : product.id
                    }
                }
            })
        }
        let itemCount = 0, 
            tot = 0
        let items = selection.map(item => {
            let qty = Number(item.qty),
                _item = this.state.items[item.id],
                stock = _item['_links']['stock'].href,
                price = isNaN(_item.itemPrice) ? 'N/a' : (_item.itemPrice * qty)
            itemCount += qty
            if (!isNaN(price)) {
                tot += price
            }
            if (diffMap.hasOwnProperty(stock)) {
                diffMap[stock].diff -= qty
            } else {
                diffMap[stock] = {
                    diff    : -qty,
                    product : item.id
                }
            }
            let orderItem = {
                'quantity'    : qty,
                'itemPrice'   : _item.itemPrice,
                'price'       : price,
                '_links'      : { 
                    'product' : {
                        'href': item.id
                    } 
                }
            }
            DataStore.store.embed(orderItem, 'product')
            return orderItem
        })
        let order   = this.props.order,
            orderId = order.getLink('self')
        order.items     = items
        order.itemCount = itemCount
        order.changed   = Date.now()
        order.total     = tot
        AppDispatcher.dispatch({
            actionType : 'command-invoke',
            command    : {
                method   : 'PUT',
                resource : orderId,
                payload  : order
            },
            notification : {
                message : 'The order details were successfully updated.',
                level   : 'success'

            }
        })
        for (var key in diffMap) {
            let diffItem = diffMap[key],
                product  = DataStore.getItem(diffItem.product)
            if (diffItem.diff && product && (stock = product.getLink('stock'))) {
                AppDispatcher.dispatch({
                    actionType : 'command-invoke',
                    command    : {
                        method   : 'POST',
                        resource : 'stock-movements',
                        payload  : {
                            'action'   : 'Order edited.',
                            'type'     : 'available',
                            'created'  : Date.now(),
                            'quantity' : diffItem.diff,
                            '_links'   : {
                                'order'   : { 'href' : orderId },
                                'stock'   : { 'href' : stock },
                                'product' : { 'href' : product.id }
                            }
                        }
                    }
                })
            }
        }
        location.hash = orderId
    },
    render: function() {
        return (
            <BasketComponent
              ref                = 'basket'
              formComponent      = {EditForm}
              filterComponent    = {MyFilterComponent}
              editorComponent    = {MyEditor}
              containerComponent = {MyContainer}
              rowComponent       = {MyRow}
              onSubmit           = {this.handleSubmit}
              validator          = {validateQty}
              items              = {this.state.items}
              itemFields         = {['name', 'itemPrice']}
              filterKeys         = {['name', 'sku']}
              filterMaxResults   = {10}
              filterMinStrLength = {2}
              selection          = {this.props.initialSelection} />
        )
    }
})

module.exports = {OrdersRegistrationForm, OrdersEditForm}
