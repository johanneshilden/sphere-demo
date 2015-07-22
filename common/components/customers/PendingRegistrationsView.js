var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var DataStore           = require('../../store/DataStore');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');
var BootstrapPager      = require('../BootstrapPager');

var Button              = Bootstrap.Button;
var ButtonGroup         = Bootstrap.ButtonGroup;
var DropdownButton      = Bootstrap.DropdownButton;
var MenuItem            = Bootstrap.MenuItem;
var Panel               = Bootstrap.Panel;
var Modal               = Bootstrap.Modal;

var DeleteRegistrationModal = React.createClass({
    confirmDelete: function() {
        AppDispatcher.dispatch({
            actionType : 'command-invoke',
            command    : {
                method   : 'DELETE',
                resource : this.props.regHref
            },
            notification: {
                message : 'The customer registration was deleted.',
                level   : 'success'
            }
        });
        this.props.close();
    },
    render: function() {
        return (
            <Modal
              onHide={this.props.close}
              show={this.props.show}>
                <Modal.Header>
                    <Modal.Title>Confirm action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                      onClick={this.props.close}>
                        Cancel
                    </Button>
                    <Button 
                      bsStyle='danger' 
                      onClick={this.confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

var PendingRegistrationsView = React.createClass({
    fetchRegistrations: function() {
        var data = DataStore.fetchCollection('registrations');
        for (var i = 0; i < data.length; i++) {
            data[i].href = data[i]._links['self']['href'];
        }
        this.setState({data: data});
    },
    getInitialState: function() {
        return {
            data: [],
            regHref: null,
            modalVisible: false
        }
    },
    onStoreChange: function(command) {
        this.fetchRegistrations();
    },
    componentDidMount: function() {
        this.fetchRegistrations();
        DataStore.on('change', this.onStoreChange);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.onStoreChange);
    },
    confirmDeleteRegistration: function(href) {
        this.setState({
            modalVisible: true,
            regHref: href
        });
    },
    finalizeRegistration: function(href) {
        DataStore.emit('registration-finalize', href);
    },
    closeModal: function() {
        this.setState({modalVisible: false});
    },
    render: function() {
        var self = this;
        var metadata = [
            {'columnName': 'name', 'displayName': 'Name'}, 
            {'columnName': 'address', 'displayName': 'Address'}, 
            {'columnName': 'phone', 'displayName': 'Phone number'}, 
            {'columnName': 'area', 'displayName': 'Area'},
            {'columnName': 'priceCategory', 'displayName': 'Price category'},
            {
                'columnName': 'actions', 
                'displayName': '',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <DropdownButton 
                              className='btn-block'
                              buttonClassName='btn-block'
                              bsSize='xsmall'
                              title='Actions'>
                                <MenuItem 
                                  onSelect={self.finalizeRegistration.bind(null, this.props.rowData.href)}
                                  eventKey={1}>
                                    <i className='fa fa-fw fa-pencil'></i>Finalize
                                </MenuItem>
                                <MenuItem 
                                  onSelect={self.confirmDeleteRegistration.bind(null, this.props.rowData.href)}
                                  eventKey={2}>
                                    <i className='fa fa-fw fa-remove'></i>Delete
                                </MenuItem>
                            </DropdownButton>
                        );
                    }
                })
            }
        ];
        return (
            <div>
                <DeleteRegistrationModal 
                  show={this.state.modalVisible}
                  regHref={this.state.regHref}
                  close={this.closeModal} />
                <Panel>
                    <Griddle 
                      results={this.state.data} 
                      tableClassName='table table-bordered table-select' 
                      showFilter={true}
                      resultsPerPage={20}
                      useGriddleStyles={false}
                      useCustomPagerComponent={true}
                      customPagerComponent={BootstrapPager}
                      columnMetadata={metadata}
                      columns={['name', 'address', 'phone', 'priceCategory', 'area', 'actions']} />
                </Panel>
            </div>
        );
    }
});

module.exports = PendingRegistrationsView;
