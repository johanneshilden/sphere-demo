var Bootstrap           = require('react-bootstrap');
var EventEmitter        = require('events').EventEmitter;
var Griddle             = require('griddle-react');
var React               = require('react');
var assign              = require('object-assign');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');
var DataStore           = require('../../store/DataStore');

var Panel               = Bootstrap.Panel;
var Table               = Bootstrap.Table;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Input               = Bootstrap.Input;

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var CustomerContactStore = assign({}, EventEmitter.prototype, {

    _contactType: '',

    setContactType: function(type) {
        this._contactType = type;
        this.emit('change');
    },

    contactType: function() {
        return this._contactType;
    }

});

var CustomerContactTypeInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        this.setState({
            value: newValue
        });
        AppDispatcher.dispatch({
            actionType: 'customer-contact-type-assign',
            contactType: newValue
        });
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        return (
            <Input 
              type='select'
              label='Contact type'
              value={this.state.value}
              ref='input'
              onChange={this.handleChange}>
                <option 
                  key='address'
                  value='Address'>
                  Address
                </option>
                <option 
                  key='phone'
                  value='Phone number'>
                  Phone number
                </option>
                <option 
                  key='email'
                  value='Email address'>
                  Email address
                </option>
                <option 
                  key='other'
                  value='Other'>
                  Other
                </option>
            </Input>
        );
    }
});

var CustomerContactInfoInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null,
            length = newValue.length;
        if (length) { 
            validationState = 'success'; 
            switch (CustomerContactStore.contactType()) {
               case 'Phone number':
                    if (!/^\+?[0-9\.\-\s]+$/.test(newValue)) {
                        validationState = 'error'; 
                        hint = 'Not a phone number.';
                    }
                    break;
                case 'Email address':
                    if (!validateEmail(newValue)) {
                        validationState = 'warning'; 
                        hint = 'Not a valid email address.';
                    }
                    break;
                case 'Address':
                default:
                    break;
            }
        } else {
            validationState = 'error'; 
            hint = 'This value is required.';
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        }); 
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
    },
    onContactTypeChange: function() {
        if (this.state.value) {
            this.forceValidate();
        } else {
            this.reset();
        }
    },
    componentDidMount: function() {
        CustomerContactStore.on('change', this.onContactTypeChange);
    },
    componentWillUnmount: function() {
        CustomerContactStore.removeListener('change', this.onContactTypeChange);
    },
    render: function() {
        var addon = null,
            placeholder = '';
        switch (CustomerContactStore.contactType()) {
            case 'Address':
                addon = (
                    <i className='fa fa-home fa-fw'></i>
                );
                placeholder = 'A street or postal address';
                break;
            case 'Phone number':
                addon = (
                    <i className='fa fa-phone fa-fw'></i>
                );
                placeholder = 'A phone number';
                break;
            case 'Email address':
                addon = (
                    <i className='fa fa-envelope-o fa-fw'></i>
                );
                placeholder = 'A valid email address';
                break;
            default:
                placeholder = 'Contact information associated with the customer';
                break;
        }
        return (
            <Input 
              addonBefore={addon}
              type='text'
              value={this.state.value}
              help={this.state.hint}
              bsStyle={this.state.validationState}
              hasFeedback
              placeholder={placeholder}
              label='Contact details'
              ref='input' 
              onChange={this.handleChange} />
        );
    }
});

var CustomerContactMetaInput = React.createClass({
    getInitialState: function() {
        return {
            value: ''
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        this.setState({
            value: newValue
        }); 
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        return (
            <Input 
              type='text'
              value={this.state.value}
              help={this.state.hint}
              hasFeedback
              placeholder='An optional comment or description of this contact detail'
              label='Comment'
              ref='input' 
              onChange={this.handleChange} />
        );
    }
});

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case 'customer-contact-type-assign':
            CustomerContactStore.setContactType(payload.contactType);
            break;
        default:
            break;
    }
});

var CustomerContactForm = React.createClass({
    componentDidMount: function() {
        AppDispatcher.dispatch({
            actionType: 'customer-contact-type-assign',
            contactType: 'Address'
        });
    },
    handleSubmit: function() {
        var isValid = this.refs.contactInfoInput.isValid();
        if (!isValid) {
            this.refs.contactInfoInput.forceValidate();
        } else {
            var customerHref = this.props.customer['_links']['self'];
            var contact = {
                'type'        : CustomerContactStore.contactType(),
                'info'        : this.refs.contactInfoInput.state.value,
                'meta'        : this.refs.contactMetaInput.state.value,
                '_links'      : {
                    'customer'    : customerHref,
                    '_collection' : customerHref
                }
            };
            AppDispatcher.dispatch({
                actionType : 'customer-activity',
                command    : {
                    method     : 'POST',
                    resource   : 'contacts', 
                    payload    : contact 
                },
                activity   : {
                    'type'     : 'contact-add',
                    'activity' : this.props.activityType,
                    'created'  : Date.now(),
                    '_links'   : {
                        '_collection' : customerHref
                    }
                }
            });
            this.props.close();
        }
    },
    render: function() {
        return (
            <div>
                <CustomerContactTypeInput 
                  ref='contactTypeInput' />
                <CustomerContactInfoInput 
                  ref='contactInfoInput' />
                <CustomerContactMetaInput 
                  ref='contactMetaInput' />
                <hr />
                <Bootstrap.ButtonGroup>
                    <Button
                      bsStyle='primary'
                      onClick={this.handleSubmit}>
                        Save
                    </Button>
                    <Button
                      bsStyle='default'
                      onClick={this.props.close}>
                        Cancel
                    </Button>
                </Bootstrap.ButtonGroup>
            </div>
        );
    }
});

module.exports = CustomerContactForm;
