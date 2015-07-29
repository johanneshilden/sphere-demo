var Bootstrap                        = require('react-bootstrap')
var Griddle                          = require('griddle-react')
var React                            = require('react')

var ActivitiesView                   = require('../../components/activities/ActivitiesView')
var AppDispatcher                    = require('../../dispatcher/AppDispatcher')
var BootstrapPager                   = require('../BootstrapPager')
var CallbackRegistrationForm         = require('../../components/customers/CallbackRegistrationForm')
var ComplaintsView                   = require('../../components/complaints/ComplaintsView')
var CustomerContactForm              = require('../../components/customers/CustomerContactForm')
var CustomerVisitRegistrationForm    = require('../../components/customers/CustomerVisitRegistrationForm')
var DataStore                        = require('../../store/DataStore')
var OrderRegistrationModal           = require('../../components/orders/OrderRegistrationForm')
var OrdersView                       = require('../../components/orders/OrdersView')
var QualityComplaintModal            = require('../../components/complaints/QualityComplaintRegistrationForm')
var ServiceComplaintRegistrationForm = require('../../components/complaints/ServiceComplaintRegistrationForm')
var TasksView                        = require('../../components/tasks/TasksView')
var MapComponent                     = require('../../components/MapComponent')

var Modal                            = Bootstrap.Modal
var Panel                            = Bootstrap.Panel
var TabPane                          = Bootstrap.TabPane
var TabbedArea                       = Bootstrap.TabbedArea
var Table                            = Bootstrap.Table

const ContactsView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage : 8
        }
    },
    render: function() {
        let metadata = [
            {'columnName': 'type', 'displayName': 'Contact type'},
            {'columnName': 'info', 'displayName': 'Contact info'},
            {'columnName': 'meta', 'displayName': 'Comment'}
        ]
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
        )
    }
})

const spinnerBg = {
    marginLeft   : 'auto',
    marginRight  : 'auto',
    maxWidth     : '300px',
    height       : '300px',
    overflow     : 'hidden',
    marginBottom : '1em',
    background   : 'center center no-repeat url(../common/images/spinner.gif) #aaaaaa'
}

