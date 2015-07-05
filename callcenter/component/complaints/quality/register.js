var React         = require('react');
var Bootstrap     = require('react-bootstrap');
var DateTimeField = require('react-bootstrap-datetimepicker');
var Griddle       = require('griddle-react');
var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var DataStore     = require('../../../store/DataStore');

var Button        = Bootstrap.Button;
var Col           = Bootstrap.Col;
var Input         = Bootstrap.Input;
var ListGroup     = Bootstrap.ListGroup;
var ListGroupItem = Bootstrap.ListGroupItem;
var Row           = Bootstrap.Row;
var Table         = Bootstrap.Table;

var QuantityInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            validState: null,
            hint: null
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
        var value = this.refs.input.getValue();
        this.setValue(value);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null;
        if ('' == value) {
            validState = 'error';
            hint = 'This field is required';
        }
        if (isNaN(value) || (value % 1 !== 0)) {
            validState = 'error';
            hint = 'The value is not an integer';
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    render: function() {
        return (
            <Input 
                type="text"
                value={this.state.value}
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} 
                placeholder="The number of products affected"
                label="Quantity" />
        );
    }
});

var BatchInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            validState: null,
            hint: null
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
        var value = this.refs.input.getValue();
        this.setValue(value);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null
            length = value.length;
        if (0 == length) {
            validState = 'error';
            hint = 'This field is required';
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    render: function() {
        return (
            <Input 
                type="text"
                value={this.state.value}
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} 
                placeholder="The batch to which the product belongs"
                label="Batch number" />
        );
    }
});

var CommentInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            validState: null,
            hint: null
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
        var value = this.refs.input.getValue();
        this.setValue(value);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null
            length = value.length;
        if (0 == length) {
            validState = 'error';
            hint = 'This field is required';
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    render: function() {
        return (
            <Input 
                type="textarea"
                value={this.state.value}
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} 
                placeholder="A short description of the defect or problem with the product"
                label="Comment" />
        );
    }
});

