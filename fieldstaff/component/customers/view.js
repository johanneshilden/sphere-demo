var React                    = require('react');
var Bootstrap                = require('react-bootstrap');
var DataStore                = require('../../store/DataStore');

var ServiceComplaintRegistrationForm = require('../complaints/service/register');
var QualityComplaintRegistrationForm = require('../complaints/quality/register');

var Modal                    = Bootstrap.Modal;
var ModalBody                = Bootstrap.Modal.Body;
var ModalHeader              = Bootstrap.Modal.Header;
var ModalTitle               = Bootstrap.Modal.Title;

var CustomersEntityView = React.createClass({
    fetchCustomerData: function() {
        var customer = DataStore.store.getItem('customers/' + this.props.customerId);
        this.setState({customer: customer});
    },
    componentDidMount: function() {
        this.fetchCustomerData();
    },
    getInitialState: function() {
        return {
            customer: null,
            showQualityComplaintModal: false,
            showServiceComplaintModal: false
        };
    },
    close: function() {
        this.setState({
            showQualityComplaintModal: false,
            showServiceComplaintModal: false
        });
    },
    openQualityComplaintModal: function() {
        this.setState({showQualityComplaintModal: true});
    },
    openServiceComplaintModal: function() {
        this.setState({showServiceComplaintModal: true});
    },
    render: function() {
        var customer = this.state.customer;
        if (!customer) {
            return (
                <span />
            );
        }
        return (
            <div>
                <Modal show={this.state.showServiceComplaintModal} onHide={this.close}>
                    <ModalHeader>
                        <ModalTitle>Register service complaint</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <ServiceComplaintRegistrationForm 
                            customer={this.state.customer} />
                    </ModalBody>
                </Modal>
                <Modal show={this.state.showQualityComplaintModal} onHide={this.close}>
                    <ModalHeader>
                        <ModalTitle>Register quality complaint</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <QualityComplaintRegistrationForm 
                            customer={this.state.customer} />
                    </ModalBody>
                </Modal>
                <h4>{customer.name}</h4>
                <hr />
                <ul>
                    <li>
                        <a onClick={this.openServiceComplaintModal} href="javascript:">Register service complaint</a>
                    </li>
                    <li>
                        <a onClick={this.openQualityComplaintModal} href="javascript:">Register quality complaint</a>
                    </li>
                </ul>
            </div>
        );
    }
});

module.exports = CustomersEntityView;
