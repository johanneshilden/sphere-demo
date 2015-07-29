import Bootstrap                  from 'react-bootstrap'
import Griddle                    from 'griddle-react'
import React                      from 'react'
import assign                     from 'object-assign'

import AppDispatcher              from '../../dispatcher/AppDispatcher'
import BootstrapPager             from '../BootstrapPager'
import DataStore                  from '../../store/DataStore'
import FormElementMixin           from '../FormElementMixin'
import FormItemStore              from '../../store/FormItemStore'
import MapComponent               from '../MapComponent'
import PendingRegistrationsView   from './PendingRegistrationsView'

import {Modal, Button, ButtonGroup, Input, Panel, TabPane, TabbedArea} from 'react-bootstrap'

const NameStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value.length > 2) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            if (length) {
                this.hint = 'The name must be at least 3 characters long.'
            } else {
                this.hint = 'This value is required.'
            }
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-name-assign' === payload.actionType) {
        NameStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        NameStore.reset()
    } else if ('customer-form-refresh' === payload.actionType) {
        NameStore.refresh()
    }
})

const NameInput = React.createClass({
    mixins: [FormElementMixin],
    store: NameStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-name-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input
              label='Name'
              ref='input'
              value={this.state.value}
              placeholder='The name of the customer'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        )
    }
})

const AddressStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value.length) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-address-assign' === payload.actionType) {
        AddressStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        AddressStore.reset()
    } else if ('customer-form-refresh' === payload.actionType) {
        AddressStore.refresh()
    }
})

const AddressInput = React.createClass({
    mixins: [FormElementMixin],
    store: AddressStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-address-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input
              label='Address'
              ref='input'
              value={this.state.value}
              placeholder="The customer's address"
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        )
    }
})

const TinStore = assign({}, FormItemStore)

AppDispatcher.register(payload => {
    if ('customer-form-tin-assign' === payload.actionType) {
        TinStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        TinStore.reset()
    } else if ('customer-form-refresh' === payload.actionType) {
        TinStore.refresh()
    }
})

const TinInput = React.createClass({
    mixins: [FormElementMixin],
    store: TinStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-tin-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input
              label='TIN'
              ref='input'
              value={this.state.value}
              placeholder='Taxpayer identification number'
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        )
    }
})

const PhoneStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value.length) { 
            this.state = 'success' 
            this.hint  = null
            if (!/^\+?[0-9\.\-\s]+$/.test(this.value)) {
                this.state = 'error'
                this.hint  = 'Not a valid phone number.'
            }
        } else {
            this.state = 'error'
            this.hint  = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-phone-assign' === payload.actionType) {
        PhoneStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        PhoneStore.reset()
    } else if ('customer-form-refresh' === payload.actionType) {
        PhoneStore.refresh()
    }
})

const PhoneInput = React.createClass({
    mixins: [FormElementMixin],
    store: PhoneStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-phone-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input
              label='Phone number'
              ref='input'
              value={this.state.value}
              placeholder="The customer's phone number"
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='text' />
        )
    }
})

const AreaStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value.length) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint  = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-area-assign' === payload.actionType) {
        AreaStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        AreaStore.reset()
    } else if ('customer-form-refresh' === payload.actionType) {
        AreaStore.refresh()
    }
})

const AreaSelect = React.createClass({
    mixins: [FormElementMixin],
    store: AreaStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null,
            areas           : []
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-area-assign',
            value      : value
        })
    },
    fetchAreas: function() {
        let areas = DataStore.fetchCollection('areas')
        if (!areas.length) {
            areas = [{ 'name': 'Global' }]
        }
        this.setState({areas: areas})
    },
    componentDidMount: function() {
        this.fetchAreas()
        DataStore.on('change', this.fetchAreas)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchAreas)
    },
    render: function() {
        let areas = this.state.areas,
            i = 0
        return (
            <Input
              label='Area'
              ref='input'
              value={this.state.value}
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='select'>
                {this.state.value ? null : (
                    <option
                      value=''>
                        Select an area from the list
                    </option>
                )}
                {areas.map(area => {
                    return (
                        <option 
                          key={i++} 
                          value={area.name}>
                          {area.name}
                        </option>
                    )
                })}
            </Input>
        )
    }
})

const PriceCategoryStore = assign({}, FormItemStore, {
    validate: function() {
        if (this.value.length) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint  = 'This value is required.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-price-category-assign' === payload.actionType) {
        PriceCategoryStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        PriceCategoryStore.reset()
    } else if ('customer-form-refresh' === payload.actionType) {
        PriceCategoryStore.refresh()
    }
})

