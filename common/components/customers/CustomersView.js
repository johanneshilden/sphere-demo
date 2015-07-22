var Bootstrap                = require('react-bootstrap');
var Griddle                  = require('griddle-react');
var React                    = require('react');
var PendingRegistrationsView = require('./PendingRegistrationsView');
var DataStore                = require('../../store/DataStore');
var AppDispatcher            = require('../../dispatcher/AppDispatcher');
var BootstrapPager           = require('../BootstrapPager');

var Panel                    = Bootstrap.Panel;
var TabPane                  = Bootstrap.TabPane;
var TabbedArea               = Bootstrap.TabbedArea;
var Button                   = Bootstrap.Button;
var ButtonGroup              = Bootstrap.ButtonGroup;
var Input                    = Bootstrap.Input;

var NameInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null,
            length = newValue.length;
        if (length > 2) { 
            validationState = 'success'; 
        } else {
            validationState = 'error'; 
            if (length) {
                hint = 'The name must be at least 3 characters long.';
            } else {
                hint = 'This value is required.';
            }
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        }); 
        return ('success' === validationState);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
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
        );
    }
});

var AddressInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null,
            length = newValue.length;
        if (length) { 
            validationState = 'success'; 
        } else {
            validationState = 'error'; 
            hint = 'This value is required.';
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        }); 
        return ('success' === validationState);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
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
        );
    }
});

var TinInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null,
            length = newValue.length;
        if (length) { 
            validationState = 'success'; 
        } else {
            validationState = 'error'; 
            hint = 'This value is required.';
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        }); 
        return ('success' === validationState);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
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
        );
    }
});

var PhoneInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null,
            length = newValue.length;
        if (length) { 
            validationState = 'success'; 
            if (!/^\+?[0-9\.\-\s]+$/.test(newValue)) {
                validationState = 'error'; 
                hint = 'Not a phone number.';
            }
        } else {
            validationState = 'error'; 
            hint = 'This value is required.';
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        }); 
        return ('success' === validationState);
    },
    reset: function() {
        this.setState(this.getInitialState());
    },
    isValid: function() {
        return ('success' === this.state.validationState);
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
        );
    }
});

var AreaSelect = React.createClass({
    fetchAreas: function() {
        var areas = DataStore.fetchCollection('areas');
        if (!areas || !areas.length) {
            areas = [{
                'name': 'Global'
            }];
        }
        for (var i = 0; i < areas.length; i++) {
            areas[i].key = 'area-' + i;
        }
        this.setState({areas: areas});
    },
    getInitialState: function() {
        return {
            areas: [],
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null;
        if (!newValue) {
            validationState = 'error';
            hint = 'You must select an area.';
        } else {
            validationState = 'success';
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        });
        return ('success' === validationState);
    },
    componentDidMount: function() {
        this.fetchAreas();
        DataStore.on('change', this.fetchAreas);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchAreas);
    },
    reset: function() {
        this.setState(this.getInitialState());
        this.fetchAreas();
    },
    isValid: function() {
        return ('success' === this.state.validationState);
    },
    renderPlaceholder: function() {
        if (this.state.value) 
            return null;
        return (
            <option
              value=''>
                Select an area from the list
            </option>
        );
    },
    render: function() {
        var areas = this.state.areas;
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
                {this.renderPlaceholder()}
                {areas.map(function(area) {
                    return (
                        <option 
                          key={area.key} 
                          value={area.name}>
                          {area.name}
                        </option>
                    );
                })}
            </Input>
        );
    }
});

var PriceCategorySelect = React.createClass({
    fetchPriceCategories: function() {
        var categories = DataStore.fetchCollection('price-categories');
        if (!categories || !categories.length) {
            categories = [{
                'name': 'Default', 
            }];
        }
        for (var i = 0; i < categories.length; i++) {
            categories[i].key = 'price-category--' + i;
        }
        this.setState({categories: categories});
    },
    getInitialState: function() {
        return {
            categories: [],
            value: '',
            hint: null,
            validationState: null
        };
    },
    handleChange: function(event) {
        this._update(event.target.value);
    },
    forceValidate: function() {
        this._update(this.state.value);
    },
    _update: function(newValue) {
        var hint = null,
            validationState = null;
        if (!newValue) {
            validationState = 'error';
            hint = 'You must select a price category.';
        } else {
            validationState = 'success';
        }
        this.setState({
            value: newValue,
            hint: hint,
            validationState: validationState
        });
        return ('success' === validationState);
    },
    componentDidMount: function() {
        this.fetchPriceCategories();
        DataStore.on('change', this.fetchPriceCategories);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchPriceCategories);
    },
    reset: function() {
        this.setState(this.getInitialState());
        this.fetchPriceCategories();
    },
    isValid: function() {
        return ('success' === this.state.validationState);
    },
    renderPlaceholder: function() {
        if (this.state.value) 
            return null;
        return (
            <option
              value=''>
                Select a price category from the list
            </option>
        );
    },
    render: function() {
        var categories = this.state.categories;
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
                {this.renderPlaceholder()}
                {categories.map(function(category) {
                    return (
                        <option 
                          key={category.key} 
                          value={category.name}>
                          {category.name}
                        </option>
                    );
                })}
            </Input>
        );
    }
});

