import Bootstrap                     from 'react-bootstrap'
import Griddle                       from 'griddle-react'
import React                         from 'react'
import TimeAgo                       from 'react-timeago'

import AppDispatcher                 from '../../dispatcher/AppDispatcher'
import BootstrapPager                from '../BootstrapPager'
import ComplaintsEntityView          from './ComplaintsEntityView'
import DataStore                     from '../../store/DataStore'

import {Button, Modal, Panel, Table, Label} from 'react-bootstrap'

const ComplaintsView = React.createClass({
    getInitialState: function() {
        return {
            collapsed       : window.innverWidth < 769,
            activeComplaint : null
        }
    },
    getDefaultProps: function() {
        return {
            showCustomer : true
        }
    },
    handleResize: function(e) {
        let innerWidth = window.innerWidth,
            oldVal = this.state.collapsed,
            newVal = innerWidth < 769
        if (oldVal != newVal) {
            this.setState({collapsed: newVal})
        }
    },
    viewComplaint: function(row) {
        this._setComplaint(row.props.data.id)
    },
    updateComplaint: function() {
        if (!this.state.activeComplaint)
            return
        this._setComplaint(this.state.activeComplaint.id)
    },
    _setComplaint: function(complaintId) {
        let complaint = DataStore.getItem(complaintId)
        if (complaint) {
            complaint.customer = complaint.getEmbedded('customer')
            if (complaint.items) {
                complaint.items.forEach(item => {
                    item.product = item['_embedded']['product']
                })
            }
            this.setState({activeComplaint: complaint})
        }
    },
    closeModal: function() {
        this.setState({activeComplaint: null})
    },
    componentDidMount: function() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)
        DataStore.on('change', this.updateComplaint)
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize)
        DataStore.removeListener('change', this.updateComplaint)
    },
    render: function() {
        const metadata = [
            {
                'columnName'      : 'customer',
                'displayName'     : 'Customer',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <span>{this.props.rowData.customer.name}</span>
                        )
                    }
                })
            },
            {
                'columnName'      : 'created',
                'displayName'     : 'Created',
                'customComponent' : React.createClass({
                    render: function() {
                        let created = this.props.rowData.created
                        return (
                            <TimeAgo 
                              date      = {Number(created)}
                              formatter = {DataStore.timeFormatter} />
                        )
                    }
                })
            },
            {
                'columnName'      : 'type',
                'displayName'     : 'Type',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <span>{'quality' === this.props.rowData.type ? 'Quality' : 'Service'}</span>
                        )
                    }
                })
            },
            {
                'columnName'      : 'resolved',
                'displayName'     : 'Status',
                'customComponent' : React.createClass({
                    render: function() {
                        let resolved = this.props.rowData.resolved
                        if (!resolved) {
                            return (
                                <h4 style={{margin: '0 0 .2em'}}>
                                    <Label
                                      bsStyle='danger'>
                                        Unresolved
                                    </Label>
                                </h4>
                            )
                        }
                        return (
                            <span>
                                <Bootstrap.Glyphicon 
                                  style={{marginRight: '.4em'}}
                                  glyph='ok' />
                                Resolved&nbsp;
                                <TimeAgo 
                                  date      = {Number(resolved)}
                                  formatter = {DataStore.timeFormatter} />
                            </span>
                        )
                    }
                })
            },
            {
                'columnName'  : 'user',
                'displayName' : 'User'
            },
            {
                'columnName'      : 'description',
                'displayName'     : 'Description',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <span>{this.props.rowData.description}</span>
                        )
                    }
                })
            },
        ]

        let columns = this.state.collapsed
            ? ['created', 'type', 'user', 'resolved']
            : ['created', 'type', 'description', 'user', 'resolved']

        if (true === this.props.showCustomer) {
            columns.unshift('customer')
        }

        const rowMetaData = {
          'bodyCssClassName': function(data) {
                if (!data.resolved) {
                    return 'unresolved'
                } 
            }
        }

        return (
            <div>
                <Modal 
                  onHide = {this.closeModal}
                  show   = {!!this.state.activeComplaint}>
                    <Modal.Header 
                      closeButton 
                      onHide={this.closeModal}>
                        <Modal.Title>
                            Complaint details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ComplaintsEntityView 
                          onResolve={this.closeModal}
                          complaint={this.state.activeComplaint} />
                    </Modal.Body>
                </Modal>
                <Griddle 
                  results                 = {this.props.complaints}
                  showFilter              = {true}
                  resultsPerPage          = {20}
                  initialSort             = 'created'
                  initialSortAscending    = {false}
                  rowMetadata             = {rowMetaData}
                  useGriddleStyles        = {false}
                  columnMetadata          = {metadata}
                  onRowClick              = {this.viewComplaint}
                  useCustomPagerComponent = {true}
                  customPagerComponent    = {BootstrapPager}
                  tableClassName          = 'table table-bordered table-select'
                  columns                 = {columns} />
            </div>
        )
    }
})

module.exports = ComplaintsView
