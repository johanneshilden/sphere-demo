import {Dispatcher}        from 'flux'
import EventEmitter        from 'events'
import React               from 'react'
import assign              from 'object-assign'

const BasketDispatcher = assign(new Dispatcher, {});

//const MyForm = React.createClass({
//    render: function() {
//        return (
//            <div>
//                {this.props.filterComponent}
//                {this.props.hasValidItem ? (
//                    <div 
//                      style     = {{marginTop: '1em'}}
//                      className = {'form-group has-feedback' + this.props.validState ? ' has-' + this.props.validState : ''}>
//                        <div className='row'>
//                            <div className='col-xs-4'>
//                                <input 
//                                  className    = 'form-control'
//                                  placeholder  = 'Quantity'
//                                  value        = {this.props.value}
//                                  defaultValue = {1}
//                                  onChange     = {this.props.onChange}
//                                  type         = 'text' />
//                                {this.props.hint ? (
//                                    <p className='help-block'>
//                                        {this.props.hint}
//                                    </p>
//                                ) : <span />}
//                            </div>
//                            <div className='col-xs-8'>
//                                <button 
//                                  className = 'btn btn-primary btn-block'
//                                  onClick   = {this.props.onItemSelected}>
//                                    <span 
//                                      className  = 'glyphicon glyphicon-plus-sign'
//                                      ariaHidden = 'true' />
//                                    Add item
//                                </button>
//                            </div>
//                        </div>
//                    </div>
//                ) : <span />}
//                {!this.props.selectionIsEmpty ? (
//                    <div>
//                        <hr />
//                        <button 
//                          className = 'btn btn-default btn-block'
//                          onClick   = {this.props.onSubmit}>
//                            <span 
//                              className  = 'glyphicon glyphicon-ok'
//                              ariaHidden = 'true' />
//                            Submit
//                        </button>
//                    </div>
//                ) : <span />}
//            </div>
//        )
//    }
//})
//
//const MyFilterComponent = React.createClass({
//    render: function() {
//        let feedback = ''
//        if (this.props.itemIsSelected) {
//            feedback = ' has-success'
//        } else if (this.props.results.length) {
//            feedback = ' has-warning'
//        } else if (this.props.value.length > 2) {
//            feedback = ' has-error'
//        }
//        return (
//            <div>
//                <div className={'form-group has-feedback' + feedback} style={{marginBottom: 0}}>
//                    <label htmlFor='cart-filter-input'>Add a product</label>
//                    <input 
//                      id        = 'cart-filter-input'
//                      className = 'form-control'
//                      value     = {this.props.value}
//                      onChange  = {this.props.onChange}
//                      type      = 'text' />
//                </div>
//                {this.props.results.length ? (
//                    <table className='table table-striped table-bordered cart-filter-results'>
//                        <tbody>
//                            {this.props.results.map(result => {
//                                return (
//                                    <tr 
//                                      style   = {{cursor: 'pointer'}}
//                                      onClick = {() => this.props.onSelectItem(result)}
//                                      key     = {result.key}>
//                                        {this.props.itemFields.map(field => {
//                                            return (
//                                                <td>{result.item[field]}</td>
//                                            )
//                                        })}
//                                    </tr>
//                                )
//                            })}
//                        </tbody>
//                        {this.props.hasMoreResults ? (
//                            <tfoot>
//                                <tr key={0} onClick={this.props.expandResults}>
//                                    <td colSpan='100'>
//                                        &hellip;&nbsp;show {this.props.more} more result{1 !== this.props.more ? 's' : ''}
//                                    </td>
//                                </tr>
//                            </tfoot>
//                        ) : null}
//                    </table>
//                ) : <span />}
//            </div>
//        )
//    }
//})
//
//const MyEditor = React.createClass({
//    focusInput: function(component) {
//        if (component)
//            React.findDOMNode(component).focus()
//    },
//    abortEdit: function(event) {
//        if (!event.relatedTarget || 'BUTTON' !== event.relatedTarget.nodeName) {
//            this.props.onUserAbort()
//        }
//    },
//    render: function() {
//        var btnClass 
//        switch (this.props.validState) { 
//            case 'success':
//                btnClass = 'success'
//                break
//            case 'error':
//                btnClass = 'danger'
//                break
//            default:
//                btnClass = 'primary'
//        }
//        if (this.props.editMode) {
//            return (
//                <div 
//                  style     = {{marginBottom: 0}}
//                  className = {'form-group has-feedback' + (this.props.validState ? ' has-' + this.props.validState : '')}>
//                    <div className='input-group input-group-sm'>
//                        <input 
//                          ref       = {this.focusInput}
//                          value     = {this.props.value}
//                          onChange  = {this.props.onChange}
//                          onBlur    = {this.abortEdit}
//                          className = 'form-control'
//                          type      = 'text' />
//                        <span className='input-group-btn'>
//                            <button 
//                              onClick   = {this.props.onUpdate}
//                              className = {'btn btn-' + btnClass}
//                              type      = 'button'>
//                                <span 
//                                  className  = 'glyphicon glyphicon-ok'
//                                  ariaHidden = 'true' />
//                                Update
//                            </button>
//                        </span>
//                    </div>
//                    {this.props.hint ? (
//                        <p className='help-block'>
//                            {this.props.hint}
//                        </p>
//                    ) : <span />}
//                </div>
//            )
//        } else {
//            return (
//                <div className='input-group input-group-sm'>
//                    <input readOnly
//                      className = 'form-control disabled'
//                      onClick   = {this.props.beginEdit}
//                      value     = {this.props.quantity}
//                      type      = 'text' />
//                </div>
//            )
//        }
//    }
//})
//
//const MyRow = React.createClass({
//    render: function() {
//        let diff = this.props.quantity - this.props.initialQty,
//            diffMsg = null
//        if (this.props.initialQty) {
//            if (diff > 0) {
//                diffMsg = '+' + diff
//            } else if (diff < 0) {
//                diffMsg = diff
//            }
//        }
//        return (
//            <tr>
//                {this.props.itemFields.map(field => {
//                    return (
//                        <td style={{verticalAlign: 'middle'}} key={field}>
//                            {this.props.item.hasOwnProperty(field) ? this.props.item[field] : <span />}
//                        </td>
//                    )
//                })}
//                <td style={{verticalAlign: 'middle'}}>
//                    {this.props.editor}
//                </td>
//                <td style={{verticalAlign: 'middle'}}>
//                    <button 
//                      className = 'btn btn-default btn-sm btn-block'
//                      onClick   = {this.props.removeItem}>
//                        <span 
//                          className  = 'glyphicon glyphicon-remove'
//                          ariaHidden = 'true' />
//                        Remove
//                    </button>
//                </td>
//                <td style={{verticalAlign: 'middle', textAlign: 'center'}}>
//                    {diffMsg}
//                </td>
//            </tr>
//        )
//    }
//})
//
//const MyContainer = React.createClass({
//    render: function() {
//        if (0 === this.props.selection.length) {
//            return (
//                <p>
//                    The selection is empty.
//                </p>
//            )
//        } else {
//            return (
//                <table className='table table-bordered'>
//                    <col width='350' />
//                    <col width='200' />
//                    <col width='200' />
//                    <thead>
//                        <tr>
//                            <th>Name</th>
//                            <th>SKU</th>
//                            <th>Quantity</th>
//                            <th colSpan='3' />
//                        </tr>
//                    </thead>
//                    <tbody>
//                        {this.props.selection}
//                    </tbody>
//                </table>
//            )
//        }
//    }
//})