var CustomerRegistrationForm = React.createClass({
    getInitialState: function() {
        return {
            template: '',
            geoLocation: null
        };
    },
    handlePartial: function(resource) {
        var partial = DataStore.store.getItem(resource);
        if (partial) {
            this.resetForm();
            this.setState({template: resource});
            this.refs.customerName._update(partial.name);
            this.refs.customerAddress._update(partial.address);
            this.refs.customerPhone._update(partial.phone);
            this.refs.customerArea._update(partial.area);
        }
    },
    componentDidMount: function() {
        DataStore.on('registration-finalize', this.handlePartial);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                this.setState({geoLocation: {
                    latitude  : position.coords.latitude,
                    longitude : position.coords.longitude
                }});
            }.bind(this));
        }
    },
    componentWillUnmount: function() {
        DataStore.removeListener('registration-finalize', this.handlePartial);
    },
    handleSubmit: function() {
        var isValid = (this.refs.customerName.isValid()
            & this.refs.customerAddress.isValid()
            & this.refs.customerTin.isValid()
            & this.refs.customerPhone.isValid()
            & this.refs.customerArea.isValid()
            & this.refs.customerPriceCategory.isValid()
            & this.refs.customerArea.isValid());
        if (!isValid) {
            this.refs.customerName.forceValidate();
            this.refs.customerAddress.forceValidate();
            this.refs.customerTin.forceValidate();
            this.refs.customerPhone.forceValidate();
            this.refs.customerArea.forceValidate();
            this.refs.customerPriceCategory.forceValidate();
            this.refs.customerArea.forceValidate();
        } else {
            var customer = {
                name          : this.refs.customerName.state.value,
                address       : this.refs.customerAddress.state.value,
                tin           : this.refs.customerTin.state.value,
                phone         : this.refs.customerPhone.state.value,
                area          : this.refs.customerArea.state.value,
                priceCategory : this.refs.customerPriceCategory.state.value,
                position      : this.state.geoLocation
            };
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
            });
            AppDispatcher.dispatch({
                actionType : 'command-invoke',
                command    : {
                    method   : 'DELETE',
                    resource : this.state.template
                }
            });
            this.props.onNewRegistration();
            this.resetForm();
        } 
    },
    resetForm: function() {
        this.refs.customerName.reset();
        this.refs.customerAddress.reset();
        this.refs.customerTin.reset();
        this.refs.customerPhone.reset();
        this.refs.customerArea.reset();
        this.refs.customerPriceCategory.reset();
        this.setState({template: ''});
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
                        Save
                    </Button>
                    <Button
                      bsStyle='default'
                      onClick={this.resetForm}>
                        Reset
                    </Button>
                </ButtonGroup>
            </Panel>
        );
    }
});

var CustomersView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage: 8
        };
    },
    getInitialState: function() {
        return {
            key       : 1,
            collapsed : window.innverWidth < 992
        };
    },
    handleSelect: function(key) {
        this.setState({key: key});
    },
    handlePartial: function() {
        this.setState({key: 2});
    },
    handleNewRegistration: function() {
        this.setState({key: 1});
    },
    handleResize: function() {
        var innerWidth = window.innerWidth,
            oldVal = this.state.collapsed,
            newVal = innerWidth < 992;
        if (oldVal != newVal)
            this.setState({collapsed: newVal});
    },
    componentDidMount: function() {
        DataStore.on('registration-finalize', this.handlePartial);
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount: function() {
        DataStore.removeListener('registration-finalize', this.handlePartial);
        window.removeEventListener('resize', this.handleResize);
    },
    render: function() {
        var columns = this.state.collapsed
            ? ['_local', 'name', 'area', 'priceCategory', 'position']
            : ['_local', 'name', 'address', 'phone', 'area', 'priceCategory', 'position'];
        var metadata = [
            {
                'columnName': '_local', 
                'displayName': '',
                'cssClassName': 'text-center',
                'customComponent': React.createClass({
                    render: function() {
                        if (this.props.rowData['_local'])
                            return (
                                <span className='glyphicon glyphicon-flag'></span>
                            );
                        else
                            return (
                                <span />
                            );
                    }
                })
            }, 
            {
                'columnName': 'name', 
                'displayName': 'Name',
                'customComponent': React.createClass({
                    render: function() {
                        return (
                            <a href={'#' + this.props.rowData.href}>{this.props.rowData.name}</a>
                        );
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
                'displayName': 'Position',
                'customComponent': React.createClass({
                    render: function() {
                        var position = this.props.rowData.position;
                        if (!position || !position.latitude || !position.longitude) {
                            return ( 
                                <span>Unknown</span>
                            );
                        }
                        return (
                            <a 
                              href={'http://maps.google.com/?ie=UTF8&hq=&ll=' + position.latitude + ',' + position.longitude + '&z=16'} 
                              className='btn btn-default btn-xs btn-block' 
                              role='button'>
                                <span 
                                  className='glyphicon glyphicon-map-marker' 
                                  aria-hidden={true}></span>Show on map
                            </a>
                        );
                    }
                })
            }
        ];
        return (
            <Panel 
              className='panel-fill'
              header='Customers' 
              bsStyle='primary'>
                <TabbedArea fill 
                  animation={false}
                  activeKey={this.state.key} 
                  onSelect={this.handleSelect}>
                    <TabPane eventKey={1} tab='All customers'>
                        <Panel>
                            <Griddle 
                              results={this.props.customers} 
                              showFilter={true}
                              resultsPerPage={this.props.resultsPerPage}
                              useGriddleStyles={false}
                              columnMetadata={metadata}
                              useCustomPagerComponent={true}
                              customPagerComponent={BootstrapPager}
                              tableClassName='table table-bordered table-select table-condensed' 
                              columns={columns} />
                        </Panel>
                    </TabPane>
                    <TabPane eventKey={2} tab="Register new customer">
                        <CustomerRegistrationForm 
                          onNewRegistration={this.handleNewRegistration} />
                    </TabPane>
                    <TabPane eventKey={3} tab="Pending registrations">
                        <PendingRegistrationsView />
                    </TabPane>
                </TabbedArea>
            </Panel>
        );
    }
});

module.exports = CustomersView;
