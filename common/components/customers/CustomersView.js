import Bootstrap                        from 'react-bootstrap'
import React                            from 'react'
import Griddle                          from 'griddle-react'

import ActivitiesCollection             from '../activities/ActivitiesCollection'
import AppDispatcher                    from '../../dispatcher/AppDispatcher'
import BootstrapPager                   from '../BootstrapPager'
import CallbackRegistrationForm         from '../customers/CallbackRegistrationForm'
import ComplaintsCollection             from '../complaints/ComplaintsCollection'
import CustomerVisitRegistrationForm    from '../customers/CustomerVisitRegistrationForm'
import DataStore                        from '../../store/DataStore'
import OrderRegistrationModal           from '../orders/OrderRegistrationModal'
import OrdersCollection                 from '../orders/OrdersCollection'
import QualityComplaintModal            from '../complaints/QualityComplaintModal'
import ServiceComplaintRegistrationForm from '../complaints/ServiceComplaintRegistrationForm'
import TasksCollection                  from '../tasks/TasksCollection'

import {ContactsCreateForm}             from '../contacts/ContactsForm'
import {Label, DropdownButton, Button, MenuItem, ButtonGroup, Row, Col, Glyphicon, TabbedArea, TabPane, Modal, Table, Panel} from 'react-bootstrap'