var ProductInput = React.createClass({
    fetchProducts: function() {
        var products = DataStore.fetchCollection('products');
        this.setState({products: products});
    },
    getInitialState: function() {
        return {
            value: '',
            validState: null,
            hint: null,
            suggestions: [],
            fresh: true
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
        var value = this.refs.input.getValue();
        this.setValue(value);
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null,
            found = null,
            length = value.length;
        if (length <= 2) {
            validState = 'error';
            hint = 'This field is required.';
        } else {
            var products = this.state.products,
                suggestions = [];
            for (var i = 0; i < products.length; i++) {
                var product = products[i];
                if (product.name == value || product.sku == value) {
                    found = product;
                    break;
                }
                var name = product.name.toLowerCase(),
                    sku = product.sku.toLowerCase(),
                    val = value.toLowerCase();
                if (-1 !== name.indexOf(val) || -1 !== sku.indexOf(val)) {
                    suggestions.push(product);
                }
            }
            if (i == products.length) {
                validState = 'warning';
            } else {
                suggestions = [];
            }
        }
        var fresh = this.state.fresh;
        if (fresh && 'success' === validState) {
            this.props.handleFresh();
            fresh = false;
        }
        this.setState({
            validState  : validState,
            hint        : hint,
            suggestions : suggestions,
            fresh       : fresh,
            product     : found
        });
        return (validState === 'success');
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    componentDidMount: function() {
        this.fetchProducts();
        DataStore.on('change', this.fetchProducts);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchProducts);
    },
    suggestionsTable: function() {
        var suggestions = this.state.suggestions;
        if (!suggestions || !suggestions.length)
            return <span />;
        var i = 0;
        return (
            <Table bordered condensed hover className="type-ahead" style={{marginTop: '-16px', border: '2px solid #dce4ec'}}>
                <tbody>
                    {suggestions.map(function(item) {
                        return (
                            <tr
                                key={i++} 
                                onClick={this.setValue.bind(null, item.name)}>
                                <td>{item.name}</td>
                                <td>{item.sku}</td>
                            </tr> 
                        );
                    }.bind(this))}
                </tbody>
            </Table>
        );
    },
    render: function() {
        return (
            <div>
                <Input 
                    type="text"
                    label={this.props.label}
                    value={this.state.value}
                    help={this.state.hint}
                    placeholder="The name or SKU of the concerned product"
                    bsStyle={this.state.validState}
                    hasFeedback
                    ref="input"
                    onChange={this.handleChange} />
                {this.suggestionsTable()}
            </div>
        );
    }
});

var ItemForm = React.createClass({
    handleAddItem: function() {
        if (this.isValid()) {
            this.props.onProductAdded({
                comment  : this.refs.commentInput.state.value,
                quantity : this.refs.quantityInput.state.value,
                batch    : this.refs.batchInput.state.value,
                product  : this.refs.productInput.state.product
            });
            this.resetForm();
        }
    },
    getInitialState: function() {
        return {
            expanded: false
        };
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
    isValid: function() {
        return (this.refs.productInput.isValid()
              & this.refs.batchInput.isValid()
              & this.refs.quantityInput.isValid()
              & this.refs.commentInput.isValid());
    },
    resetForm: function() {
        this.refs.productInput.reset();
        this.refs.batchInput.reset();
        this.refs.quantityInput.reset();
        this.refs.commentInput.reset();
        this.setState({expanded: false});
    },
    render: function() {
        var form = <span />;
        if (this.state.expanded) {
            form = (
                <div>
                    <Row>
                        <Col md={6}><BatchInput ref="batchInput" /></Col>
                        <Col md={6}><QuantityInput ref="quantityInput" /></Col>
                    </Row>
                    <CommentInput ref="commentInput" />
                    <Button 
                        bsStyle="primary" 
                        bsSize="medium" 
                        onClick={this.handleAddItem}
                        block>
                        Add product
                    </Button>
                </div>
            );
        }
        return (
            <div style={{marginTop: '1em'}}>
                <ProductInput 
                    ref="productInput"
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
            products: [],
            saveButtonVisible: false
        };
    },
    handleSubmit: function() {
        var products = this.state.products,
            items = [];
        for (var i = 0; i < products.length; i++) {
            var item = products[i];
            items.push({
                "quantity"  : item.quantity,
                "batch"     : item.batch,
                "comment"   : item.comment,
                "_links" : {
                    "product": item.product['_links']['self']
                }
            });
        }
        var complaint = {
            "created"   : this.refs.dateTimeInput.props.dateTime,
            "type"      : 'quality',
            "_links"    : {
                "customer": this.props.customer['_links']['self']
            },
            "_embedded" : {"items": items}
        };
        AppDispatcher.dispatch({
            actionType : 'create-complaint',
            complaint  : complaint
        });
        this.refs.form.collapse();
        this.setState(this.getInitialState());
        window.location.hash = 'complaints';
    },
    handleAddItem: function(product) {
        var products = this.state.products;
        products.push(product);
        this.setState({
            products: products,
            saveButtonVisible: !!products.length
        });
    },
    handleRemoveItem: function(sku) {
        var items = this.state.products;
        for (var i = 0; i < items.length; i++) {
            if (items[i].product.sku === sku) {
                items.splice(i, 1);
                break;
            }
        }
        this.setState({
            products: items,
            saveButtonVisible: !!items.length
        });
    },
    renderProducts: function() {
        var products = this.state.products;
        if (!products || !products.length) {
            return (
                <span />
            );
        }
        return (
            <div>
                <label style={{marginTop: '1em'}}>Products</label>
                <Table striped bordered condensed>
                    <col width="250" />
                    <col width="110" />
                    <col width="110" />
                    <col />
                    <col width="100" />
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
                                <tr key={item.product.sku}>
                                    <td>{item.product.name}</td>
                                    <td>{item.batch}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.comment}</td>
                                    <td>
                                        &nbsp;<button onClick={this.handleRemoveItem.bind(this, item.product.sku)} type="button" className="btn btn-default btn-xs" aria-label="Remove">
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                            &nbsp;Remove
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
    renderButton: function() {
        if (!this.state.saveButtonVisible)
            return <span />;
        return (
            <div>
                <hr />
                <Button
                    bsStyle="primary"
                    onClick={this.handleSubmit}>
                    Save
                </Button>
            </div>
        );
    },
    render: function() {
        return (
            <div>
                <label>Created</label>
                <DateTimeField 
                    ref="dateTimeInput" />
                {this.renderProducts()}
                <ItemForm 
                    ref="form"
                    onProductAdded={this.handleAddItem} 
                    label={this.state.products.length ? 'Add another product' : 'Add a product'} />
                {this.renderButton()}
            </div>
        );
    }
});

module.exports = QualityComplaintRegistrationForm;