const PriceCategorySelect = React.createClass({
    mixins: [FormElementMixin],
    store: PriceCategoryStore,
    getInitialState: function() {
        return {
            value           : '',
            validationState : null,
            hint            : null,
            categories      : []
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-price-category-assign',
            value      : value
        })
    },
    fetchPriceCategories: function() {
        let categories = DataStore.fetchCollection('price-categories')
        if (!categories.length) {
            categories = [{ 'name': 'Default' }]
        }
        this.setState({categories: categories})
    },
    componentDidMount: function() {
        this.fetchPriceCategories()
        DataStore.on('change', this.fetchPriceCategories)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchPriceCategories)
    },
    render: function() {
        let categories = this.state.categories,
            i = 0
        return (
            <Input
              label='Price category'
              ref='input'
              value={this.state.value}
              bsStyle={this.state.validationState}
              hasFeedback
              help={this.state.hint}
              onChange={this.handleChange}
              type='select'>
                {this.state.value ? null : (
                    <option
                      value=''>
                        Select a price category from the list
                    </option>
                )}
                {categories.map(category => {
                    return (
                        <option 
                          key={i++} 
                          value={category.name}>
                          {category.name}
                        </option>
                    )
                })}
            </Input>
        )
    }
})

const CustomerRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            template    : '',
            geoLocation : null
        }
    },
    handlePartial: function(resource) {
        let partial = DataStore.getItem(resource)
        if (partial) {
            this.resetForm()
            this.setState({template: resource})
            NameStore.setValue(partial.name)
            AddressStore.setValue(partial.address)
            PhoneStore.setValue(partial.phone)
            AreaStore.setValue(partial.area)
        }
    },
    componentDidMount: function() {
        DataStore.on('registration-finalize', this.handlePartial)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({geoLocation: {
                    latitude  : position.coords.latitude,
                    longitude : position.coords.longitude
                }})
            })
        }
    },
    componentWillUnmount: function() {
        DataStore.removeListener('registration-finalize', this.handlePartial)
    },
    handleSubmit: function() {
        let isValid = !!( NameStore.isValid()
                        & AddressStore.isValid()
                        & PhoneStore.isValid()
                        & AreaStore.isValid()
                        & PriceCategoryStore.isValid() )
        if (!isValid) {
            AppDispatcher.dispatch({
                actionType: 'customer-form-refresh'
            })
        } else {
            var customer = {
                name          : NameStore.getValue(),
                address       : AddressStore.getValue(),
                tin           : TinStore.getValue(),
                phone         : PhoneStore.getValue(),
                area          : AreaStore.getValue(),
                priceCategory : PriceCategoryStore.getValue(),
                position      : this.state.geoLocation
            }
            AppDispatcher.dispatch({
                actionType : 'command-invoke',
                command    : {
                    method   : 'POST',
                    resource : 'customers',
                    payload  : customer
                },
                notification: {
                    message : 'A new customer was successfully registered.',
                    level   : 'success'
                }
            })
            let template = this.state.template
            if (template) {
                AppDispatcher.dispatch({
                    actionType : 'command-invoke',
                    command    : {
                        method   : 'DELETE',
                        resource : this.state.template
                    }
                })
            }
            this.props.onNewRegistration()
            this.resetForm()
        }
    },
    resetForm: function() {
        AppDispatcher.dispatch({
            actionType: 'customer-form-reset'
        })
        this.setState({template: ''})
    },
    render: function() {
        return (
            <Panel>
                <NameInput 
                  ref='customerName' />
                <AddressInput 
                  ref='customerAddress' />
                <TinInput 
                  ref='customerTin' />
                <PhoneInput 
                  ref='customerPhone' />
                <AreaSelect 
                  ref='customerArea' />
                <PriceCategorySelect 
                  ref='customerPriceCategory' />
                <hr />
                <ButtonGroup>
                    <Button
                      bsStyle='primary'
                      onClick={this.handleSubmit}>
                        <Bootstrap.Glyphicon 
                          glyph='ok' />
                        Save
                    </Button>
                    <Button
                      bsStyle='default'
                      onClick={this.resetForm}>
                        Reset
                    </Button>
                </ButtonGroup>
            </Panel>
        )
    }
})

