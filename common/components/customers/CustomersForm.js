import Bootstrap                  from 'react-bootstrap'
import React                      from 'react'
import assign                     from 'object-assign'

import AppDispatcher              from '../../dispatcher/AppDispatcher'
import DataStore                  from '../../store/DataStore'
import FormElementMixin           from '../FormElementMixin'
import FormItemStore              from '../../store/FormItemStore'

import {Label, Glyphicon, Button, ButtonGroup, Input, Panel, Row, Col} from 'react-bootstrap'

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
    } else if ('registration-finalize' === payload.actionType) {
        NameStore.setValue(payload.customer.name)
    } else if ('customer-form-refresh' === payload.actionType) {
        NameStore.refresh()
    }
})

const NameInput = React.createClass({
    mixins: [FormElementMixin],
    store: NameStore,
    getInitialState: function() {
        return {
            value           : NameStore.getValue(),
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
            <Input hasFeedback
              label       = 'Name'
              ref         = 'input'
              value       = {this.state.value}
              placeholder = 'The name of the customer'
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'text' />
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
    } else if ('registration-finalize' === payload.actionType) {
        AddressStore.setValue(payload.customer.address)
    } else if ('customer-form-refresh' === payload.actionType) {
        AddressStore.refresh()
    }
})

const AddressInput = React.createClass({
    mixins: [FormElementMixin],
    store: AddressStore,
    getInitialState: function() {
        return {
            value           : AddressStore.getValue(),
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
            <Input hasFeedback
              label       = 'Address'
              ref         = 'input'
              value       = {this.state.value}
              placeholder = "The customer's address"
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'text' />
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
            value           : TinStore.getValue(),
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
    resetValue: function() {
        AppDispatcher.dispatch({
            actionType : 'customer-form-tin-assign',
            value      : ''
        })
    },
    render: function() {
        let addon = this.state.value ? (
            <a onClick={this.resetValue} href='javascript:;'>
                <Glyphicon 
                  style = {{color: '#3e3e3e'}}
                  glyph = 'remove' />
            </a>
        ) : null
        return (
            <Input hasFeedback
              label       = 'TIN'
              ref         = 'input'
              value       = {this.state.value}
              placeholder = 'Taxpayer identification number'
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              addonAfter  = {addon}
              type        = 'text' />
        )
    }
})

const PhoneStore = assign({}, FormItemStore, {
    validate: function() {
        let val = String(this.value)
        if (val.length) { 
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
    } else if ('registration-finalize' === payload.actionType) {
        PhoneStore.setValue(payload.customer.phone)
    } else if ('customer-form-refresh' === payload.actionType) {
        PhoneStore.refresh()
    }
})

const PhoneInput = React.createClass({
    mixins: [FormElementMixin],
    store: PhoneStore,
    getInitialState: function() {
        return {
            value           : PhoneStore.getValue(),
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
            <Input hasFeedback
              label       = 'Phone number'
              ref         = 'input'
              value       = {this.state.value}
              placeholder = "The customer's phone number"
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'text' />
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
    } else if ('registration-finalize' === payload.actionType) {
        AreaStore.setValue(payload.customer.area)
    } else if ('customer-form-refresh' === payload.actionType) {
        AreaStore.refresh()
    }
})

const AreaSelect = React.createClass({
    mixins: [FormElementMixin],
    store: AreaStore,
    getInitialState: function() {
        return {
            value           : AreaStore.getValue(),
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
            <Input hasFeedback
              label       = 'Area'
              ref         = 'input'
              value       = {this.state.value}
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'select'>
                {this.state.value ? null : (
                    <option value=''>
                        Select an area from the list
                    </option>
                )}
                {areas.map(area => {
                    return (
                        <option 
                          key   = {i++}
                          value = {area.name}>
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
    } else if ('registration-finalize' === payload.actionType) {
        PriceCategoryStore.setValue(payload.customer.priceCategory)
    } else if ('customer-form-refresh' === payload.actionType) {
        PriceCategoryStore.refresh()
    }
})

const PriceCategorySelect = React.createClass({
    mixins: [FormElementMixin],
    store: PriceCategoryStore,
    getInitialState: function() {
        return {
            value           : PriceCategoryStore.getValue(),
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
            <Input hasFeedback
              label       = 'Price category'
              ref         = 'input'
              value       = {this.state.value}
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'select'>
                {this.state.value ? null : (
                    <option value=''>
                        Select a price category from the list
                    </option>
                )}
                {categories.map(category => {
                    return (
                        <option 
                          key   = {i++}
                          value = {category.name}>
                          {category.name}
                        </option>
                    )
                })}
            </Input>
        )
    }
})

const LatitudeStore = assign({}, FormItemStore, {
    validate: function() {
        if (!isNaN(this.value)) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint  = 'This value must be a number.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-latitude-assign' === payload.actionType) {
        LatitudeStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        LatitudeStore.reset()
    } else if ('customer-form-refresh' === payload.latitude) {
        LatitudeStore.refresh()
    }
})

const LatitudeInput = React.createClass({
    mixins: [FormElementMixin],
    store: LatitudeStore,
    getInitialState: function() {
        return {
            value           : LatitudeStore.getValue(),
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-latitude-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input hasFeedback
              ref         = 'input'
              value       = {this.state.value}
              label       = 'Latitude'
              placeholder = ""
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'text' />
        )
    }
})

const LongitudeStore = assign({}, FormItemStore, {
    validate: function() {
        if (!isNaN(this.value)) { 
            this.state = 'success'
            this.hint  = null
        } else {
            this.state = 'error'
            this.hint  = 'This value must be a number.'
        }
    }
})

AppDispatcher.register(payload => {
    if ('customer-form-longitude-assign' === payload.actionType) {
        LongitudeStore.setValue(payload.value)
    } else if ('customer-form-reset' === payload.actionType) {
        LongitudeStore.reset()
    } else if ('customer-form-refresh' === payload.longitude) {
        LongitudeStore.refresh()
    }
})

const LongitudeInput = React.createClass({
    mixins: [FormElementMixin],
    store: LongitudeStore,
    getInitialState: function() {
        return {
            value           : LongitudeStore.getValue(),
            validationState : null,
            hint            : null
        }
    },
    update: function(value) {
        AppDispatcher.dispatch({
            actionType : 'customer-form-longitude-assign',
            value      : value
        })
    },
    render: function() {
        return (
            <Input hasFeedback
              ref         = 'input'
              value       = {this.state.value}
              label       = 'Longitude'
              placeholder = ""
              bsStyle     = {this.state.validationState}
              help        = {this.state.hint}
              onChange    = {this.handleChange}
              type        = 'text' />
        )
    }
})

function toFixedDown(number, digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m  = number.toString().match(re)
    return m ? parseFloat(m[1]) : number.valueOf()
}

const CustomersEditForm = React.createClass({
    getDefaultProps: function() {
        return {
            isPartial : false
        }
    },
    getInitialState: function() {
        return {
            editGpsData : false
        }
    },
    onHandleCheckbox: function(event) {
        this.setState({
            editGpsData : !this.state.editGpsData
        })
    },
    handleSubmit: function() {
        let isValid = !!( NameStore.isValid()
                        & AddressStore.isValid()
                        & PhoneStore.isValid()
                        & AreaStore.isValid()
                        & PriceCategoryStore.isValid() )
        if (true !== this.props.isPartial && this.refs.coordinatesVisible.props.value) {
            isValid = !!(isValid & LongitudeStore.isValid() & LatitudeStore.isValid())
        }
        if (!isValid) {
            AppDispatcher.dispatch({
                actionType: 'customer-form-refresh'
            })
        } else {
            let customer = this.props.customer
            customer.name          = NameStore.getValue()
            customer.address       = AddressStore.getValue()
            customer.phone         = PhoneStore.getValue()
            customer.area          = AreaStore.getValue()
            customer.priceCategory = PriceCategoryStore.getValue()
            if (true === this.props.isPartial) {
                AppDispatcher.dispatch({
                    actionType : 'command-invoke',
                    command    : {
                        method   : 'PUT',
                        resource : customer.id,
                        payload  : customer
                    },
                    notification: {
                        message : 'The customer registration was successfully updated.',
                        level   : 'success'
                    }
                })
            } else {
                customer.tin           = TinStore.getValue()
                if (this.refs.coordinatesVisible.props.value) {
                    customer.position = {
                        latitude  : LatitudeStore.getValue(),
                        longitude : LongitudeStore.getValue()
                    }
                }
                AppDispatcher.dispatch({
                    actionType : 'command-invoke',
                    command    : {
                        method   : 'PUT',
                        resource : customer.id,
                        payload  : customer
                    },
                    notification: {
                        message : 'The customer was successfully updated.',
                        level   : 'success'
                    }
                })
            }
            if ('function' === typeof this.props.onSubmit) {
                this.props.onSubmit()
            }
            this.resetForm()
        }
    },
    resetForm: function() {
        AppDispatcher.dispatch({
            actionType: 'customer-form-reset'
        })
    },
    handleCancel: function() {
        if ('function' === typeof this.props.onCancel) {
            this.props.onCancel()
        }
    },
    componentDidMount: function() {
        let customer = this.props.customer
        if (customer) {
            AppDispatcher.dispatch({
                actionType : 'customer-form-name-assign',
                value      : customer.name
            })
            AppDispatcher.dispatch({
                actionType : 'customer-form-address-assign',
                value      : customer.address
            })
            AppDispatcher.dispatch({
                actionType : 'customer-form-tin-assign',
                value      : customer.tin
            })
            AppDispatcher.dispatch({
                actionType : 'customer-form-phone-assign',
                value      : customer.phone
            })
            AppDispatcher.dispatch({
                actionType : 'customer-form-area-assign',
                value      : customer.area
            })
            AppDispatcher.dispatch({
                actionType : 'customer-form-price-category-assign',
                value      : customer.priceCategory
            })
            if (customer.position && customer.position.latitude && customer.position.longitude) {
                AppDispatcher.dispatch({
                    actionType : 'customer-form-latitude-assign',
                    value      : customer.position.latitude
                })
                AppDispatcher.dispatch({
                    actionType : 'customer-form-longitude-assign',
                    value      : customer.position.longitude
                })
            }
        }
    },
    render: function() {
        let gps = (true !== this.props.isPartial && this.state.editGpsData) ? (
            <Row>
                <Col md={6}>
                    <LatitudeInput />
                </Col>
                <Col md={6}>
                    <LongitudeInput />
                </Col>
            </Row>
        ) : <span />
        return (
            <div>
                <NameInput />
                <AddressInput />
                {true === this.props.isPartial ? null : (
                    <TinInput />
                )}
                <PhoneInput />
                <AreaSelect />
                <PriceCategorySelect />
                {true === this.props.isPartial ? null : (
                    <Input 
                       label    = 'GPS coordinates'
                       ref      = 'coordinatesVisible'
                       value    = {this.state.editGpsData}
                       onChange = {this.onHandleCheckbox}
                       type     = 'checkbox' />
                )}
                {gps}
                <hr />
                <ButtonGroup>
                    <Button
                      bsStyle = 'primary'
                      onClick = {this.handleSubmit}>
                        <Glyphicon 
                          glyph='ok' />
                        Save
                    </Button>
                    <Button
                      bsStyle = 'default'
                      onClick = {this.handleCancel}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>
        )
    }
})

const CustomersRegistrationForm = React.createClass({
    registrationCallback: null,
    getDefaultProps: function() {
        return {
            isPartial : false
        }
    },
    getInitialState: function() {
        return {
            template    : '',
            geoLocation : null
        }
    },
    componentDidMount: function() {
        this.resetForm()
        if (navigator.geolocation && true !== this.props.ispartial) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({geoLocation: {
                    latitude  : position.coords.latitude,
                    longitude : position.coords.longitude,
                    accuracy  : position.coords.accuracy
                }})
            })
        }
        this.registrationCallback = AppDispatcher.register(payload => {
            if ('registration-finalize' === payload.actionType) {
                this.setState({
                    template : payload.template
                })
            } 
        })
    },
    componentWillUnmount: function() {
        AppDispatcher.unregister(this.registrationCallback)
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
                phone         : PhoneStore.getValue(),
                area          : AreaStore.getValue(),
                priceCategory : PriceCategoryStore.getValue()
            }
            if (true !== this.props.isPartial) {
                customer.tin = TinStore.getValue()
                customer.position = this.state.geoLocation
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
                var template
                if (this.state.template && (template = DataStore.getItem(this.state.template))) {
                    AppDispatcher.dispatch({
                        actionType : 'command-invoke',
                        command    : {
                            method   : 'DELETE',
                            resource : template.id
                        }
                    })
                    let task = template.getLink('task')
                    if (task) {
                        AppDispatcher.dispatch({
                            actionType : 'command-invoke',
                            command    : {
                                method   : 'DELETE',
                                resource : task
                            }
                        })
                    }
                }
                this.props.onNewRegistration()
            } else {
                let task = {
                    'description' : "Attend to registration for customer '" + customer.name + "'.",
                    'created'     : Date.now(),
                    '_links'      : {
                        '_collection' : { href: customer.id }
                    }
                }
                AppDispatcher.dispatch({
                    actionType    : 'customer-partial-registration',
                    customer      : customer,
                    task          : task
                })
                this.props.onNewRegistration(true)
            }
            this.resetForm()
        }
    },
    resetForm: function() {
        AppDispatcher.dispatch({
            actionType: 'customer-form-reset'
        })
        this.setState({template: ''})
    },
    renderGpsData: function() {
        if (true === this.props.isPartial || !this.state.geoLocation) 
            return null
        let lat = toFixedDown(this.state.geoLocation.latitude, 2),
            lng = toFixedDown(this.state.geoLocation.longitude, 2)
        return (
            <div className='form-group'>
                <label className='control-label'>Your current location</label>
                <ol className='breadcrumb gps-location'>
                    <li>
                        <b>Latitude:</b> {lat}
                    </li>
                    <li>
                        <b>Longitude:</b> {lng}
                    </li>
                    <li>
                        <b>Accuracy:</b> {this.state.geoLocation.accuracy}
                    </li>
                </ol>
            </div>
        )
    },
    render: function() {
        return (
            <Panel>
                {this.renderGpsData()}
                <NameInput />
                <AddressInput />
                {true === this.props.isPartial ? null : (
                    <TinInput />
                )}
                <PhoneInput />
                <AreaSelect />
                <PriceCategorySelect />
                <hr />
                <ButtonGroup>
                    <Button
                      bsStyle = 'primary'
                      onClick = {this.handleSubmit}>
                        <Glyphicon glyph='ok' />
                        Save
                    </Button>
                    <Button
                      bsStyle = 'default'
                      onClick = {this.resetForm}>
                        Reset
                    </Button>
                </ButtonGroup>
            </Panel>
        )
    }
})

module.exports = {CustomersRegistrationForm, CustomersEditForm}