const DefaultForm = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.filterComponent}
                {this.props.hasValidItem ? (
                    <div>
                        <input 
                          value    = {this.props.value}
                          onChange = {this.props.onChange}
                          type     = 'text' />
                        <span>
                            {this.props.hint} : {this.props.validState}
                        </span>
                        <button onClick={this.props.onItemSelected}>
                            Add item
                        </button>
                    </div>
                ) : <span />}
                {!this.props.selectionIsEmpty ? (
                    <button onClick={this.props.onSubmit}>
                        Submit
                    </button>
                ) : <span />}
            </div>
        )
    }
})

const DefaultFilterComponent = React.createClass({
    render: function() {
        return (
            <div>
                <input 
                  value    = {this.props.value}
                  onChange = {this.props.onChange}
                  type     = 'text' />
                <ul>
                    {this.props.results.map(result => {
                        return (
                            <li key={result.key}>
                                <button onClick={() => this.props.onSelectItem(result)}>
                                    {result.item.name}
                                </button>
                            </li>
                        )
                    })}
                    {this.props.hasMoreResults ? (
                        <li key={0}>
                            {this.props.more} more result{1 !== this.props.more ? 's' : ''}
                            <button onClick={this.props.expandResults}>
                                Show all
                            </button>
                        </li>
                    ) : null}
                </ul>
            </div>
        )
    }
})

