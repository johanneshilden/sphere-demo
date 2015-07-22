var Bootstrap                        = require('react-bootstrap');
var Griddle                          = require('griddle-react');
var React                            = require('react');
var DataStore                        = require('../../store/DataStore');
var AppDispatcher                    = require('../../dispatcher/AppDispatcher');
var QualityComplaintRegistrationForm = require('../../components/complaints/QualityComplaintRegistrationForm');
var ServiceComplaintRegistrationForm = require('../../components/complaints/ServiceComplaintRegistrationForm');
var CustomerContactForm              = require('../../components/customers/CustomerContactForm');
var ComplaintsView                   = require('../../components/complaints/ComplaintsView');
var ActivitiesView                   = require('../../components/activities/ActivitiesView');
var TasksView                        = require('../../components/tasks/TasksView');
var OrderRegistrationForm            = require('../../components/orders/OrderRegistrationForm');
var CallbackRegistrationForm         = require('../../components/customers/CallbackRegistrationForm');
var CustomerVisitRegistrationForm    = require('../../components/customers/CustomerVisitRegistrationForm');
var OrdersView                       = require('../../components/orders/OrdersView');
var BootstrapPager                   = require('../BootstrapPager');

var Modal                            = Bootstrap.Modal;
var Panel                            = Bootstrap.Panel;
var TabPane                          = Bootstrap.TabPane;
var TabbedArea                       = Bootstrap.TabbedArea;
var Table                            = Bootstrap.Table;

var ContactsView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage: 8
        };
    },
    render: function() {
        var metadata = [
            {'columnName': 'type', 'displayName': 'Contact type'},
            {'columnName': 'info', 'displayName': 'Contact info'},
            {'columnName': 'meta', 'displayName': 'Comment'}
        ];
        return (
           <Griddle 
              results={this.props.contacts} 
              showFilter={false}
              resultsPerPage={this.props.resultsPerPage}
              useGriddleStyles={false}
              useCustomPagerComponent={true}
              customPagerComponent={BootstrapPager}
              columnMetadata={metadata}
              columns={['type', 'info', 'meta']}
              tableClassName='table table-bordered table-select' />
        );
    }
});