const CustomersEntityView = React.createClass({
    getInitialState: function() {
        return {
            key         : 1,
            modalAction : null
        }
    },
    handleSelect: function(key) {
        this.setState({key: key})
    },
    registerActivity: function(key) {
        this.setState({
            modalAction : key
        })
    },
    closeModal: function() {
        this.setState({
            modalAction : null
        })
    },
    onActivityCreated: function() {
        this.setState({key: 1})
    },
    componentDidMount: function() {
        DataStore.on('customer-activity-register', this.onActivityCreated)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('customer-activity-register', this.onActivityCreated)
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
                        '_collection' : { href: this.props.customer.id }
                    }
                }
            }
        })
        this.closeModal()
    },
    showMap: function() {
        //this.setState({modalAction: 'map'})
        let customer = this.props.customer
        if (customer && customer.position) {
            let lat = customer.position.latitude,
                lng = customer.position.longitude
            window.location = 'https://www.google.com/maps/dir//' + lat + ',' + lng + '/@' + lat + ',' + lng + ',13z'
        }
    },
    renderModal: function() {
        let modalAction = this.state.modalAction
        if (!modalAction)
            return (
                <span />
            )
        let activityType = (0 === modalAction.indexOf('call-activity')) ? 'Customer call' : 'Visit'
        switch (modalAction) {
            case 'map':
                let customer = this.props.customer
                return (
                    <Modal
                      bsSize='large'
                      show={true}
                      onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Map
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <MapComponent 
                              label={customer.name}
                              latitude={customer.position.latitude}
                              longitude={customer.position.longitude} />
                        </Modal.Body>
                    </Modal>
                )
            case 'customer-visit-schedule-followup':
                return (
                    <Modal
                      show={true}
                      onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Schedule follow-up visit
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CustomerVisitRegistrationForm 
                              customer={this.props.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                )
            case 'call-activity-schedule-call':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Schedule callback
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CallbackRegistrationForm 
                              customer={this.props.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                )
            case 'call-activity-no-action':
            case 'customer-visit-no-action':
                let message = (activityType === 'Customer call')
                    ? 'This customer call did not result in any further action.'
                    : 'This customer visit did not result in any action.'
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header closeButton>
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
                                  onClick={() => this.confirmNoAction(activityType)}
                                  bsStyle='primary'>
                                    <Bootstrap.Glyphicon 
                                      glyph='ok' />
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
                )
            case 'call-activity-place-order':
            case 'customer-visit-place-order':
                return (
                    <OrderRegistrationModal 
                      visible={this.state.modalVisible} 
                      close={this.closeModal} 
                      customer={this.props.customer} 
                      activityType={activityType} />
                )
            case 'call-activity-quality-complaint':
            case 'customer-visit-quality-complaint':
                return (
                    <QualityComplaintModal
                      visible={this.state.modalVisible} 
                      close={this.closeModal} 
                      customer={this.props.customer} 
                      activityType={activityType} />
                )
            case 'call-activity-service-complaint':
            case 'customer-visit-service-complaint':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Register service complaint
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ServiceComplaintRegistrationForm
                              customer={this.props.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                 )
            case 'call-activity-add-contact':
            case 'customer-visit-add-contact':
                return (
                    <Modal
                      show={this.state.modalVisible}
                      onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Add customer contact
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CustomerContactForm
                              customer={this.props.customer}
                              activityType={activityType}
                              close={this.closeModal} />
                        </Modal.Body>
                    </Modal>
                )
            default:
                return <span />
        }
    },
    renderCustomerInfo: function() {
        let customer = this.props.customer
        let callActivityTitle = ( 
            <span>
                <Bootstrap.Glyphicon glyph='earphone' />Call activity
            </span>
        )
        let customerVisitTitle = (
            <span>
                <Bootstrap.Glyphicon glyph='home' />Customer visit
            </span>
        )
        return (
            <div>
                {this.renderModal()}
                <h3>{customer.name}</h3>
                <hr />
                <Bootstrap.ButtonGroup 
                  className='pull-right' 
                  style={{marginTop: '-5.5em'}}>
                    <Bootstrap.DropdownButton 
                      onSelect={this.registerActivity}
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
                      onSelect={this.registerActivity}
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
                <h4 style={{marginBottom: '1em'}}>
                    <Bootstrap.Label bsStyle='info'>{customer.priceCategory}</Bootstrap.Label>
                </h4>
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
                            <td>{customer.tin ? customer.tin : (
                                <span>
                                    <Bootstrap.Glyphicon 
                                      style={{marginRight: '.2em'}}
                                      glyph='remove' />
                                    Not available
                                </span>
                            )}</td>
                        </tr>
                        <tr>
                            <td><b>Phone number</b></td>
                            <td>{customer.phone}</td>
                        </tr>
                        <tr>
                            <td><b>Area</b></td>
                            <td>{customer.area}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    },
    render: function() {
        let customer = this.props.customer
        if (!customer) {
            return (
                <span />
            )
        }
        return (
            <Panel
              header='Customers'
              bsStyle='primary'>
                <ol className='breadcrumb'>
                    <li>
                        <a href='#/customers'>
                            Customers
                        </a>
                    </li>
                    <li className='active'>
                        {customer.name}
                    </li>
                </ol>
                {(navigator.onLine && customer.position) ? (
                    <Bootstrap.Row>
                        <Bootstrap.Col lg={8}>
                            {this.renderCustomerInfo()}
                        </Bootstrap.Col>
                        <Bootstrap.Col lg={4}>
                            <Panel
                              className='customer-map'>
                                <div className='text-center'>
                                    <div style={spinnerBg}>
                                        <img src={'https://maps.googleapis.com/maps/api/staticmap?center=' + customer.position.latitude + ',' + customer.position.longitude + '&zoom=14&size=300x300&maptype=roadmap&&markers=color:red%7C' + customer.position.latitude + ',' + customer.position.longitude} />
                                    </div>
                                    <Bootstrap.Button
                                      onClick={this.showMap}
                                      bsStyle='primary'>
                                        <Bootstrap.Glyphicon 
                                          glyph='map-marker' />
                                        Show directions
                                    </Bootstrap.Button>
                                </div>
                            </Panel>
                        </Bootstrap.Col>
                    </Bootstrap.Row>
                ) : (
                    <Bootstrap.Row>
                        <Bootstrap.Col lg={12}>
                            {this.renderCustomerInfo()}
                        </Bootstrap.Col>
                    </Bootstrap.Row>
                )}
                <Panel 
                  className='panel-flat' 
                  bsStyle='primary'>
                    <TabbedArea 
                      fill 
                      animation={false}
                      activeKey={this.state.key} 
                      onSelect={this.handleSelect}>
                        <TabPane 
                          eventKey={1} 
                          tab='Activity log'>
                            <Panel 
                              className='panel-tab-pane'>
                                <ActivitiesView activities={this.props.activities} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey={2} 
                          tab='Orders'>
                            <Panel 
                              className='panel-tab-pane'>
                                <OrdersView 
                                  showCustomer = {false}
                                  orders       = {this.props.orders} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey={3} 
                          tab='Contacts'>
                            <Panel 
                              className='panel-tab-pane'>
                                <ContactsView contacts={this.props.contacts} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey={4} 
                          tab='Complaints'>
                            <Panel 
                              className='panel-tab-pane'>
                                <ComplaintsView 
                                 complaints={this.props.complaints} 
                                 showCustomer={false} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey={5} 
                          tab='Tasks'>
                            <Panel 
                              className='panel-tab-pane'>
                                <TasksView tasks={this.props.tasks} />
                            </Panel>
                        </TabPane>
                    </TabbedArea>
                </Panel>
            </Panel>
        )
    }
})

module.exports = CustomersEntityView