const DefaultEditor = React.createClass({
    render: function() {
        if (this.props.editMode) {
            return (
                <div>
                    <div>
                        <input
                          value    = {this.props.value}
                          onChange = {this.props.onChange}
                          type     = 'text' />
                        <button 
                          onClick  = {this.props.onUpdate}>
                            Update
                        </button>
                        <button 
                          onClick  = {this.props.onUserAbort}>
                            Cancel
                        </button>
                    </div>
                    <div>
                        {this.props.validState}
                    </div>
                    <div>
                        {this.props.hint}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {this.props.quantity}
                    <button onClick={this.props.beginEdit}>
                        Edit
                    </button>
                </div>
            )
        }
    }
})

const DefaultRow = React.createClass({
    render: function() {
        let diff = this.props.quantity - this.props.initialQty,
            diffMsg = null
        if (diff > 0) {
            diffMsg = '+' + diff
        } else if (diff < 0) {
            diffMsg = diff
        }
        return (
            <tr>
                <td>
                    {this.props.item.name}
                </td>
                <td>
                    {this.props.editor}
                </td>
                <td>
                    {diffMsg}
                </td>
                <td>
                    <button onClick={this.props.removeItem}>
                        Remove
                    </button>
                </td>
            </tr>
        )
    }
})

const DefaultContainer = React.createClass({
    render: function() {
        if (0 === this.props.selection.length) {
            return (
                <div>
                    The selection is empty.
                </div>
            )
        } else {
            return (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Inital qty.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.selection}
                    </tbody>
                </table>
            )
        }
    }
})

const ItemSelectionStore = assign({}, EventEmitter.prototype, {

    _items      : {},
    _selection  : [],
    _filterKeys : [],
    _key        : 0,

    _rebuildIndices: function() {
        let i = 0
        this._selection.forEach(item => {
            item._index = i++
        })
        this.emit('change')
    },

    initialize: function(items, selection, keys) {
        this._items      = items
        this._selection  = selection
        this._filterKeys = keys
        this._selection.forEach(item => {
            item.qty  = Number(item.qty)
            item._key = this._key++
            this._items[item.id]._initialQty = item.qty
        })
        this._rebuildIndices()
    },

    getSelection: function() {
        return this._selection
    },

    searchItems: function(term) {
        let str = term.toLowerCase(),
            candidates = []
        for (var key in this._items) {
            let item = this._items[key]
            for (var i = 0; i < this._filterKeys.length; i++) {
                let compareKey = this._filterKeys[i]
                if (item.hasOwnProperty(compareKey) && -1 !== item[compareKey].toLowerCase().indexOf(str)) {
                    candidates.push({
                        key  : key,
                        item : item
                    })
                    break
                }
            }
        }
        return candidates
    },

    addItem: function(item, qty) {
        for (var key in this._selection) {
            let _item = this._selection[key]
            if (item.id === _item.id) {
                _item.qty += Number(qty)
                this.emit('change')
                this.emit('item-added')
                return
            }
        }
        this._selection.push({
            id     : item.id,
            qty    : Number(qty),
            _index : this._selection.length,
            _key   : this._key++
        })
        this.emit('change')
        this.emit('item-added')
    },

    removeItem: function(index) {
        this._selection.splice(index, 1)
        this._rebuildIndices()
    },

    updateItemQty: function(index, qty) {
        this._selection[index].qty = Number(qty)
        this.emit('change')
    }

})

BasketDispatcher.register(payload => {
    switch (payload.actionType) {
        case 'item-selection-initialize':
            ItemSelectionStore.initialize(payload.items, payload.selection, payload.keys)
            break
        case 'item-selection-add-item':
            if (payload.hasOwnProperty('key') && payload.hasOwnProperty('qty')) {
                let item = {
                    id   : payload.key,
                    data : ItemSelectionStore._items[payload.key]
                }
                ItemSelectionStore.addItem(item, payload.qty)
            } else {
                let item = ItemStore.getItem(),
                    qty  = QuantityStore.getValue()
                ItemSelectionStore.addItem(item, qty)
            }
            break
        case 'item-selection-remove-item':
            ItemSelectionStore.removeItem(payload.index)
            break
        case 'item-selection-update-quantity':
            ItemSelectionStore.updateItemQty(payload.index, payload.qty)
            break
        default:
    }
})

