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
        this.setState({areas: areas});
        if (!this.state.value) {
            this.setState({value: areas[0].name});
        }
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
        this.setState({categories: categories});
        if (!this.state.value) {
            this.setState({value: categories[0].name});
        }
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
        this.fetchCategories();
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

var CustomerRegistrationForm = React.createClass({
    handleSubmit: function() {
        if (this.isValid()) {
            var customer = {
                name          : this.refs.customerName.state.value,
                address       : this.refs.customerAddress.state.value,
                phone         : this.refs.customerPhone.state.value,
                area          : this.refs.customerArea.state.value,
                priceCategory : this.refs.customerPriceCategory.state.value
            };
            AppDispatcher.dispatch({
                actionType   : 'command-invoke',
                command      : {
                    method   : 'POST',
                    resource : 'registrations',
                    payload  : customer
                }
            });
            this.resetForm();
        }
    },
    isValid: function() {
        return (this.refs.customerName.isValid()
              & this.refs.customerAddress.isValid()
              & this.refs.customerPhone.isValid()
              & this.refs.customerArea.isValid()
              & this.refs.customerPriceCategory.isValid());
    },
    resetForm: function() {
        this.refs.customerName.reset();
        this.refs.customerAddress.reset();
        this.refs.customerPhone.reset();
        this.refs.customerArea.reset();
        this.refs.customerPriceCategory.reset();
    },
    render: function() {
        return (
            <Panel>
                <NameInput 
                    ref="customerName" />
                <AddressInput 
                    ref="customerAddress" />
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
