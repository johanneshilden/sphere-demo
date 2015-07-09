var React                    = require('react');
var Bootstrap                = require('react-bootstrap');
var DataStore                = require('../../store/DataStore');
var AppDispatcher            = require('../../dispatcher/AppDispatcher');

var Modal                    = Bootstrap.Modal;
var ModalBody                = Bootstrap.Modal.Body;
var ModalHeader              = Bootstrap.Modal.Header;
var ModalTitle               = Bootstrap.Modal.Title;
var TabbedArea               = Bootstrap.TabbedArea;
var Input                    = Bootstrap.Input;
var TabPane                  = Bootstrap.TabPane;
var Panel                    = Bootstrap.Panel;
var Table                    = Bootstrap.Table;
var Button                   = Bootstrap.Button;

var CustomerContactTypeInput = React.createClass({
    getInitialState: function() {
        return {
            value: 'Address',
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
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function(value) {
        return true;
    },
    render: function() {
        return (
            <Input 
                type="select"
                label="Contact type"
                value={this.state.value}
                ref="input"
                onChange={this.handleChange}>
                    <option 
                        key="address"
                        value="Address">
                        Address
                    </option>
                    <option 
                        key="phone"
                        value="Phone number">
                        Phone number
                    </option>
                    <option 
                        key="email"
                        value="Email address">
                        Email address
                    </option>
                    <option 
                        key="website"
                        value="Website">
                        Website
                    </option>
                    <option 
                        key="other"
                        value="Other">
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
    reset: function() {
        this.setState(this.getInitialState());
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
    render: function() {
        return (
            <Input 
                type="text"
                value={this.state.value}
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                placeholder="A phone number, address or other piece of information"
                label="Contact details"
                ref="input" 
                onChange={this.handleChange} />
        );
    }
});

var CustomerContactMetaInput = React.createClass({
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
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function(value) {
        return true;
    },
    render: function() {
        return (
            <Input 
                type="text"
                value={this.state.value}
                help={this.state.hint}
                bsStyle={this.state.validState}
                hasFeedback
                placeholder="An optional comment or description of this contact detail"
                label="Comment"
                ref="input" 
                onChange={this.handleChange} />
        );
    }
});

var AddContactModal = React.createClass({
    handleSubmit: function() {
        if (this.isValid()) {
            var contact = {
                "type"   : this.refs.contactTypeInput.state.value,
                "info"   : this.refs.contactInfoInput.state.value,
                "meta"   : this.refs.contactMetaInput.state.value,
                "_links" : {
                    "customer": {"href": this.props.customerId}
                }
            };
            AppDispatcher.dispatch({
                actionType: 'create-contact',
                contact: contact
            });
            this.resetForm();
            this.props.closeHandler();
        }
    },
    isValid: function() {
        return (this.refs.contactTypeInput.isValid()
              & this.refs.contactInfoInput.isValid()
              & this.refs.contactMetaInput.isValid());
    },
    resetForm: function() {
        this.refs.contactTypeInput.reset();
        this.refs.contactInfoInput.reset();
        this.refs.contactMetaInput.reset();
    },
    render: function() {
        return (
            <div>
                <CustomerContactTypeInput 
                    ref="contactTypeInput" />
                <CustomerContactInfoInput 
                    ref="contactInfoInput" />
                <CustomerContactMetaInput 
                    ref="contactMetaInput" />
                <hr />
                <Button
                    bsStyle="primary"
                    onClick={this.handleSubmit}>
                    Save
                </Button>
                &nbsp;<Button
                    bsStyle="default"
                    onClick={this.props.closeHandler}>
                    Cancel
                </Button>
            </div>
        );
    }
});

var DeleteContactModal = React.createClass({
    handleConfirm: function() {
        this.props.deleteHandler();
        this.props.closeHandler();
    },
    render: function() {
        return (
            <Modal show={this.props.show} onHide={this.props.closeHandler}>
                <Modal.Header>
                    <Modal.Title>
                        Confirm action
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.closeHandler}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.handleConfirm}>Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

var CustomerContactsView = React.createClass({
    getInitialState: function() {
        return {
            showConfirmModal: false,
            showAddContactModal: false,
            contactId: null
        };
    },
    handleDeleteContact: function() {
        AppDispatcher.dispatch({
            actionType: 'delete-contact',
            contact: this.state.contactId
        });
    },
    confirmDelete: function(contactId) {
        this.setState({
            showConfirmModal: true,
            contactId: contactId
        });
    },
    addContact: function() {
        this.setState({showAddContactModal: true});
    },
    closeModal: function() {
        this.setState({
            showConfirmModal: false,
            showAddContactModal: false
        });
    },
    render: function() {
        var customer = this.props.customer,
            customerId = customer['_links']['self'].href,
            items = [];
        if (customer && customer.hasOwnProperty('_embedded') && customer['_embedded'].hasOwnProperty('contacts')) {
            var contacts = customer['_embedded']['contacts'];
            if (contacts) {
                for (var i = 0; i < contacts.length; i++) {
                    var contact = contacts[i],
                        contactId = contact['_links']['self'].href;
                    items.push(
                        <tr key={i}>
                            <td>{contact.type}</td>
                            <td>{contact.info}</td>
                            <td>{contact.meta}</td>
                            <td>
                                <Button
                                    bsSize="xsmall"
                                    bsStyle="default"
                                    onClick={this.confirmDelete.bind(null, contactId)}>
                                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                    &nbsp;Delete this contact
                                </Button>
                            </td>
                        </tr>
                    );
                }
            }
        }
        var controls = (
            <Modal show={this.state.showAddContactModal} onHide={this.closeModal}>
                <Modal.Header>
                    <Modal.Title>
                        Add customer contact
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddContactModal 
                        customerId={customerId} 
                        closeHandler={this.closeModal} />
                </Modal.Body>
            </Modal>
        );
        if (items.length) {
            return (
                <div>
                    {controls}
                    <DeleteContactModal 
                        show={this.state.showConfirmModal}
                        deleteHandler={this.handleDeleteContact} 
                        closeHandler={this.closeModal} />
                    <Panel>
                        <Table bordered condensed>
                            <col />
                            <col />
                            <col />
                            <col width={100} />
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Details</th>
                                    <th>Comment</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <td colSpan={4} style={{padding: '1em'}}>
                                        <Button block onClick={this.addContact}>
                                            Add contact item
                                        </Button>
                                    </td>
                                </tr>
                            </tfoot>
                            <tbody>
                                {items}
                            </tbody>
                        </Table>
                    </Panel>
                </div>
            );
        }
        return (
            <div>
                {controls}
                <Panel>
                    <p>No contacts found.</p>
                    <Button block onClick={this.addContact}>
                        Add contact item
                    </Button>
                </Panel>
            </div>
        );
    }
});

module.exports = CustomerContactsView;