const QuantityStore = assign({}, EventEmitter.prototype, {

    _value : null,

    setValue: function(val) {
        this._value = Number(val)
        this.emit('change')
    },

    getValue: function() {
        return this._value
    }

})

BasketDispatcher.register(payload => {
    switch (payload.actionType) {
        case 'quantity-assign':
            QuantityStore.setValue(payload.quantity)
            break
    }
})

const FormComponent = React.createClass({
    getDefaultProps: function() {
        return {
            formComponent : DefaultForm,
            onSubmit      : function() { console.log('(Default submit handler.)') }
        }
    },
    getInitialState: function() {
        return {
            value      : '',
            hint       : '',
            validState : null,
            modified   : false
        }
    },
    itemSelected: function() {
        if ('success' !== this._update(this.state.value))
            return
        this.props.onItemSelected()
        this.setState(this.getInitialState())
    },
    handleChange: function(event) {
        let value = event.target.value
        this._update(value)
        BasketDispatcher.dispatch({
            actionType : 'quantity-assign',
            quantity   : value
        })
        this.setState({modified: true})
    },
    updateForm: function(hasValidItem) {
        if (true === hasValidItem)
            this.setState(this.getInitialState())
    },
    submitHandler: function() {
        this.props.onSubmit(ItemSelectionStore.getSelection().map(item => {
            return {
                id  : item.id,
                qty : item.qty
            }
        }))
    },
    componentDidMount: function() {
        ItemSelectionStore.on('change', this.refresh)
        ItemStore.on('change', this.updateForm)
    },
    componentWillUnmount: function() {
        ItemSelectionStore.removeListener('change', this.refresh)
        ItemStore.removeListener('change', this.updateForm)
    },
    refresh: function() {
        let value = this.state.value
        if (this.state.modified && value)
            this._update(value)
    },
    _update: function(value) {
        let hint  = '',
            state = 'success'
        if (value && (isNaN(value) || value <= 0 || value % 1 !== 0)) { 
            state = 'error' 
            hint  = 'The value must be a positive integer.' 
        } else if (!value) {
            state = 'error'
            hint  = 'This value is required.' 
        } else if ('function' === typeof this.props.validator) {
            let item = ItemStore.getItem(),
                currentQty = 0,
                initialQty = item.data._initialQty || 0
            for (var i = 0; i < ItemSelectionStore._selection.length; i++) {
                let _item = ItemSelectionStore._selection[i]
                if (item.id == _item.id) {
                    currentQty = _item.qty
                    break
                }
            }
            let result = this.props.validator(item.data, Number(value) + currentQty, initialQty)
            if (result) {
                state = result.state
                hint  = result.hint
            }
        }
        this.setState({
            value      : value,
            hint       : hint,
            validState : state
        })
        return state
    },
    render: function() {
        let MainForm = this.props.formComponent
        return (
            <MainForm 
              value            = {this.state.value}
              onChange         = {this.handleChange}
              onSubmit         = {this.submitHandler}
              hint             = {this.state.hint}
              validState       = {this.state.validState}
              onItemSelected   = {this.itemSelected}
              hasValidItem     = {this.props.hasValidItem}
              selectionIsEmpty = {this.props.selectionIsEmpty}
              filterComponent  = {
                  <ItemInput 
                    itemFields      = {this.props.itemFields}
                    maxResults      = {this.props.filterMaxResults}
                    minLength       = {this.props.filterMinStrLength}
                    filterComponent = {this.props.filterComponent} />
              } />
       )
    }
})

const ItemStore = assign({}, EventEmitter.prototype, {

    _item : null,

    getItem: function() {
        return this._item
    }

})

BasketDispatcher.register(payload => {
    switch (payload.actionType) {
        case 'item-assign':
            let key = payload.itemKey
            ItemStore._item = {
                id       : key,
                data     : ItemSelectionStore._items[key]
            }
            ItemStore.emit('change', true)
            break
        case 'item-reset':
            ItemStore._item = null
            ItemStore.emit('change', false)
            break
        default:
    }
})
 
