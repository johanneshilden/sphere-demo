import Bootstrap           from 'react-bootstrap'
import DateTimeField       from 'react-bootstrap-datetimepicker'
import EventEmitter        from 'events'
import Griddle             from 'griddle-react'
import React               from 'react'
import assign              from 'object-assign'

import AppDispatcher       from '../../dispatcher/AppDispatcher'
import DataStore           from '../../store/DataStore'
import FormItemStore       from '../../store/FormItemStore'

import {Button, ButtonGroup, Input, Modal, Panel, Table} from 'react-bootstrap'

const ProductSelectionStore = assign({}, EventEmitter.prototype, {

    _collection : [],

    removeProduct: function(index) {
        this._collection.splice(index, 1)
        this.reIndex()
        this.emit('change')
    },

    addProduct: function() {
        let newItem = {
            product  : ProductStore.getProduct(),
            quantity : QuantityStore.getValue(),
            comment  : CommentStore.getValue(),
            batch    : BatchStore.getValue()
        }
        this._collection.push(newItem)
        this.reIndex()
        this.emit('change')
    },

    resetCollection: function() {
        this._collection = []
        this.emit('change')
    },

    reIndex: function() {
        let i = 0
        this._collection.forEach(item => {
            item._index = i++
        })
    },

    collection: function() {
        return this._collection
    }

})

const ProductStore = assign({}, FormItemStore, {

    _products    : [],
    _suggestions : [],
    _product     : null,

    validate: function() {
        if (this.value.length <= 2) {
            this.state = 'error'
            this.hint  = 'This field is required.'
        } else {
            let found = null
            this._suggestions = []
            this._products.forEach(product => {
                if (product.name == this.value || product.sku == this.value) {
                    found = product
                    return
                }
                let name  = product.name.toLowerCase(),
                    sku   = product.sku.toLowerCase(),
                    value = this.value.toLowerCase()
                if (-1 !== name.indexOf(value) || -1 !== sku.indexOf(value)) 
                    this._suggestions.push(product)
            })
            if (!found) {
                this.state = this._suggestions.length ? 'warning' : 'error'
            } else {
                this._suggestions = []
                this.state = 'success'
                this._product = found
            }
            this.hint = null
        }
    },

    getSuggestions: function() {
        return this._suggestions
    },

    getProduct: function() {
        return this._product
    }

})

AppDispatcher.register(payload => {
    if ('complaint-form-product-assign' === payload.actionType) {
        ProductStore.setValue(payload.product)
    } else if ('complaint-form-init' === payload.actionType) {
        ProductStore._products = DataStore.fetchCollection('products')
        ProductStore._suggestions = []
    } else if ('complaint-form-reset' === payload.actionType) {
        ProductStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        ProductStore.refresh()
    }
})

const ProductInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null,
            suggestions     : []
        }
    },
    updateValue: function() {
        this.setState(ProductStore.getState())
    },
    componentDidMount: function() {
        ProductStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        ProductStore.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update('')
    },
    _update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-product-assign',
            product    : value
        })
    },
    renderSuggestions: function() {
        let suggestions = ProductStore.getSuggestions()
        if (!suggestions || !suggestions.length)
            return (
                <span />
            )
        let i = 0
        return (
            <Table 
              bordered  
              condensed 
              hover 
              className='type-ahead' 
              style={{marginTop: '-16px', border: '2px solid #dce4ec'}}>
                <tbody>
                    {suggestions.map(item => {
                        return (
                            <tr
                              key={i++} 
                              onClick={() => this._update(item.name)}>
                              <td>{item.name}</td>
                              <td>{item.sku}</td>
                            </tr> 
                        )
                    })}
                </tbody>
            </Table>
        )
    },
    render: function() {
        return (
            <div>
                <Input 
                  type='text'
                  label={this.props.label}
                  value={this.state.value}
                  help={this.state.hint}
                  placeholder='Enter the name or SKU of a product'
                  bsStyle={this.state.validationState}
                  hasFeedback
                  ref='input'
                  onChange={this.handleChange} />
                {this.renderSuggestions()}
            </div>
        )
    }
})

const BatchStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint  = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('complaint-form-batch-assign' === payload.actionType) {
        BatchStore.setValue(payload.batch)
    } else if ('complaint-form-reset' === payload.actionType) {
        BatchStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        BatchStore.refresh()
    }
})

const BatchInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            hint            : null,
            validationState : null
        }
    },
    updateValue: function() {
        this.setState(BatchStore.getState())
    },
    componentDidMount: function() {
        BatchStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        BatchStore.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update('')
    },
    _update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-batch-assign',
            batch      : value
        })
    },
    render: function() {
        return (
            <Input
              label='Batch number'
              ref='input'
              value={this.state.value}
              placeholder='The batch to which the product belongs'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        )
    }
})