const ContactsCollection = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage : 8
        }
    },
    render: function() {
        let metadata = [
            {'columnName' : 'type', 'displayName' : 'Contact type'},
            {'columnName' : 'info', 'displayName' : 'Contact info'},
            {'columnName' : 'meta', 'displayName' : 'Comment'},
            {
                'columnName'      : 'actions', 
                'displayName'     : '',
                'customComponent' : React.createClass({
                    handleEditContact: function() {
                        window.location.hash = this.props.rowData['id'] + '/edit'
                    },
                    render: function() {
                        return (
                            <Button 
                              bsSize  = 'xsmall'
                              onClick = {this.handleEditContact}>
                                <Glyphicon glyph='pencil' />
                                Edit
                            </Button>
                        )
                    }
                })
            }
        ]
        return (
           <Griddle 
             results                 = {this.props.contacts}
             showFilter              = {false}
             resultsPerPage          = {this.props.resultsPerPage}
             useGriddleStyles        = {false}
             useCustomPagerComponent = {true}
             customPagerComponent    = {BootstrapPager}
             columnMetadata          = {metadata}
             columns                 = {['type', 'info', 'meta', 'actions']}
             tableClassName          = 'table table-bordered table-select' />
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

const CustomersView = React.createClass({
    getDefaultProps: function() {
        allowEdit : false
    },
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
            return <span />
        let activityType = (0 === modalAction.indexOf('call-activity')) 
                    ? 'Customer call' : 'Visit'
        switch (modalAction) {
            //case 'map':
            //    let customer = this.props.customer
            //    return (
            //        <Modal
            //          bsSize='large'
            //          show={true}
            //          onHide={this.closeModal}>
            //            <Modal.Header closeButton>
            //                <Modal.Title>
            //                    Map
            //                </Modal.Title>
            //            </Modal.Header>
            //            <Modal.Body>
            //                <MapComponent 
            //                  label={customer.name}
            //                  latitude={customer.position.latitude}
            //                  longitude={customer.position.longitude} />
            //            </Modal.Body>
            //        </Modal>
            //    )
            case 'customer-visit-schedule-followup':
                return (
                    <Modal
                      show   = {true}
                      onHide = {this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Schedule follow-up visit
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CustomerVisitRegistrationForm 
                              customer     = {this.props.customer}
                              activityType = {activityType}
                              close        = {this.closeModal} />
                        </Modal.Body>
                    </Modal>
                )
            case 'call-activity-schedule-call':
                return (
                    <Modal
                      show   = {this.state.modalVisible}
                      onHide = {this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Schedule callback
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CallbackRegistrationForm 
                              customer     = {this.props.customer}
                              activityType = {activityType}
                              close        = {this.closeModal} />
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
                            <ButtonGroup>
                                <Button
                                  onClick = {() => this.confirmNoAction(activityType)}
                                  bsStyle = 'primary'>
                                    <Glyphicon 
                                      glyph='ok' />
                                    Confirm activity
                                </Button>
                                <Button
                                  onClick={this.closeModal}
                                  bsStyle='default'>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>
                )
            case 'call-activity-place-order':
            case 'customer-visit-place-order':
                return (
                    <OrderRegistrationModal 
                      visible      = {this.state.modalVisible}
                      close        = {this.closeModal}
                      customer     = {this.props.customer}
                      activityType = {activityType} />
                )
            case 'call-activity-quality-complaint':
            case 'customer-visit-quality-complaint':
                return (
                    <QualityComplaintModal
                      visible      = {this.state.modalVisible}
                      close        = {this.closeModal}
                      customer     = {this.props.customer}
                      activityType = {activityType} />
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
                              customer     = {this.props.customer}
                              activityType = {activityType}
                              close        = {this.closeModal} />
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
                            <ContactsCreateForm
                              customer     = {this.props.customer}
                              activityType = {activityType}
                              close        = {this.closeModal} />
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
                <Glyphicon glyph='earphone' />Call activity
            </span>
        )
        let customerVisitTitle = (
            <span>
                <Glyphicon glyph='home' />Customer visit
            </span>
        )
        return (
            <div>
                {this.renderModal()}
                <h3>{customer.name}</h3>
                <hr />
                <ButtonGroup 
                  className = 'pull-right'
                  style     = {{marginTop: '-5.5em'}}>
                    <DropdownButton 
                      onSelect = {this.registerActivity}
                      title    = {callActivityTitle}>
                        <MenuItem eventKey='call-activity-place-order'>
                            Place an order
                        </MenuItem>
                        <MenuItem eventKey='call-activity-add-contact'>
                            Add a contact
                        </MenuItem>
                        <MenuItem eventKey='call-activity-service-complaint'>
                            Register a service complaint
                        </MenuItem>
                        <MenuItem eventKey='call-activity-quality-complaint'>
                            Register a quality complaint
                        </MenuItem>
                        <MenuItem eventKey='call-activity-schedule-call'>
                            Schedule callback
                        </MenuItem>
                        <MenuItem eventKey='call-activity-no-action'>
                            No action
                        </MenuItem>
                    </DropdownButton>
                    <DropdownButton
                      onSelect = {this.registerActivity}
                      title    = {customerVisitTitle}>
                        <MenuItem eventKey='customer-visit-place-order'>
                            Place an order
                        </MenuItem>
                        <MenuItem eventKey='customer-visit-add-contact'>
                            Add a contact
                        </MenuItem>
                        <MenuItem eventKey='customer-visit-service-complaint'>
                            Register a service complaint
                        </MenuItem>
                        <MenuItem eventKey='customer-visit-quality-complaint'>
                            Register a quality complaint
                        </MenuItem>
                        <MenuItem eventKey='customer-visit-schedule-followup'>
                            Schedule follow-up visit
                        </MenuItem>
                        <MenuItem eventKey='customer-visit-no-action'>
                            No action
                        </MenuItem>
                    </DropdownButton>
                </ButtonGroup>
                <h4 style={{marginBottom: '1em'}}>
                    <Label bsStyle='info'>{customer.priceCategory}</Label>
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
                                    <Glyphicon 
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
                    <tfoot>
                        <tr>
                            <td colSpan={2}>
                                {this.props.allowEdit ? (
                                    <Button block
                                      onClick = {() => {
                                          window.location.hash = this.props.customer.id + '/edit'
                                      }}
                                      bsSize  = 'small'>
                                        <Glyphicon glyph='pencil' />
                                        Edit
                                    </Button>
                                ) : <span />}
                            </td>
                        </tr>
                    </tfoot>
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
              header  = 'Customers'
              bsStyle = 'primary'>
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
                    <Row>
                        <Col lg={8}>
                            {this.renderCustomerInfo()}
                        </Col>
                        <Col lg={4}>
                            <Panel
                              className='customer-map'>
                                <div className='text-center'>
                                    <div style={spinnerBg}>
                                        <img src={'https://maps.googleapis.com/maps/api/staticmap?center=' + customer.position.latitude + ',' + customer.position.longitude + '&zoom=14&size=300x300&maptype=roadmap&&markers=color:red%7C' + customer.position.latitude + ',' + customer.position.longitude} />
                                    </div>
                                    <Button
                                      onClick={this.showMap}
                                      bsStyle='primary'>
                                        <Glyphicon 
                                          glyph='map-marker' />
                                        Show directions
                                    </Button>
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col lg={12}>
                            {this.renderCustomerInfo()}
                        </Col>
                    </Row>
                )}
                <Panel 
                  className='panel-flat' 
                  bsStyle='primary'>
                    <TabbedArea 
                      fill 
                      animation = {false}
                      activeKey = {this.state.key}
                      onSelect  = {this.handleSelect}>
                        <TabPane 
                          eventKey = {1}
                          tab      = 'Activity log'>
                            <Panel 
                              className='panel-tab-pane'>
                                <ActivitiesCollection activities={this.props.activities} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey = {2}
                          tab      = 'Orders'>
                            <Panel 
                              className='panel-tab-pane'>
                                <OrdersCollection
                                  showCustomer = {false}
                                  orders       = {this.props.orders} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey = {3}
                          tab      = 'Contacts'>
                            <Panel 
                              className='panel-tab-pane'>
                                <ContactsCollection contacts={this.props.contacts} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey = {4}
                          tab      = 'Complaints'>
                            <Panel 
                              className='panel-tab-pane'>
                                <ComplaintsCollection
                                 complaints   = {this.props.complaints}
                                 showCustomer = {false} />
                            </Panel>
                        </TabPane>
                        <TabPane 
                          eventKey={5} 
                          tab='Tasks'>
                            <Panel 
                              className='panel-tab-pane'>
                                <TasksCollection tasks={this.props.tasks} />
                            </Panel>
                        </TabPane>
                    </TabbedArea>
                </Panel>
            </Panel>
        )
    }
})

module.exports = CustomersView
