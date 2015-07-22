var React         = require('react');
var Bootstrap     = require('react-bootstrap');
var DateTimeField = require('react-bootstrap-datetimepicker');
var AppDispatcher = require('../../../dispatcher/AppDispatcher');
var DataStore     = require('../../../store/DataStore');

var Button        = Bootstrap.Button;
var Input         = Bootstrap.Input;

var DescriptionInput = React.createClass({
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
        if (!length) {
            hint = 'This field is required.';
            validState = 'error';
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
                type="textarea"
                value={this.state.value}
                placeholder="A short description of the complaint"
                help={this.state.hint}
                label="Description"
                bsStyle={this.state.validState}
                hasFeedback
                ref="input"
                onChange={this.handleChange} />
        );
    }
});

var ServiceComplaintRegistrationForm = React.createClass({
    handleSubmit: function() {
        if (this.isValid()) {
            var complaint = {
                "created"     : this.refs.dateTimeInput.props.dateTime,
                "description" : this.refs.descriptionInput.state.value,
                "type"        : 'service',
                "_links"      : {
                    "customer": this.props.customer['_links']['self']
                }
            };
            AppDispatcher.dispatch({
                actionType   : 'command-invoke',
                command      : {
                    method   : 'POST',
                    resource : 'complaints',
                    payload  : complaint
                }
            });
            window.location.hash = 'complaints';
        }
    },
    isValid: function() {
        return (this.refs.descriptionInput.isValid());
    },
    resetForm: function() {
        this.refs.descriptionInput.reset();
        this.refs.dateTimeInput.reset();
    },
    render: function() {
        return (
            <div>
                <DescriptionInput 
                    ref="descriptionInput" />
                <label>Created</label>
                <DateTimeField 
                    ref="dateTimeInput" />
                <hr />
                <Button
                    bsStyle="primary"
                    onClick={this.handleSubmit}>
                    Save
                </Button>
            </div>
        );
    }
});

module.exports = ServiceComplaintRegistrationForm;