const QuantityStore = assign({}, FormItemStore, {
    validate: function() {
        let intValue = parseInt(this.value)
        if (this.value && (isNaN(intValue) || intValue <= 0)) { 
            this.state = 'error'
            this.hint  = 'The value must be a positive integer.'
        } else if (!intValue) {
            this.state = 'error'
            this.hint  = 'This value is required.'
        } else {
            this.state = 'success'
            this.hint  = null
        }
    }
})

AppDispatcher.register(payload => {
    if ('complaint-form-quantity-assign' === payload.actionType) {
        QuantityStore.setValue(payload.quantity)
    } else if ('complaint-form-reset' === payload.actionType) {
        QuantityStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        QuantityStore.refresh()
    }
})

const QuantityInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            hint            : null,
            validationState : null
        }
    },
    updateValue: function() {
        this.setState(QuantityStore.getState())
    },
    componentDidMount: function() {
        QuantityStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        QuantityStore.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update('')
    },
    _update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-quantity-assign',
            quantity   : value
        })
    },
    render: function() {
        return (
            <Input
              label='Quantity'
              ref='input'
              value={this.state.value}
              placeholder='The number of products affected by the complaint'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        )
    }
})

const CommentStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint  = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('complaint-form-comment-assign' === payload.actionType) {
        CommentStore.setValue(payload.comment)
    } else if ('complaint-form-reset' === payload.actionType) {
        CommentStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        CommentStore.refresh()
    }
})

const CommentInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            hint            : null,
            validationState : null
        }
    },
    updateValue: function() {
        this.setState(CommentStore.getState())
    },
    componentDidMount: function() {
        CommentStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        CommentStore.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update('')
    },
    _update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-comment-assign',
            comment    : value
        })
    },
    render: function() {
        return (
            <Input
              label='Description'
              ref='input'
              value={this.state.value}
              placeholder='A short description of the defect or problem with the product'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='textarea' />
        )
    }
})

AppDispatcher.register(payload => {
    switch (payload.actionType) {
        case 'complaint-product-add-item':
            ProductSelectionStore.addProduct()
            break
        case 'complaint-product-remove-item':
            ProductSelectionStore.removeProduct(payload.index)
            break
        default:
            break
    }
})

const ItemForm = React.createClass({
    getInitialState: function() {
        return {
            expanded : false
        }
    },
    expand: function() {
        if (ProductStore.isValid()) {
            this.setState({expanded: true})
        }
    },
    componentDidMount: function() {
        ProductStore.on('change', this.expand)
    },
    componentWillUnmount: function() {
        ProductStore.removeListener('change', this.expand)
    },
    addItem: function() {
        let isValid = !!( CommentStore.isValid()
                        & QuantityStore.isValid()
                        & BatchStore.isValid()
                        & ProductStore.isValid() )
        if (!isValid) {
            AppDispatcher.dispatch({
                actionType : 'complaint-form-refresh'
            })
        } else {
            AppDispatcher.dispatch({
                actionType : 'complaint-product-add-item',
                product    : ProductStore.getValue(),
                quantity   : QuantityStore.getValue(),
                comment    : CommentStore.getValue(),
                batch      : BatchStore.getValue()
            })
            AppDispatcher.dispatch({
                actionType : 'complaint-form-reset'
            })
            this.setState({expanded: false})
        }
    },
    render: function() {
        return (
            <div>
                <ProductInput 
                  ref='productInput'
                  label={this.props.label} />
                {this.state.expanded ? (
                    <div>
                        <Bootstrap.Row>
                            <Bootstrap.Col md={6}><BatchInput ref='batchInput' /></Bootstrap.Col>
                            <Bootstrap.Col md={6}><QuantityInput ref='quantityInput' /></Bootstrap.Col>
                        </Bootstrap.Row>
                        <CommentInput ref='commentInput' />
                        <Button 
                          bsStyle='primary' 
                          bsSize='medium' 
                          onClick={this.addItem}
                          block>
                            <Bootstrap.Glyphicon 
                              glyph='plus-sign' />
                            Add product
                        </Button>
                    </div>
                ) : <span />}
            </div>
        )
    }
})

