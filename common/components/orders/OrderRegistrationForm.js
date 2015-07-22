var Bootstrap           = require('react-bootstrap');
var DateTimeField       = require('react-bootstrap-datetimepicker');
var EventEmitter        = require('events').EventEmitter;
var React               = require('react');
var assign              = require('object-assign');
var ProductInput        = require('../products/ProductInput');
var DataStore           = require('../../store/DataStore');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');

var Panel               = Bootstrap.Panel;
var Table               = Bootstrap.Table;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Input               = Bootstrap.Input;

var ProductStore = assign({}, EventEmitter.prototype, {

    _product: null,

    setProduct: function(product) {
        this._product = product;
        this.emit('change');
    },

    product: function() {
        return this._product;
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
    onProductChange: function() {
        if (this.state.value)
            this.forceValidate();
    },
    componentDidMount: function() {
        this.onProductChange();
        ProductStore.on('change', this.onProductChange);
    },
    componentWillUnmount: function() {
        ProductStore.removeListener('change', this.onProductChange);
    },
    _update: function() {
        var product = ProductStore.product(),
            stock = product.getEmbedded('stock');
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
        } else if (stock && stock.available <= 0) {
            validationState = 'error'; 
            hint = 'This item appears to be out of stock.';
        } else if (stock && newValue > stock.available) {
            validationState = 'error'; 
            hint = 'This quantity exceeds available stock (' + stock.available + ' items).';
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
              placeholder='The number of products to add'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        );
    }
});

var ItemForm = React.createClass({
    handleAddItem: function() {
        var isValid = (this.refs.quantityInput.isValid()
                & this.refs.productInput.isValid());
        if (!isValid) {
            this.refs.quantityInput.forceValidate();
            this.refs.productInput.forceValidate();
        } else {
            this.props.onProductAdded({
                quantity : this.refs.quantityInput.state.value,
                product  : this.refs.productInput.state.product
            });
            this.resetForm();
        }
    },
    getInitialState: function() {
        return {
            expanded : false
        };
    },
    handleChange: function(item) {
        AppDispatcher.dispatch({
            actionType : 'order-product-select',
            product    : item 
        });
    },
    resetForm: function() {
        this.refs.productInput.reset();
        this.refs.quantityInput.reset();
        this.setState(this.getInitialState());
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
        var allProducts = this.props.products;
        var selectedProducts = this.props.selectedProducts;
        var skus = selectedProducts.map(function(item) {
            return item.product.sku;
        });
        var filtered = allProducts.filter(function(item) {
            return (-1 === skus.indexOf(item.sku));
        });

        var form = <span />;
        if (true === this.state.expanded) {
            form = (
                <div>
                    <QuantityInput ref='quantityInput' />
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
                  products={filtered}
                  onChange={this.handleChange}
                  label={this.props.label}
                  handleFresh={this.expand} />
                {form}
            </div>
        );
    }
});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'order-product-select':
            ProductStore.setProduct(payload.product);
            break;
        default:
            break;
    }
});

var OrderRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            selectedProducts  : [],
            products          : [],
            saveButtonVisible : false,
            total             : 0,
            created           : String(Date.now())
        };
    },
    componentDidMount: function() {
        var products = DataStore.fetchCollection('products');
        this.setState({products: products});
    },
    handleSubmit: function() {
        var products = this.state.selectedProducts,
            items = [];
        for (var i = 0; i < products.length; i++) {
            var item = products[i];
            items.push({
                'quantity'    : item.quantity,
                'price'       : item.price,
                'productName' : item.product.name,
                'productSku'  : item.product.sku,
                '_links' : {
                    'product': item.product['_links']['self']
                }
            });
        }
        var customerHref = this.props.customer['_links']['self'];
        var order = {
            'created'      : this.state.created,
            'customerName' : this.props.customer.name, 
            'total'        : this.computeTotal(products),
            '_links'       : {
                'customer'    : customerHref,
                '_collection' : customerHref
            },
            '_embedded'    : {
                'items': items
            }
        };
        DataStore.store.embed(order, 'customer');
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method     : 'POST',
                resource   : 'orders', 
                payload    : order 
            },
            activity   : {
                'type'     : 'order-create',
                'activity' : this.props.activityType,
                'created'  : Date.now(),
                '_links'   : {
                    '_collection' : customerHref
                }
            }
        });
        this.props.close();
    },
    computeTotal: function(products) {
        var total = 0;
        for (var i = 0; i < products.length; i++) {
            if ('-' !== products[i].price) {
                total += products[i].price;
            } else {
                total = 'Not available';
                break;
            }
        }
        return total;
    },
    handleAddItem: function(item) {
        var products      = this.state.selectedProducts,
            priceCategory = this.props.customer.priceCategory,
            price         = null,
            itemPrice     = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].product.sku === item.product.sku) {
                var qty = Number(products[i].quantity) + Number(item.quantity);
                products[i].quantity = qty;
                if ('Not available' !== products[i].itemPrice) 
                    products[i].price = products[i].itemPrice * qty;
                break;
            }
        }
        if (i === products.length) {
            if (item.product.hasOwnProperty('_embedded') && item.product['_embedded'].hasOwnProperty('prices')) {
                itemPrice = item.product['_embedded']['prices'][priceCategory];
            }
            if (itemPrice) {
                price = itemPrice * item.quantity;
            } else {
                price = '-';
                itemPrice = 'Not available';
            }
            item.price = price;
            item.itemPrice = itemPrice;
            products.push(item);
        }
        this.setState({
            selectedProducts  : products,
            saveButtonVisible : !!products.length,
            total             : this.computeTotal(products)
        });
    },
    handleChangeCreated: function(time) {
        this.setState({created: String(time)});
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
            selectedProducts  : items,
            saveButtonVisible : !!items.length,
            total             : this.computeTotal(items)
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
                    <col width='100' />
                    <col width='110' />
                    <col width='100' />
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Item price</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(function(item) {
                            return (
                                <tr key={i++}>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.sku}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.itemPrice}</td>
                                    <td>{item.price}</td>
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
                    <tfoot>
                        <tr>
                            <td colSpan={4}>
                                Total
                            </td>
                            <td colSpan={2}>
                                <b>{this.state.total}</b>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        );
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
                      onChange={this.handleChangeCreated}
                      dateTime={this.state.created}
                      ref='dateTimeInput' />
                </div>
                {this.renderProducts()}
                <ItemForm 
                  ref='form'
                  products={this.state.products}
                  selectedProducts={this.state.selectedProducts}
                  onProductAdded={this.handleAddItem} 
                  label={this.state.selectedProducts.length ? 'Add another product' : 'Add a product'} />
                {this.renderButton()}
            </div>
        );
    }
});

module.exports = OrderRegistrationForm;