const CustomersView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage: 8
        }
    },
    getInitialState: function() {
        return {
            key           : 1,
            collapsed     : window.innverWidth < 992,
            registrations : [],
            modalVisible  : false,
            latitude      : 0,
            longitude     : 0
        }
    },
    fetchPartial: function() {
        let data = DataStore.fetchCollection('registrations')
        this.setState({registrations: data})
    },
    handleSelect: function(key) {
        this.setState({key: key})
        this.refs.customerRegistrationForm.resetForm()
    },
    handlePartial: function() {
        this.setState({key: 2})
    },
    handleNewRegistration: function() {
        this.setState({key: 1})
    },
    handleResize: function() {
        let innerWidth = window.innerWidth,
            oldVal = this.state.collapsed,
            newVal = innerWidth < 992
        if (oldVal != newVal)
            this.setState({collapsed: newVal})
    },
    componentDidMount: function() {
        DataStore.on('registration-finalize', this.handlePartial)
        this.fetchPartial()
        DataStore.on('change', this.fetchPartial)
        this.handleResize()
        window.addEventListener('resize', this.handleResize)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('registration-finalize', this.handlePartial)
        window.removeEventListener('resize', this.handleResize)
        DataStore.removeListener('change', this.fetchPartial)
    },
    handleRowClick: function(row, event) {
        if ('BUTTON' === event.target.nodeName || 'BUTTON' === event.target.parentNode.nodeName) {
            let position = row.props.data.position
            if (position) {
                //this.setState({
                //    latitude     : position.latitude,
                //    longitude    : position.longitude,
                //    modalVisible : true
                //})
                let lat = position.latitude,
                    lng = position.longitude
                window.location = 'https://www.google.com/maps/dir//' + lat + ',' + lng + '/@' + lat + ',' + lng + ',13z'
                return
            }
        }
        window.location.hash = row.props.data.id 
    },
    closeModal: function() {
        this.setState({modalVisible: false})
    },
    render: function() {
        let columns = this.state.collapsed
            ? ['name', 'area', 'priceCategory', 'position']
            : ['name', 'address', 'phone', 'area', 'priceCategory', 'position']
        let metadata = [
            {
                'columnName': '_local', 
                'displayName': '',
                'cssClassName': 'text-center',
                'customComponent': React.createClass({
                    render: function() {
                        if (this.props.rowData['_local'])
                            return (
                                <Bootstrap.Glyphicon glyph='phone' bsSize='xsmall' />
                            )
                        else
                            return (
                                <span />
                            )
                    }
                })
            }, 
            {
                'columnName': 'name', 
                'displayName': 'Name',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <span>
                                <Bootstrap.Glyphicon 
                                  glyph='user' 
                                  bsSize='xsmall' 
                                  style={{marginRight: '.3em'}} />
                                {this.props.rowData.name}
                            </span>
                        )
                    }
                })
            }, 
            {'columnName': 'address', 'displayName': 'Address'},
            {'columnName': 'tin', 'displayName': 'TIN'},
            {'columnName': 'phone', 'displayName': 'Phone number'},
            {'columnName': 'area', 'displayName': 'Area'},
            {'columnName': 'priceCategory', 'displayName': 'Price category'},
            {
                'columnName': 'position', 
                'displayName': 'Location',
                'customComponent': React.createClass({
                    render: function() {
                        let position = this.props.rowData.position
                        if (!position || !position.latitude || !position.longitude) {
                            return ( 
                                <span>Unknown</span>
                            )
                        }
                        return (
                            <Button 
                              block
                              bsStyle='default'
                              bsSize='xsmall'>
                                <Bootstrap.Glyphicon 
                                  glyph='map-marker' />
                                Show directions
                            </Button>
                        )
                    }
                })
            }
        ]
        let count = this.state.registrations.length,
            pendingRegistrationsTab = count ? (
            <span>
                Pending registrations<Bootstrap.Badge>{count}</Bootstrap.Badge>
            </span>
        ) : (
            <span>Pending registrations</span>
        )
        return (
            <div>
                <Modal
                  bsSize='large'
                  show={this.state.modalVisible}
                  onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Map
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MapComponent 
                          label=''
                          latitude={this.state.latitude}
                          longitude={this.state.longitude} />
                    </Modal.Body>
                </Modal>
                <Panel 
                  className='panel-fill'
                  header='Customers' 
                  bsStyle='primary'>
                    <TabbedArea fill 
                      animation={false}
                      activeKey={this.state.key} 
                      onSelect={this.handleSelect}>
                        <TabPane 
                          eventKey={1} 
                          tab='All customers'>
                            <Panel>
                                <Griddle 
                                  results={this.props.customers} 
                                  showFilter={true}
                                  resultsPerPage={this.props.resultsPerPage}
                                  useGriddleStyles={false}
                                  columnMetadata={metadata}
                                  onRowClick={this.handleRowClick}
                                  useCustomPagerComponent={true}
                                  customPagerComponent={BootstrapPager}
                                  tableClassName='table table-bordered table-select' 
                                  columns={columns} />
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={2} tab="Register new customer">
                            <CustomerRegistrationForm 
                              ref='customerRegistrationForm'
                              onNewRegistration={this.handleNewRegistration} />
                        </TabPane>
                        <TabPane eventKey={3} tab={pendingRegistrationsTab}>
                            <PendingRegistrationsView 
                              registrations={this.state.registrations} />
                        </TabPane>
                    </TabbedArea>
                </Panel>
            </div>
        )
    }
})

module.exports = CustomersView
