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
            data: []
        }
    },
    componentDidMount: function() {
        this.fetchRegistrations();
        DataStore.on('change', this.fetchRegistrations);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchRegistrations);
    },
    render: function() {
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
            {"columnName": "priceCategory", "displayName": "Price category"},
            {
                "columnName": "actions", 
                "displayName": "",
                "customComponent": React.createClass({
                    handleDelete: function() {
                        AppDispatcher.dispatch({
                            actionType: 'delete-registration',
                            href: this.props.rowData.href
                        });
                    },
                    render: function() {
                        return (
                            <ModalTrigger modal={<DeleteRegistrationModal deleteHandler={this.handleDelete} />}>
                                <a href="javascript:">Delete</a>
                            </ModalTrigger>
                        );
                    }
                })
            }
        ];
        return (
            <Panel>
                <Griddle 
                    results={this.state.data} 
                    tableClassName="table table-bordered" 
                    showFilter={true}
                    resultsPerPage="20"
                    useGriddleStyles={false}
                    columnMetadata={metadata}
                    columns={["name", "address", "phone", "priceCategory", "actions"]} />
            </Panel>
        );
    }
});

var DeleteRegistrationModal = React.createClass({
    handleConfirm: function() {
        this.props.deleteHandler();
        this.props.onRequestHide();
    },
    render: function() {
        return (
            <Modal title="Confirm action" onRequestHide={this.props.onRequestHide}>
                <div className="modal-body">
                    Are you sure?
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.handleConfirm}>Delete</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = PendingRegistrationsView;
