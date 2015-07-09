var React         = require('react');
var Bootstrap     = require('react-bootstrap');
var Griddle       = require('griddle-react');
var DataStore     = require('../../store/DataStore');
var AppDispatcher = require('../../dispatcher/AppDispatcher');

var Panel         = Bootstrap.Panel;
var Modal         = Bootstrap.Modal;
var Button        = Bootstrap.Button;
var ModalTrigger  = Bootstrap.ModalTrigger;

var PendingRegistrationsView = React.createClass({
    fetchRegistrations: function() {
        if (this.isMounted()) {
            var data = DataStore.fetchCollection('registrations');
            for (var i = 0; i < data.length; i++) {
                data[i].href = data[i]._links['self']['href'];
            }
            this.setState({data: data});
        }
    },
    getInitialState: function() {
        return {
            data: [],
            showModal: false,
            href: null
        }
    },
    handleDelete: function() {
        AppDispatcher.dispatch({
            actionType: 'delete-registration',
            href: this.state.href
        });
    },
    closeModal: function() {
        this.setState({showModal: false});
    },
    confirmDelete: function(href) {
        this.setState({
            showModal: true,
            href: href
        });
    },
    componentDidMount: function() {
        this.fetchRegistrations();
        DataStore.on('change', this.fetchRegistrations);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchRegistrations);
    },
    render: function() {
        var self = this;
        var metadata = [
            {
                "columnName": "name", 
                "displayName": "Name",
                "customComponent": React.createClass({
                    handleRegistration: function() {
                        AppDispatcher.dispatch({
                            actionType: 'complete-registration',
                            partial: {
                                name          : this.props.rowData.name,
                                address       : this.props.rowData.address,
                                phone         : this.props.rowData.phone,
                                priceCategory : this.props.rowData.priceCategory,
                                href          : this.props.rowData.href
                            }
                        });
                    },
                    render: function() {
                        return (
                            <a href="javascript:" onClick={this.handleRegistration}>
                                {this.props.rowData.name}
                            </a>
                        );
                    }
                })
            }, 
            {"columnName": "address", "displayName": "Address"}, 
            {"columnName": "phone", "displayName": "Phone number"}, 
            {"columnName": "area", "displayName": "Area"},
            {"columnName": "priceCategory", "displayName": "Price category"},
            {
                "columnName": "actions", 
                "displayName": "",
                "customComponent": React.createClass({
                    render: function() {
                        return (
                            <Button
                                bsSize="xsmall"
                                bsStyle="default"
                                onClick={self.confirmDelete.bind(null, this.props.rowData.href)}>
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                &nbsp;Delete
                            </Button>
                        );
                    }
                })
            }
        ];
        return (
            <div>
                <DeleteRegistrationModal 
                    show={this.state.showModal}
                    deleteHandler={this.handleDelete} 
                    closeHandler={this.closeModal} />
                <Panel>
                    <Griddle 
                        results={this.state.data} 
                        tableClassName="table table-bordered" 
                        showFilter={true}
                        resultsPerPage="20"
                        useGriddleStyles={false}
                        columnMetadata={metadata}
                        columns={["name", "address", "phone", "priceCategory", "area", "actions"]} />
                </Panel>
            </div>
        );
    }
});

var DeleteRegistrationModal = React.createClass({
    handleConfirm: function() {
        this.props.deleteHandler();
        this.props.closeHandler();
    },
    render: function() {
        return (
            <Modal show={this.props.show} title="" onHide={this.props.closeHandler}>
                <Modal.Header>
                    <Modal.Title>Confirm action</Modal.Title>
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

module.exports = PendingRegistrationsView;
