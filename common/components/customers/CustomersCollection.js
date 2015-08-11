import Bootstrap                  from 'react-bootstrap'
import Griddle                    from 'griddle-react'
import React                      from 'react'

import AppDispatcher              from '../../dispatcher/AppDispatcher'
import BootstrapPager             from '../BootstrapPager'
import DataStore                  from '../../store/DataStore'
import MapComponent               from '../MapComponent'
import PendingRegistrationsView   from './PendingRegistrationsView'

import {CustomersRegistrationForm} from './CustomersForm'
import {Badge, Glyphicon, Modal, Button, Panel, TabPane, TabbedArea} from 'react-bootstrap'

const CustomersCollection = React.createClass({
    registrationCallback: null,
    getDefaultProps: function() {
        return {
            activeKey      : 1,
            resultsPerPage : 8,
            registrations  : [],
            customers      : [],
            isPartial      : false
        }
    },
    getInitialState: function() {
        return {
            key           : this.props.activeKey,
            collapsed     : window.innverWidth < 992,
            modalVisible  : false,
            latitude      : 0,
            longitude     : 0
        }
    },
    handleSelect: function(key) {
        this.setState({key: key})
        this.refs.customerRegistrationForm.resetForm()
    },
    //handlePartial: function() {
    //    this.setState({key: 2})
    //},
    handleNewRegistration: function(isPartial) {
        let key = true === isPartial ? 3 : 1
        this.setState({key: key})
    },
    handleResize: function() {
        let innerWidth = window.innerWidth,
            oldVal = this.state.collapsed,
            newVal = innerWidth < 992
        if (oldVal != newVal)
            this.setState({collapsed: newVal})
    },
    componentDidMount: function() {
        //DataStore.on('registration-finalize', this.handlePartial)
        this.handleResize()
        window.addEventListener('resize', this.handleResize)
        this.registrationCallback = AppDispatcher.register(payload => {
            if ('registration-finalize' === payload.actionType) {
                this.setState({key: 2})
            } 
        })
    },
    componentWillUnmount: function() {
        //DataStore.removeListener('registration-finalize', this.handlePartial)
        window.removeEventListener('resize', this.handleResize)
        AppDispatcher.unregister(this.registrationCallback)
    },
    handleRowClick: function(row, event) {
        //if ('BUTTON' === event.target.nodeName || 'BUTTON' === event.target.parentNode.nodeName) {
        //    let position = row.props.data.position
        //    if (position) {
        //        //this.setState({
        //        //    latitude     : position.latitude,
        //        //    longitude    : position.longitude,
        //        //    modalVisible : true
        //        //})
        //        let lat = position.latitude,
        //            lng = position.longitude
        //        window.location = 'https://www.google.com/maps/dir//' + lat + ',' + lng + '/@' + lat + ',' + lng + ',13z'
        //        return
        //    }
        //}
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
                'columnName'      : '_local',
                'displayName'     : '',
                'cssClassName'    : 'text-center',
                'customComponent' : React.createClass({
                    render: function() {
                        if (this.props.rowData['_local'])
                            return (
                                <Glyphicon glyph='phone' bsSize='xsmall' />
                            )
                        else
                            return (
                                <span />
                            )
                    }
                })
            }, 
            {
                'columnName'      : 'name',
                'displayName'     : 'Name',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <span>
                                <Glyphicon 
                                  glyph  = 'user'
                                  bsSize = 'xsmall'
                                  style  = {{marginRight: '.3em'}} />
                                {this.props.rowData.name}
                            </span>
                        )
                    }
                })
            }, 
            {
                'columnName'      : 'address',
                'displayName'     : 'Address'
            },
            {
                'columnName'      : 'tin',
                'displayName'     : 'TIN'
            },
            {
                'columnName'      : 'phone',
                'displayName'     : 'Phone number'
            },
            {
                'columnName'      : 'area',
                'displayName'     : 'Area'
            },
            {
                'columnName'      : 'priceCategory',
                'displayName'     : 'Price category'
            },
            {
                'columnName'      : 'position',
                'displayName'     : 'Location',
                'customComponent' : React.createClass({
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
                              bsStyle = 'default'
                              bsSize  = 'xsmall'>
                                <Glyphicon 
                                  glyph='map-marker' />
                                Show directions
                            </Button>
                        )
                    }
                })
            }
        ]
        let count = this.props.registrations.length,
            pendingRegistrationsTab = count ? (
            <span>
                Pending registrations
                <Badge>{count}</Badge>
            </span>
        ) : (
            <span>Pending registrations</span>
        )
        return (
            <div>
                <Modal
                  bsSize = 'large'
                  show   = {this.state.modalVisible}
                  onHide = {this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Map
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MapComponent 
                          label     = ''
                          latitude  = {this.state.latitude}
                          longitude = {this.state.longitude} />
                    </Modal.Body>
                </Modal>
                <Panel 
                  className = 'panel-fill'
                  header    = 'Customers'
                  bsStyle   = 'primary'>
                    <TabbedArea fill 
                      animation = {false}
                      activeKey = {this.state.key}
                      onSelect  = {this.handleSelect}>
                        <TabPane 
                          eventKey = {1}
                          tab      = 'All customers'>
                            <Panel>
                                <Griddle 
                                  results                 = {this.props.customers}
                                  showFilter              = {true}
                                  resultsPerPage          = {this.props.resultsPerPage}
                                  useGriddleStyles        = {false}
                                  columnMetadata          = {metadata}
                                  onRowClick              = {this.handleRowClick}
                                  useCustomPagerComponent = {true}
                                  customPagerComponent    = {BootstrapPager}
                                  tableClassName          = 'table table-bordered table-select'
                                  columns                 = {columns} />
                            </Panel>
                        </TabPane>
                        <TabPane eventKey={2} tab='Register new customer'>
                            <CustomersRegistrationForm 
                              ref               = 'customerRegistrationForm'
                              isPartial         = {this.props.isPartial}
                              onNewRegistration = {this.handleNewRegistration} />
                        </TabPane>
                        <TabPane eventKey={3} tab={pendingRegistrationsTab}>
                            <PendingRegistrationsView 
                              showActions       = {!this.props.isPartial}
                              registrations     = {this.props.registrations} />
                        </TabPane>
                    </TabbedArea>
                </Panel>
            </div>
        )
    }
})

module.exports = CustomersCollection