const ComplaintProductsComponent = React.createClass({
    removeItem: function(index) {
        AppDispatcher.dispatch({
            actionType : 'complaint-product-remove-item',
            index      : index
        })
    },
    render: function() {
        if (!this.props.products.length)
            return <span />
        let i = 0
        return (
            <div className='form-group'>
                <label>Products</label>
                <Table striped bordered condensed>
                    <col width='250' />
                    <col width='110' />
                    <col width='110' />
                    <col />
                    <col width='100' />
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Batch</th>
                            <th>Quantity</th>
                            <th>Comment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.products.map(item => {
                            return (
                                <tr key={i++}>
                                    <td>{item.product.name}</td>
                                    <td>{item.batch}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.comment}</td>
                                    <td>
                                        <Button
                                          onClick={() => this.removeItem(item._index)} 
                                          bsSize='xsmall' 
                                          aria-label='Remove'>
                                            <Bootstrap.Glyphicon 
                                              glyph='remove' />
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
})

const ComplaintSubmitButtonGroup = React.createClass({
    render: function() {
        if (!this.props.visible)
            return <span />
        return (
            <div>
                {('Customer call' === this.props.activityType) ? (
                    <ProactiveInput />
                ) : <span />}
                <hr />
                <ButtonGroup>
                    <Button
                      bsStyle='primary'
                      onClick={this.props.onSubmit}>
                        <Bootstrap.Glyphicon 
                          glyph='ok' />
                        Confirm
                    </Button>
                    <Button
                      bsStyle='default'
                      onClick={this.props.close}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>
        )
    }
})

const ProactiveStore = assign({}, FormItemStore)

ProactiveStore.value = false

AppDispatcher.register(payload => {
    if ('complaint-form-proactive-assign' === payload.actionType) {
        ProactiveStore.setValue(payload.proactive)
    } else if ('complaint-form-reset' === payload.actionType) {
        ProactiveStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        ProactiveStore.refresh()
    }
})

const ProactiveInput = React.createClass({
    getInitialState: function() {
        return {value: ProactiveStore.getValue()}
    },
    updateValue: function() {
        this.setState({value: ProactiveStore.getValue()})
    },
    componentDidMount: function() {
        ProactiveStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        ProactiveStore.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update(false)
    },
    _update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-proactive-assign',
            proactive  : value
        })
    },
    render: function() {
        return (
            <Input
              ref='proactive'
              wrapperClassName='help-pull-right'
              label='Proactive'
              help='Check if call was made by the user.' 
              type='checkbox' 
              onChange={this.handleChange}
              value={this.state.proactive} />
        )
    }
})

const QualityComplaintRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            selection  : [],
            btnVisible : false
        }
    },
    handleSubmit: function() {
        let products = this.state.selection
        let items = products.map(item => {
            let complaintItem = {
                'quantity'    : item.quantity,
                'batch'       : item.batch,
                'comment'     : item.comment,
                '_links'      : {
                    'product' : item.product['_links']['self']
                }
            }
            DataStore.store.embed(complaintItem, 'product')
            return complaintItem
        })
        let complaint = {
            'created'      : Date.now(),
            'customerName' : this.props.customer.name, 
            'type'         : 'quality',
            'user'         : 'Demo user',
            'items'        : items,
            '_links'       : {
                'customer'    : { href: this.props.customer.id },
                '_collection' : { href: this.props.customer.id }
            }
        }
        DataStore.store.embed(complaint, 'customer')
        let activity = {
            'type'     : 'complaint-register',
            'activity' : this.props.activityType,
            'created'  : Date.now(),
            '_links'   : {
                '_collection' : { href: this.props.customer.id }
            }
        }
        if ('Customer call' === this.props.activityType) {
            activity.proactive = !!ProactiveStore.getValue()
        }
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method     : 'POST',
                resource   : 'complaints', 
                payload    : complaint
            },
            activity   : activity
        })
        this.props.close()
    },
    updateProductSelection: function() {
        let collection = ProductSelectionStore.collection()
        this.setState({
            btnVisible : !!collection.length,
            selection  : collection
        })
    },
    componentDidMount: function() {
        ProductSelectionStore.on('change', this.updateProductSelection)
    },
    componentWillUnmount: function() {
        ProductSelectionStore.removeListener('change', this.updateProductSelection)
    },
    render: function() {
        return (
            <div>
                <ComplaintProductsComponent
                  products={this.state.selection} />
                <ItemForm 
                  ref='form'
                  label={this.state.selection.length ? 'Add another product' : 'Add a product'} />
                <ComplaintSubmitButtonGroup
                  activityType={this.props.activityType}
                  onSubmit={this.handleSubmit}
                  close={this.props.close}
                  visible={this.state.btnVisible} />
            </div>
        )
    }
})

const QualityComplaintModal = React.createClass({
    componentDidMount: function() {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-init'
        })
    },
    render: function() {
        return (
            <Modal
              show={this.props.visible}
              onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Register quality complaint
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <QualityComplaintRegistrationForm 
                      customer={this.props.customer}
                      activityType={this.props.activityType}
                      close={this.props.close} />
                </Modal.Body>
            </Modal>
        )
    }
})
 
module.exports = QualityComplaintModal
