var Bootstrap           = require('react-bootstrap');
var DateTimeField       = require('react-bootstrap-datetimepicker');
var EventEmitter        = require('events').EventEmitter;
var React               = require('react');
var assign              = require('object-assign');
var moment              = require('moment');
var ProductInput        = require('../products/ProductInput');
var DataStore           = require('../../store/DataStore');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');

var Panel               = Bootstrap.Panel;
var Table               = Bootstrap.Table;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Input               = Bootstrap.Input;

var CallbackRegistrationForm = React.createClass({
    getInitialState: function() {
        var now = String(Date.now());
        return {
            timeCreated : now,
            timeDue     : now
        };
    },
    handleSubmit: function() {
        var customer = this.props.customer,
            customerHref = customer['_links']['self'];
        var task = {
            'description' : 'Follow up call to customer \'' + customer.name + '\'.',
            'created'     : this.state.timeCreated,
            'due'         : this.state.timeDue,
                '_links'   : {
                    '_collection' : customerHref
                }
        };
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
                    '_collection' : customerHref
                }
            }
        });
        this.props.close();
    },
    setTimeCreated: function(time) {
        this.setState({timeCreated: String(time)});
    },
    setTimeDue: function(time) {
        this.setState({timeDue: String(time)});
    },
    render: function() {
        return (
            <div>
                <div className='form-group'>
                    <label>Created</label>
                    <DateTimeField 
                      dateTime={this.state.timeCreated}
                      onChange={this.setTimeCreated} />
                </div>
                <div className='form-group'>
                    <label>Callback time</label>
                    <DateTimeField 
                      dateTime={this.state.timeDue}
                      onChange={this.setTimeDue} />
                </div>
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
 
module.exports = CallbackRegistrationForm;
