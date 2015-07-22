var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var DateTimeField       = require('react-bootstrap-datetimepicker');
var ProductInput        = require('../products/ProductInput');
var DataStore           = require('../../store/DataStore');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');

var Panel               = Bootstrap.Panel;
var Table               = Bootstrap.Table;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Input               = Bootstrap.Input;

var BatchInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            hint            : null,
            validationState : null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function() {
        var newValue = this.refs.input.getValue(),
            hint = null,
            validationState = null,
            length = newValue.length;
        if (length) { 
            validationState = 'success'; 
        } else {
            validationState = 'error'; 
            hint = 'This value is required.';
        }
        this.setState({
            value           : newValue,
            hint            : hint,
            validationState : validationState
        }); 
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
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
        );
    }
});

var QuantityInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            hint            : null,
            validationState : null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function() {
        var newValue = this.refs.input.getValue(),
            intValue = parseInt(newValue),
            hint = null,
            validationState = null;
        if (newValue && (isNaN(intValue) || intValue <= 0)) { 
            validationState = 'error'; 
            hint = 'The value must be a positive integer.';
        } else if (!intValue) {
            validationState = 'error'; 
            hint = 'This value is required.';
        } else {
            validationState = 'success'; 
        }
        this.setState({
            value           : newValue,
            hint            : hint,
            validationState : validationState
        }); 
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
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
        );
    }
});

var CommentInput = React.createClass({
    getInitialState: function() {
        return {
            value           : '',
            hint            : null,
            validationState : null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function() {
        var newValue = this.refs.input.getValue(),
            hint = null,
            validationState = null,
            length = newValue.length;
        if (length) { 
            validationState = 'success'; 
        } else {
            validationState = 'error'; 
            hint = 'This value is required.';
        }
        this.setState({
            value           : newValue,
            hint            : hint,
            validationState : validationState
        }); 
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
    },
    render: function() {
        return (
            <Input
              label='Comment'
              ref='input'
              value={this.state.value}
              placeholder='A short description of the defect or problem with the product'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='textarea' />
        );
    }
});

var ItemForm = React.createClass({
    handleAddItem: function() {
        var isValid = (this.refs.commentInput.isValid()
                & this.refs.quantityInput.isValid()
                & this.refs.batchInput.isValid()
                & this.refs.productInput.isValid());
        if (!isValid) {
            this.refs.commentInput.forceValidate();
            this.refs.quantityInput.forceValidate();
            this.refs.batchInput.forceValidate();
            this.refs.productInput.forceValidate();
        } else {
            this.props.onProductAdded({
                comment  : this.refs.commentInput.state.value,
                quantity : this.refs.quantityInput.state.value,
                batch    : this.refs.batchInput.state.value,
                product  : this.refs.productInput.state.product
            });
            this.resetForm();
        }
    },
    fetchProducts: function() {
        var products = DataStore.fetchCollection('products');
        this.setState({products: products});
    },
    componentDidMount: function() {
        this.fetchProducts();
    },
    getInitialState: function() {
        return {
            expanded : false,
            products : []
        };
    },
    resetForm: function() {
        this.refs.productInput.reset();
        this.refs.batchInput.reset();
        this.refs.quantityInput.reset();
        this.refs.commentInput.reset();
        this.setState(this.getInitialState());
        this.fetchProducts();
    },
    expand: function() {
        this.setState({expanded: true});
    },
    collapse: function() {
        if (true !== this.state.expanded)
            return;
        this.resetForm();
        this.setState({expanded: false});
    },
    render: function() {
        var form = <span />;
        if (true === this.state.expanded) {
            form = (
                <div>
                    <Bootstrap.Row>
                        <Bootstrap.Col md={6}><BatchInput ref='batchInput' /></Bootstrap.Col>
                        <Bootstrap.Col md={6}><QuantityInput ref='quantityInput' /></Bootstrap.Col>
                    </Bootstrap.Row>
                    <CommentInput ref='commentInput' />
                    <Button 
                      bsStyle='primary' 
                      bsSize='medium' 
                      onClick={this.handleAddItem}
                      block>
                        Add product
                    </Button>
                </div>
            );
        }
        return (
            <div>
                <ProductInput 
                  ref='productInput'
                  products={this.state.products}
                  label={this.props.label}
                  handleFresh={this.expand} />
                {form}
            </div>
        );
    }
});

var QualityComplaintRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            selectedProducts  : [],
            saveButtonVisible : false,
            created           : String(Date.now())
        };
    },
    handleSubmit: function() {
        var products = this.state.selectedProducts,
            items = [];
        for (var i = 0; i < products.length; i++) {
            var item = products[i];
            items.push({
                'quantity'  : item.quantity,
                'batch'     : item.batch,
                'comment'   : item.comment,
                '_links' : {
                    'product': item.product['_links']['self']
                }
            });
        }
        var customerHref = this.props.customer['_links']['self'];
        var complaint = {
            'created'   : this.state.created,
            'type'      : 'quality',
            '_links'    : {
                'customer'    : customerHref,
                '_collection' : customerHref
            },
            '_embedded' : {
                'items': items
            }
        };
        DataStore.store.embed(complaint, 'customer');
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method     : 'POST',
                resource   : 'complaints', 
                payload    : complaint
            },
            activity   : {
                'type'     : 'complaint-register',
                'activity' : this.props.activityType,
                'created'  : Date.now(),
                '_links'   : {
                    '_collection' : customerHref
                }
            }
        });
        this.props.close();
    },
    handleAddItem: function(product) {
        var products = this.state.selectedProducts;
        products.push(product);
        this.setState({
            selectedProducts  : products,
            saveButtonVisible : !!products.length
        });
    },
    handleRemoveItem: function(sku) {
        var items = this.state.selectedProducts;
        for (var i = 0; i < items.length; i++) {
            if (items[i].product.sku === sku) {
                items.splice(i, 1);
                break;
            }
        }
        this.setState({
            products          : items,
            saveButtonVisible : !!items.length
        });
    },
    renderProducts: function() {
        var products = this.state.selectedProducts;
        if (!products || !products.length) {
            return (
                <span />
            );
        }
        var i = 0;
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
                        {products.map(function(item) {
                            return (
                                <tr key={i++}>
                                    <td>{item.product.name}</td>
                                    <td>{item.batch}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.comment}</td>
                                    <td>
                                        <button 
                                          onClick={this.handleRemoveItem.bind(this, item.product.sku)} 
                                          type='button' 
                                          className='btn btn-default btn-xs' 
                                          aria-label='Remove'>
                                            <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        }.bind(this))}
                    </tbody>
                </Table>
            </div>
        );
    },
    onChange: function(time) {
        this.setState({
            created: time
        });
    },
    renderButton: function() {
        if (!this.state.saveButtonVisible)
            return <span />;
        return (
            <div>
                <hr />
                <Button
                  bsStyle='primary'
                  onClick={this.handleSubmit}>
                  Save
                </Button>
            </div>
        );
    },
    render: function() {
        return (
            <div>
                <div className='form-group'>
                    <label>Created</label>
                    <DateTimeField 
                      onChange={this.onChange}
                      dateTime={this.state.created}
                      ref='dateTimeInput' />
                </div>
                {this.renderProducts()}
                <ItemForm 
                  ref='form'
                  onProductAdded={this.handleAddItem} 
                  label={this.state.selectedProducts.length ? 'Add another product' : 'Add a product'} />
                {this.renderButton()}
            </div>
        );
    }
});

module.exports = QualityComplaintRegistrationForm;
