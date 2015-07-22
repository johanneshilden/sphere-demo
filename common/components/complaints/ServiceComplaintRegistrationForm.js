var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var DateTimeField       = require('react-bootstrap-datetimepicker');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');
var DataStore           = require('../../store/DataStore');

var Panel               = Bootstrap.Panel;
var Table               = Bootstrap.Table;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Input               = Bootstrap.Input;

var DescriptionInput = React.createClass({
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
    render: function() {
        return (
            <Input
              label='Name'
              ref='input'
              value={this.state.value}
              placeholder='A short description of the complaint'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='textarea' />
        );
    }
});

var ServiceComplaintRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            created: String(Date.now())
        }
    },
    handleSubmit: function() {
        var isValid = this.refs.descriptionInput.isValid();
        if (!isValid) {
            this.refs.descriptionInput.forceValidate();
        } else {
            var customerHref = this.props.customer['_links']['self'];
            var complaint = {
                'created'     : this.state.created,
                'description' : this.refs.descriptionInput.state.value,
                'type'        : 'service',
                '_links'      : {
                    'customer'    : customerHref,
                    '_collection' : customerHref
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
        }
    },
    onChange: function(time) {
        this.setState({
            created: time
        });
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
                <DescriptionInput 
                  ref='descriptionInput' />
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

module.exports = ServiceComplaintRegistrationForm;
