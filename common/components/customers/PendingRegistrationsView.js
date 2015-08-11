import Bootstrap           from 'react-bootstrap'
import Griddle             from 'griddle-react'
import React               from 'react'

import AppDispatcher       from '../../dispatcher/AppDispatcher'
import BootstrapPager      from '../BootstrapPager'
import DataStore           from '../../store/DataStore'

import {Glyphicon, Button, ButtonGroup, DropdownButton, MenuItem, Modal, Panel} from 'react-bootstrap'

const DeleteRegistrationModal = React.createClass({
    confirmDelete: function() {
        AppDispatcher.dispatch({
            actionType   : 'command-invoke',
            command      : {
                method     : 'DELETE',
                resource   : this.props.regHref
            },
            notification : {
                message    : 'The customer registration was deleted.',
                level      : 'success'
            }
        })
        this.props.close()
    },
    render: function() {
        return (
            <Modal
              onHide = {this.props.close}
              show   = {this.props.show}>
                <Modal.Header>
                    <Modal.Title>Confirm action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>
                        Cancel
                    </Button>
                    <Button 
                      bsStyle = 'danger'
                      onClick = {this.confirmDelete}>
                        <Bootstrap.Glyphicon glyph='ok' />
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
})

const PendingRegistrationsView = React.createClass({
    getDefaultProps: function() {
        return {
            showActions : true
        }
    },
    getInitialState: function() {
        return {
            data         : [],
            regHref      : null,
            modalVisible : false
        }
    },
    confirmDeleteRegistration: function(href) {
        this.setState({
            modalVisible : true,
            regHref      : href
        })
    },
    finalizeRegistration: function(resource) {
        let partial = DataStore.getItem(resource)
        if (partial) {
            AppDispatcher.dispatch({
                actionType : 'registration-finalize',
                customer   : partial,
                template   : resource
            })
        }
    },
    closeModal: function() {
        this.setState({modalVisible: false})
    },
    handleRowClick: function(row, event) {
        //if ('TD' === event.target.nodeName) {
        //    DataStore.emit('registration-finalize', row.props.data.id)
        //}
    },
    render: function() {
        var self = this
        let metadata = [
            {'columnName' : 'name',          'displayName' : 'Name'},
            {'columnName' : 'address',       'displayName' : 'Address'},
            {'columnName' : 'phone',         'displayName' : 'Phone number'},
            {'columnName' : 'area',          'displayName' : 'Area'},
            {'columnName' : 'priceCategory', 'displayName' : 'Price category'},
            {
                'columnName'      : 'actions',
                'displayName'     : '',
                'customComponent' : React.createClass({
                    render: function() {
                        if (true === self.props.showActions) {
                            return (
                                <DropdownButton 
                                  className       = 'btn-block'
                                  buttonClassName = 'btn-block'
                                  bsSize          = 'xsmall'
                                  title           = 'Actions'>
                                    <MenuItem 
                                      onSelect = {() => self.finalizeRegistration(this.props.rowData.id)}
                                      eventKey = {1}>
                                        <i className='fa fa-fw fa-pencil'></i>
                                        Finalize
                                    </MenuItem>
                                    <MenuItem 
                                      onSelect = {() => self.confirmDeleteRegistration(this.props.rowData.id)}
                                      eventKey = {2}>
                                        <i className='fa fa-fw fa-remove'></i>
                                        Delete
                                    </MenuItem>
                                </DropdownButton>
                            )
                        } else {
                            return (
                                <Button
                                  onClick = {() => {
                                      window.location.hash = this.props.rowData.id + '/edit' 
                                  }}
                                  bsSize  = 'xsmall'>
                                    <Glyphicon glyph='pencil' />
                                    Edit
                                </Button>
                            )
                        }
                    }
                })
            }
        ]

        return (
            <div>
                <DeleteRegistrationModal 
                  show    = {this.state.modalVisible}
                  regHref = {this.state.regHref}
                  close   = {this.closeModal} />
                <Panel>
                    <Griddle 
                      results                 = {this.props.registrations}
                      tableClassName          = 'table table-bordered table-select'
                      showFilter              = {true}
                      resultsPerPage          = {20}
                      useGriddleStyles        = {false}
                      onRowClick              = {this.handleRowClick}
                      useCustomPagerComponent = {true}
                      customPagerComponent    = {BootstrapPager}
                      columnMetadata          = {metadata}
                      columns                 = {['name', 'address', 'phone', 'priceCategory', 'area', 'actions']} />
                </Panel>
            </div>
        )
    }
})

module.exports = PendingRegistrationsView
