var Bootstrap     = require('react-bootstrap');
var React         = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher');
var DataStore     = require('../../store/DataStore');

var Button        = Bootstrap.Button;
var Input         = Bootstrap.Input;
var Panel         = Bootstrap.Panel;

var NameInput = React.createClass({
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
        this.setValue(this.refs.input.getValue());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null
            length = value.length;
        if (length < 3) {
            validState = 'error';
            if (length > 0) {
                hint = 'The name is too short.';
            } else {
                hint = 'This field is required.';
            }
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        return (
            <Input 
                type="text"
                value={this.state.value}
                placeholder="The name of the customer"
                help={this.state.hint}
                label="Name"
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} />
        );
    }
});

var AddressInput = React.createClass({
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
        this.setValue(this.refs.input.getValue());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null
            length = value.length;
        if (length == 0) {
            validState = 'error';
            hint = 'This field is required.';
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        return (
            <Input 
                type="text"
                label="Address"
                value={this.state.value}
                placeholder="The customer's address"
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} />

        );
    }
});

var TinInput = React.createClass({
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
        this.setValue(this.refs.input.getValue());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null
            length = value.length;
        if (length == 0) {
            validState = 'error';
            hint = 'This field is required.';
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        return (
            <Input 
                type="text"
                label="TIN"
                value={this.state.value}
                placeholder="Taxpayer identification number"
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} />
        );
    }
});

var PhoneInput = React.createClass({
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
        this.setValue(this.refs.input.getValue());
    },
    isValid: function(value) {
        if (!value)
            value = this.refs.input.getValue();
        var validState = 'success',
            hint = null
            length = value.length;
        if (length == 0) {
            validState = 'error';
            hint = 'This field is required.';
        }
        this.setState({
            validState: validState,
            hint: hint
        });
        return (validState === 'success');
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        return (
            <Input 
                type="text"
                value={this.state.value}
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                placeholder="The customer's phone number"
                label="Phone number"
                ref="input" 
                onChange={this.handleChange} />
        );
    }
});

var AreaSelect = React.createClass({
    fetchAreas: function() {
        var areas = DataStore.fetchCollection('areas');
        if (!areas || !areas.length) {
            areas = [{
                "name": "Global", 
                "_links": { "self": {"href": "global"} }
            }];
        }
        this.setState({
            areas: areas
        });
    },
    getInitialState: function() {
        return {
            areas: []
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
        this.setValue(this.refs.input.getValue());
    },
    isValid: function() {
        return true;
    },
    reset: function() {
        this.setState(this.getInitialState());
        this.fetchAreas();
    },
    componentDidMount: function() {
        this.fetchAreas();
        DataStore.on('change', this.fetchAreas);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchAreas);
    },
    render: function() {
        var areas = this.state.areas;
        return (
            <Input 
                type="select"
                label="Area"
                value={this.state.value}
                ref="input"
                onChange={this.handleChange}>
                {areas.map(function(area) {
                    return (
                        <option 
                            key={area['_links']['self'].href} 
                            value={area.name}>
                            {area.name}
                        </option>
                    );
                })}
            </Input>
        );
    }
});

var PriceCategorySelect = React.createClass({
    fetchCategories: function() {
        var categories = DataStore.fetchCollection('price-categories');
        if (!categories || !categories.length) {
            categories = [{
                "name": "Default", 
                "_links": { "self": {"href": "default"} }
            }];
        }
        this.setState({
            categories: categories
        });
    },
    getInitialState: function() {
        return {
            categories: []
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
        this.setValue(this.refs.input.getValue());
    },
    isValid: function() {
        return true;
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    componentDidMount: function() {
        this.fetchCategories();
        DataStore.on('change', this.fetchCategories);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCategories);
    },
    render: function() {
        var categories = this.state.categories;
        return (
            <Input 
                type="select"
                label="Price category"
                value={this.state.value}
                ref="input"
                onChange={this.handleChange}>
                {categories.map(function(category) {
                    return (
                        <option 
                            key={category['_links']['self'].href} 
                            value={category.name}>
                            {category.name}
                        </option>
                    );
                })}
            </Input>
        );
    }
});

var StatusComponent = React.createClass({
    getInitialState: function() {
        return {
            value: false
        };
    },
    toggleActive: function() {
        var newValue = !this.state.value;
        this.setState({value: newValue});
        AppDispatcher.dispatch({
            actionType: 'toggle-customer-active',
            patch: {
                customerId: this.props.customerId,
                data: {
                    active: newValue
                }
            }
        });
    },
    setValue: function(value) {
        this.setState({value: value});
    },
    panel: function() {
        if (true === this.state.value) {
            return (
                <Panel>
                    <span className="label label-success">Active</span>
                    &nbsp;&nbsp;<a href="#" onClick={this.toggleActive}>Deactivate this customer</a>
                </Panel>
            );
        } else {
            return (
                <Panel>
                    <span className="label label-default">Dormant</span>
                    &nbsp;&nbsp;<a href="#" onClick={this.toggleActive}>Activate this customer</a>
                </Panel>
            );
        }
    },
    render: function() {
        return (
            <div>
                {this.panel()}
            </div>
        );
    }
});

var CustomerEditForm = React.createClass({
    handleSubmit: function() {
        if (this.isValid()) {
            AppDispatcher.dispatch({
                actionType: 'update-customer',
                update: {
                    customerId: this.props.customerId,
                    data: {
                        name          : this.refs.customerName.state.value,
                        address       : this.refs.customerAddress.state.value,
                        tin           : this.refs.customerTin.state.value,
                        phone         : this.refs.customerPhone.state.value,
                        area          : this.refs.customerArea.state.value,
                        priceCategory : this.refs.customerPriceCategory.state.value,
                        active        : this.refs.customerStatus.state.value
                    }
                }
            });
        }
    },
    isValid: function() {
        return (this.refs.customerName.isValid()
              & this.refs.customerAddress.isValid()
              & this.refs.customerTin.isValid()
              & this.refs.customerPhone.isValid()
              & this.refs.customerArea.isValid()
              & this.refs.customerPriceCategory.isValid());
    },
    fetchCustomerData: function() {
        var customer = DataStore.store.getItem('customers/' + this.props.customerId);
        this.refs.customerStatus.setValue(customer.active);
        this.refs.customerName.setValue(customer.name);
        this.refs.customerAddress.setValue(customer.address);
        this.refs.customerTin.setValue(customer.tin);
        this.refs.customerPhone.setValue(customer.phone);
        this.refs.customerArea.setValue(customer.area);
        this.refs.customerPriceCategory.setValue(customer.priceCategory);
    },
    componentDidMount: function() {
        this.fetchCustomerData();
    },
    cancelEdit: function() {
        window.location.hash = 'customers';
    },
    render: function() {
        return (
            <div>
               <Panel>
                    <StatusComponent 
                        customerId={this.props.customerId}
                        ref="customerStatus" />
                    <NameInput 
                        ref="customerName" />
                    <AddressInput 
                        ref="customerAddress" />
                    <TinInput 
                        ref="customerTin" />
                    <PhoneInput 
                        ref="customerPhone" />
                    <AreaSelect 
                        ref="customerArea" />
                    <PriceCategorySelect 
                        ref="customerPriceCategory" />
                    <hr />
                    <Button
                        bsStyle="primary"
                        onClick={this.handleSubmit}>
                        Save
                    </Button>
                    &nbsp;<Button
                        bsStyle="default"
                        onClick={this.cancelEdit}>
                        Cancel
                    </Button>
                </Panel>
            </div>
        );
    }
});

module.exports = CustomerEditForm;