const ItemInput = React.createClass({
    getDefaultProps: function() {
        return {
            maxResults : 15,
            minLength  : 2,
            filterComponent : DefaultFilterComponent
        }
    },
    getInitialState: function() {
        return {
            value       : '',
            candidates  : [],
            truncated   : 0,
            showAll     : false,
            selectedKey : null,
            currentItem : null
        }
    },
    updateCurrentItem: function() {
        this.setState({
            currentItem : ItemStore.getItem()
        })
    },
    componentDidMount: function() {
        ItemStore.on('change', this.updateCurrentItem)
        ItemSelectionStore.on('item-added', this.reset)
    },
    componentWillUnmount: function() {
        ItemStore.removeListener('change', this.updateCurrentItem)
        ItemSelectionStore.removeListener('item-added', this.reset)
    },
    reset: function() {
        this.setState(this.getInitialState())
    },
    handleChange: function(event) {
        let value = event.target.value,
            state = this.getInitialState()
        state.value = value
        if (value.length >= this.props.minLength) {
            let candidates = ItemSelectionStore.searchItems(value),
                diff = candidates.length - this.props.maxResults
            state.candidates = candidates
            state.truncated  = (this.props.maxResults > 0 && diff > 0) ? diff : 0
        }
        this.setState(state)
        BasketDispatcher.dispatch({
            actionType  : 'item-reset'
        })
    },
    selectItem: function(candidate) {
        this.setState({
            value       : candidate.item.name,
            candidates  : [],
            truncated   : 0,
            showAll     : false,
            selectedKey : candidate.key
        })
        BasketDispatcher.dispatch({
            actionType  : 'item-assign',
            itemKey     : candidate.key
        })
    },
    showAll: function() {
        this.setState({showAll: true})
    },
    render: function() {
        let i = 1,
            more = this.state.truncated,
            candidates = (!this.state.showAll && more > 0) 
                ? this.state.candidates.slice(0, this.props.maxResults) 
                : this.state.candidates,
            FilterComponent = this.props.filterComponent
        return (
            <FilterComponent 
              hasMoreResults = {!this.state.showAll && more}
              itemIsSelected = {!!this.state.selectedKey}
              itemFields     = {this.props.itemFields}
              value          = {this.state.value}
              more           = {more}
              expandResults  = {this.showAll}
              onSelectItem   = {this.selectItem}
              onChange       = {this.handleChange}
              results        = {candidates} />
        )
    }
})

const ItemSelector = React.createClass({
    getInitialState: function() {
        return {
            expanded : false
        }
    },
    handleAddEvent: function() {
        BasketDispatcher.dispatch({
            actionType : 'item-selection-add-item'
        })
        this.reset()
    },
    reset: function() {
        this.setState(this.getInitialState)
    },
    updateForm: function(hasValidItem) {
        this.setState({expanded: hasValidItem})
    },
    componentDidMount: function() {
        ItemStore.on('change', this.updateForm)
    },
    componentWillUnmount: function() {
        ItemStore.removeListener('change', this.updateForm)
    },
    render: function() {
        return (
            <FormComponent
              filterMaxResults   = {this.props.filterMaxResults}
              filterMinStrLength = {this.props.filterMinStrLength}
              itemFields         = {this.props.itemFields}
              formComponent      = {this.props.formComponent}
              filterComponent    = {this.props.filterComponent}
              selectionIsEmpty   = {this.props.selectionIsEmpty}
              validator          = {this.props.validator}
              hasValidItem       = {this.state.expanded}
              onSubmit           = {this.props.onSubmit}
              onItemSelected     = {this.handleAddEvent} />
        )
    }
})

