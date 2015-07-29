var Bootstrap           = require('react-bootstrap')
var DateTimeField       = require('react-bootstrap-datetimepicker')
var EventEmitter        = require('events').EventEmitter
var React               = require('react')
var assign              = require('object-assign')

var AppDispatcher       = require('../../dispatcher/AppDispatcher')
var DataStore           = require('../../store/DataStore')
var ProductInput        = require('../products/ProductInput')

var Button              = Bootstrap.Button
var Input               = Bootstrap.Input
var Modal               = Bootstrap.Modal
var Panel               = Bootstrap.Panel
var Table               = Bootstrap.Table

const CallbackRegistrationForm = React.createClass({
    handleSubmit: function() {
        let customer = this.props.customer,
            dueDate = new Date(this.refs.dateTimeInput.state.inputValue)
        let task = {
            'description' : 'Follow up call to customer \'' + customer.name + '\'.',
            'created'     : Date.now(),
            'due'         : dueDate.valueOf(),
            '_links'      : {
                '_collection' : { href: customer.id }
            }
        }
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method     : 'POST',
                resource   : 'tasks', 
                payload    : task
            },
            activity   : {
                'type'     : 'callback-register',
                'activity' : this.props.activityType,
                'created'  : Date.now(),
                '_links'   : {
                    '_collection' : { href: customer.id }
                }
            }
        })
        this.props.close()
    },
    render: function() {
        return (
            <div>
                <div className='form-group'>
                    <label>Callback time</label>
                    <DateTimeField 
                      ref='dateTimeInput'
                      dateTime={String(Date.now())} />
                </div>
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
 
module.exports = CallbackRegistrationForm