var CustomersEntityView = React.createClass({
    getCustomer: function() {
        var customer = DataStore.getItem('customers/' + this.props.customerId);
        if (customer) {
            if (!customer.hasOwnProperty('_embedded')) {
                customer['_embedded'] = {};
            }
            complaints = customer['_embedded']['complaints'] || [];
            activities = customer['_embedded']['activities'] || [];
            contacts   = customer['_embedded']['contacts']   || [];
            orders     = customer['_embedded']['orders']     || [];
            tasks      = customer['_embedded']['tasks']      || [];
            for (var i = 0; i < activities.length; i++) {
                var item = activities[i];
                var resourceHref = null;
                if (item.hasOwnProperty('_links') && item['_links'].hasOwnProperty('resource')) 
                    resourceHref = item['_links']['resource'].href; 
                activities[i].resource = resourceHref;
            }
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                tasks[i].href = task['_links']['self'].href;
            }
            this.setState({
                customer   : customer,
                complaints : complaints,
                activities : activities,
                contacts   : contacts,
                orders     : orders,
                tasks      : tasks
            });
        }
    },
    getInitialState: function() {
        return {
            key          : 1,
            customer     : null,
            complaints   : [],
            activities   : [],
            contacts     : [],
            orders       : [],
            tasks        : [],
            modalAction  : null,
            modalVisible : false
        };
    },
    onActivityCreated: function() {
        this.setState({
            key: 6
        });
    },
    componentDidMount: function() {
        this.getCustomer();
        DataStore.on('change', this.getCustomer);
        DataStore.on('customer-activity-register', this.onActivityCreated);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.getCustomer);
        DataStore.removeListener('customer-activity-register', this.onActivityCreated);
    },
    handleSelect: function(key) {
        this.setState({key: key});
    },
    handleLogCallActivity: function(key) {
        this.setState({
            modalVisible : true,
            modalAction  : key
        });
    },
    closeModal: function() {
        this.setState({
            modalVisible : false,
            modalAction  : null
        });
    },
    confirmNoAction: function(activityType) {
        AppDispatcher.dispatch({
            actionType : 'command-invoke',
            command    : {
                method     : 'POST',
                resource   : 'activities', 
                payload    : {
                    'type'     : 'no-action',
                    'activity' : activityType,
                    'created'  : Date.now(),
                    '_links'   : {
                        '_collection' : this.state.customer['_links']['self']
                    }
                }
            }
        });
        this.closeModal();
    },
    renderModal: function() {
        var modalAction  = this.state.modalAction,
            activityType = null;
        if (modalAction)
            activityType = (0 === modalAction.indexOf('call-activity')) ? 'Customer call' : 'Visit';
        switch (modalAction) {
            case 'customer-visit-schedule-followup':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Schedule follow-up visit
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CustomerVisitRegistrationForm 
                              customer={this.state.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                );
            case 'call-activity-schedule-call':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Schedule callback
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CallbackRegistrationForm 
                              customer={this.state.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                );
            case 'call-activity-no-action':
            case 'customer-visit-no-action':
                var message = activityType === 'Customer call' 
                    ? 'This customer call did not result in any further action.'
                    : 'This customer visit did not result in any action.';
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Register {activityType.toLowerCase()}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {message}
                        </Modal.Body>
                        <Modal.Footer>
                            <Bootstrap.ButtonGroup>
                                <Bootstrap.Button
                                  onClick={this.confirmNoAction.bind(this, activityType)}
                                  bsStyle='primary'>
                                    Confirm activity
                                </Bootstrap.Button>
                                <Bootstrap.Button
                                  onClick={this.closeModal}
                                  bsStyle='default'>
                                    Cancel
                                </Bootstrap.Button>
                            </Bootstrap.ButtonGroup>
                        </Modal.Footer>
                    </Modal>
                );
            case 'call-activity-place-order':
            case 'customer-visit-place-order':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Place a new order
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <OrderRegistrationForm 
                              customer={this.state.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                );
            case 'call-activity-quality-complaint':
            case 'customer-visit-quality-complaint':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Register quality complaint
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <QualityComplaintRegistrationForm 
                              customer={this.state.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                );
            case 'call-activity-service-complaint':
            case 'customer-visit-service-complaint':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Register service complaint
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ServiceComplaintRegistrationForm
                              customer={this.state.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                 );
            case 'call-activity-add-contact':
            case 'customer-visit-add-contact':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                Add customer contact
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CustomerContactForm
                              customer={this.state.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                );
            default:
                return <span />;
        }
    },
    render: function() {
        var customer = this.state.customer;
        if (!customer)
            return <span />;
        var callActivityTitle = (
            <span>
                <Bootstrap.Glyphicon glyph="earphone" />Call activity
            </span>
        );
        var customerVisitTitle = (
            <span>
                <Bootstrap.Glyphicon glyph="home" />Customer visit
            </span>
        );
        return ( 
            <div>
                {this.renderModal()}
                <Panel 
                  className='panel-fill'
                  bsStyle='primary'  
                  header='Customer'>
                    <TabbedArea 
                      fill 
                      animation={false}
                      activeKey={this.state.key} 
                      onSelect={this.handleSelect}>
                        <TabPane eventKey={1} tab='Summary'>
                            <Panel>
                                <ol className='breadcrumb'>
                                    <li>
                                        <a href='#customers'>
                                            Customers
                                        </a>
                                    </li>
                                    <li className='active'>
                                        {customer.name}
                                    </li>
                                </ol>
                                <Bootstrap.Row>
                                    <Bootstrap.Col lg={8}>
                                        <h3>{customer.name}</h3>
                                        <hr />
                                        <Bootstrap.ButtonGroup style={{float: 'right', marginTop: '-5.5em'}}>
                                            <Bootstrap.DropdownButton 
                                              onSelect={this.handleLogCallActivity}
                                              title={callActivityTitle}>
                                                <Bootstrap.MenuItem eventKey='call-activity-place-order'>
                                                    Place an order
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='call-activity-add-contact'>
                                                    Add a contact
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='call-activity-service-complaint'>
                                                    Register a service complaint
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='call-activity-quality-complaint'>
                                                    Register a quality complaint
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='call-activity-schedule-call'>
                                                    Schedule callback
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='call-activity-no-action'>
                                                    No action
                                                </Bootstrap.MenuItem>
                                            </Bootstrap.DropdownButton>
                                            <Bootstrap.DropdownButton
                                              onSelect={this.handleLogCallActivity}
                                              title={customerVisitTitle}>
                                                <Bootstrap.MenuItem eventKey='customer-visit-place-order'>
                                                    Place an order
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='customer-visit-add-contact'>
                                                    Add a contact
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='customer-visit-service-complaint'>
                                                    Register a service complaint
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='customer-visit-quality-complaint'>
                                                    Register a quality complaint
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='customer-visit-schedule-followup'>
                                                    Schedule follow-up visit
                                                </Bootstrap.MenuItem>
                                                <Bootstrap.MenuItem eventKey='customer-visit-no-action'>
                                                    No action
                                                </Bootstrap.MenuItem>
                                            </Bootstrap.DropdownButton>
                                        </Bootstrap.ButtonGroup>
                                        <Table bordered striped>
                                            <col width={250} />
                                            <col />
                                            <tbody>
                                                <tr>
                                                    <td><b>Address</b></td>
                                                    <td>{customer.address}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>TIN</b></td>
                                                    <td>{customer.tin}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Phone number</b></td>
                                                    <td>{customer.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Area</b></td>
                                                    <td>{customer.area}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Price category</b></td>
                                                    <td>{customer.priceCategory}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Bootstrap.Col>
                                    <Bootstrap.Col lg={4}>
                                        <Bootstrap.Well>
                                            <div className='text-center'>
                                                <img 
                                                  style={{maxWidth: '100%'}}
                                                  src={'https://maps.googleapis.com/maps/api/staticmap?center=' + customer.position.latitude + ',' + customer.position.longitude + '&zoom=14&size=300x300&maptype=roadmap&&markers=color:red%7Clabel:C%7C' + customer.position.latitude + ',' + customer.position.longitude} />
                                            </div>
                                        </Bootstrap.Well>
                                    </Bootstrap.Col>
                                </Bootstrap.Row>
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={2} tab='Orders'>
                            <Panel>
                                <OrdersView 
                                  orders={this.state.orders} />
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={3} tab='Contacts'>
                            <Panel>
                                <ContactsView 
                                  contacts={this.state.contacts} />
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={4} tab='Complaints'>
                            <Panel>
                                <ComplaintsView 
                                  complaints={this.state.complaints} 
                                  showCustomer={false} />
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={5} tab='Tasks'>
                            <Panel>
                                <TasksView
                                  tasks={this.state.tasks} />
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={6} tab='Activity log'>
                            <Panel>
                                <ActivitiesView
                                  activities={this.state.activities} />
                            </Panel>
                        </TabPane>
                    </TabbedArea>
                </Panel>
            </div>
        );
    }
});

module.exports = CustomersEntityView;