const ItemWrapper = React.createClass({
    getDefaultProps: function() {
        return {
            rowComponent    : DefaultRow,
            editorComponent : DefaultEditor
        }
    },
    getInitialState: function() {
        return {
            editMode : false,
            input    : {
                value  : this.props.row.qty,
                hint   : '',
                state  : null
            }
        }
    },
    beginEdit: function() {
        let state = this.getInitialState()
        state.editMode = true
        this.setState(state)
    },
    endEdit: function() {
        this.setState(this.getInitialState())
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    _update: function(value) {
        let hint  = '',
            state = 'success'
        if (value && (isNaN(value) || value <= 0 || value % 1 !== 0)) { 
            state = 'error' 
            hint  = 'The value must be a positive integer.' 
        } else if (!value) {
            state = 'error'
            hint  = 'This value is required.' 
        } else if ('function' === typeof this.props.validator) {
            let initialQty = this.props.item._initialQty || 0,
                item = this.props.item
            let result = this.props.validator(item, Number(value), initialQty)
            if (result) {
                state = result.state
                hint  = result.hint
            }
        }
        this.setState({
            input : {
                value  : value,
                hint   : hint,
                state  : state 
            }
        })
        return state
    },
    updateItem: function() {
        if ('success' !== this._update(this.state.input.value)) 
            return
        BasketDispatcher.dispatch({
            actionType : 'item-selection-update-quantity',
            index      : this.props.row._index,
            qty        : this.state.input.value
        })
        this.setState(this.getInitialState())
    },
    removeItem: function() {
        if ('function' === typeof this.props.onRemove)
            this.props.onRemove(this.props.row._index)
    },
    render: function() {
        let row = this.props.row,
            Row = this.props.rowComponent,
            Editor = this.props.editorComponent
        return (
            <Row
              quantity    = {row.qty}
              initialQty  = {this.props.item._initialQty || 0}
              index       = {row._index}
              removeItem  = {this.removeItem}
              item        = {this.props.item} 
              itemFields  = {this.props.itemFields}
              editor      = {<Editor 
                  value       = {this.state.input.value}
                  hint        = {this.state.input.hint}
                  validState  = {this.state.input.state}
                  quantity    = {row.qty}
                  editMode    = {this.state.editMode}
                  beginEdit   = {this.beginEdit}
                  onUserAbort = {this.endEdit}
                  onChange    = {this.handleChange}
                  onUpdate    = {this.updateItem} />
              } />
        )
    }
})

const BasketComponent = React.createClass({
    getDefaultProps: function() {
        return {
            items              : {},
            selection          : [],
            containerComponent : DefaultContainer
        }
    },
    getInitialState: function() {
        return {
            selection : []
        }
    },
    fetchSelection: function() {
        this.setState({
            selection : ItemSelectionStore.getSelection()
        })
    },
    componentDidMount: function() {
        ItemSelectionStore.on('change', this.fetchSelection)
        BasketDispatcher.dispatch({
            actionType : 'item-selection-initialize',
            items      : this.props.items,
            selection  : this.props.selection,
            keys       : this.props.filterKeys
        })
    },
    componentWillUnmount: function() {
        ItemSelectionStore.removeListener('change', this.fetchSelection)
    },
    removeItem: function(index) {
        BasketDispatcher.dispatch({
            actionType : 'item-selection-remove-item',
            index      : index
        })
    },
    addItem: function(key, qty) {
        BasketDispatcher.dispatch({
            actionType : 'item-selection-add-item',
            key        : key,
            qty        : qty
        })
    },
    render: function() {
        let items = this.props.items, 
            selection = this.state.selection,
            Container = this.props.containerComponent
        if (0 === Object.keys(items).length) {
            return (
                <span>Empty data set.</span>
            )
        }
        return (
            <div>
                <Container 
                  selection = {selection.map(row => {
                      if (items.hasOwnProperty(row.id)) {
                          let item = items[row.id]
                          return (
                              <ItemWrapper
                                validator       = {this.props.validator}
                                itemFields      = {this.props.itemFields}
                                editorComponent = {this.props.editorComponent}
                                rowComponent    = {this.props.rowComponent}
                                row             = {row}
                                item            = {item}
                                key             = {row._key}
                                onRemove        = {this.removeItem} />
                          )
                      } else {
                          console.log('Invalid item key \'' + row.id + '\'.')
                      }
                  })} />
                <ItemSelector 
                  onSubmit           = {this.props.onSubmit}
                  filterMaxResults   = {this.props.filterMaxResults}
                  filterMinStrLength = {this.props.filterMinStrLength}
                  itemFields         = {this.props.itemFields}
                  formComponent      = {this.props.formComponent}
                  filterComponent    = {this.props.filterComponent}
                  selectionIsEmpty   = {!selection.length}
                  validator          = {this.props.validator} />
            </div>
        )
    }
})

module.exports = BasketComponent
