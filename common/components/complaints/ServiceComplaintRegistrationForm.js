var Bootstrap           = require('react-bootstrap')
var DateTimeField       = require('react-bootstrap-datetimepicker')
var Griddle             = require('griddle-react')
var React               = require('react')
var assign              = require('object-assign')

var AppDispatcher       = require('../../dispatcher/AppDispatcher')
var DataStore           = require('../../store/DataStore')
var FormElementMixin    = require('../FormElementMixin')
var FormItemStore       = require('../../store/FormItemStore')

var Button              = Bootstrap.Button
var Input               = Bootstrap.Input
var Modal               = Bootstrap.Modal
var Panel               = Bootstrap.Panel
var Table               = Bootstrap.Table

const DescriptionStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value.length) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('complaint-form-description-assign' === payload.actionType) {
        DescriptionStore.setValue(payload.value)
    } else if ('complaint-form-reset' === payload.actionType) {
        DescriptionStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        DescriptionStore.refresh()
    }
})

const DescriptionInput = React.createClass({
    mixins: [FormElementMixin],
    store: DescriptionStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-description-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input
              label='Description'
              ref='input'
              value={this.state.value}
              placeholder='A short description of the complaint'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='textarea' />
        )
    }
})

const ProactiveStore = assign({}, FormItemStore)

ProactiveStore.value = false

AppDispatcher.register(payload => {
    if ('complaint-form-proactive-assign' === payload.actionType) {
        ProactiveStore.setValue(payload.proactive)
    } else if ('complaint-form-reset' === payload.actionType) {
        ProactiveStore.reset()
    } else if ('complaint-form-refresh' === payload.actionType) {
        ProactiveStore.refresh()
    }
})

const ProactiveInput = React.createClass({
    getInitialState: function() {
        return {value: ProactiveStore.getValue()}
    },
    updateValue: function() {
        this.setState({value: ProactiveStore.getValue()})
    },
    componentDidMount: function() {
        ProactiveStore.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        ProactiveStore.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update(false)
    },
    _update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'complaint-form-proactive-assign',
            proactive  : value
        })
    },
    render: function() {
        return (
            <Input
              ref='proactive'
              wrapperClassName='help-pull-right'
              label='Proactive'
              help='Check if call was made by the user.' 
              type='checkbox' 
              onChange={this.handleChange}
              value={this.state.proactive} />
        )
    }
})

const ServiceComplaintRegistrationForm = React.createClass({
    handleSubmit: function() {
        let isValid = !!DescriptionStore.isValid()
        if (!isValid) {
            AppDispatcher.dispatch({
                actionType: 'complaint-form-refresh'
            })
        } else {
            let complaint = {
                'created'     : Date.now(),
                'description' : DescriptionStore.getValue(),
                'type'        : 'service',
                'user'        : 'Demo user',
                '_links'      : {
                    'customer'    : { href: this.props.customer.id },
                    '_collection' : { href: this.props.customer.id }
                }
            }
            DataStore.store.embed(complaint, 'customer')
            let activity = {
                'type'     : 'complaint-register',
                'activity' : this.props.activityType,
                'created'  : Date.now(),
                '_links'   : {
                    '_collection' : { href: this.props.customer.id }
                }
            }
            if ('Customer call' === this.props.activityType) {
                activity.proactive = !!ProactiveStore.getValue()
            }
            AppDispatcher.dispatch({
                actionType : 'customer-activity',
                command    : {
                    method     : 'POST',
                    resource   : 'complaints', 
                    payload    : complaint
                },
                activity   : activity
            })
            this.resetForm()
            this.props.close()
        }
    },
    resetForm: function() {
        AppDispatcher.dispatch({
            actionType: 'complaint-form-reset'
        })
    },
    render: function() {
        return (
            <div>
                <DescriptionInput ref='descriptionInput' />
                {('Customer call' === this.props.activityType) ? (
                    <ProactiveInput />
                ) : <span />}
                <hr />
                <Bootstrap.ButtonGroup>
                    <Button
                      bsStyle='primary'
                      onClick={this.handleSubmit}>
                        <Bootstrap.Glyphicon 
                          glyph='ok' />
                        Save
                    </Button>
                    <Button
                      bsStyle='default'
                      onClick={this.props.close}>
                        Cancel
                    </Button>
                </Bootstrap.ButtonGroup>
             </div>
        )
    }
})

module.exports = ServiceComplaintRegistrationForm
