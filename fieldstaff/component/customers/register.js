var React         = require('react');
var Bootstrap     = require('react-bootstrap');
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
    getInitialState: function() {
        var areas = DataStore.fetchCollection('areas');
        if (!areas || !areas.length) {
            areas = [{
                "name": "Global", 
                "_links": { "self": {"href": "global"} }
            }];
        }
        return {
            areas: areas
        };
    },
    setValue: function(value) {
        this.setState({value: value});
        this.isValid(value);
    },
    handleChange: function() {
    },
    isValid: function() {
        return true;
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        var areas = this.state.areas;
        return (
            <Input 
                type="select"
                label="Area"
                ref="input">
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
    getInitialState: function() {
        var categories = DataStore.fetchCollection('price-categories');
        if (!categories || !categories.length) {
            categories = [{
                "name": "Default", 
                "_links": { "self": {"href": "default"} }
            }];
        }
        return {
            value: 'Default',
            categories: categories
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

var CustomerRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            template: ''
        };
    },
    handleSubmit: function() {
        if (this.isValid()) {
            AppDispatcher.dispatch({
                actionType: 'create-customer',
                customer: {
                    name          : this.refs.customerName.state.value,
                    address       : this.refs.customerAddress.state.value,
                    tin           : this.refs.customerTin.state.value,
                    phone         : this.refs.customerPhone.state.value,
                    area          : this.refs.customerArea.state.value,
                    priceCategory : this.refs.customerPriceCategory.state.value,
                    template      : this.state.template
                }
            });
            this.resetForm();
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
    resetForm: function() {
        this.refs.customerName.reset();
        this.refs.customerAddress.reset();
        this.refs.customerTin.reset();
        this.refs.customerPhone.reset();
        this.refs.customerArea.reset();
        this.refs.customerPriceCategory.reset();
        this.setState({template: ''});
    },
    fillOutPartial: function(customer) {
        this.refs.customerName.setValue(customer.name);
        this.refs.customerAddress.setValue(customer.address);
        this.refs.customerTin.reset();
        this.refs.customerPhone.setValue(customer.phone);
        this.refs.customerArea.reset();
        this.refs.customerPriceCategory.setValue(customer.priceCategory);
        this.setState({template: customer.href});
    },
    componentDidMount: function() {
        DataStore.on('register-partial', this.fillOutPartial);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('register-partial', this.fillOutPartial);
    },
    render: function() {
        return (
            <Panel>
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
                    onClick={this.resetForm}>
                    Reset
                </Button>
            </Panel>
        );
    }
});

module.exports = CustomerRegistrationForm;
