import Bootstrap           from 'react-bootstrap'
import Griddle             from 'griddle-react'
import React               from 'react'
import TimeAgo             from 'react-timeago'

import AppDispatcher       from '../../dispatcher/AppDispatcher'
import BootstrapPager      from '../BootstrapPager'
import DataStore           from '../../store/DataStore'

import {Panel, Modal, Button, Table} from 'react-bootstrap'

const ActivitiesView = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage : 8
        }
    },
    render: function() {
        const metadata = [
            {
                'columnName'      : 'created',
                'displayName'     : 'Created',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <TimeAgo 
                              date      = {Number(this.props.rowData.created)}
                              formatter = {DataStore.timeFormatter} />
                        )
                    }
                })
            }, 
            {
                'columnName'      : 'type',
                'displayName'     : 'Activity type',
                'customComponent' : React.createClass({
                    render: function() {
                        let tp = this.props.rowData.type
                        switch (tp) {
                            case 'callback-register':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='earphone' />
                                        Callback registered
                                    </span>
                                )
                            case 'complaint-register':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='thumbs-down' />
                                        Complaint registered
                                    </span>
                                )
                            case 'contact-add':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='envelope' />
                                        Contact added
                                    </span>
                                )
                            case 'complaint-resolve':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='ok' />
                                        Complaint resolved
                                    </span>
                                )
                            case 'order-create':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='shopping-cart' />
                                        Order created
                                    </span>
                                )
                            case 'followup-visit-register':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='home' />
                                        Follow-up visit scheduled
                                    </span>
                                )
                            case 'no-action':
                                return (
                                    <span>
                                        <Bootstrap.Glyphicon 
                                          style={{marginRight: '.4em'}}
                                          glyph='remove' />
                                        No action
                                    </span>
                                )
                            default:
                                return (
                                    <span>
                                        {tp}
                                    </span>
                                )
                         }
                    }
                })
            },
            {
                'columnName'  : 'activity',
                'displayName' : 'Originated from'
            },
            {
                'columnName'      : 'resource',
                'displayName'     : 'Resource',
                'customComponent' : React.createClass({
                    render: function() {
                        let resource = this.props.rowData.resource
                        if (!resource) {
                            return (
                                <span />
                            )
                        }
                        return (
                            <span>
                                <a href={'#/' + resource}>
                                    {resource}
                                </a>
                            </span>
                        )
                    }
                })
            }
        ]

        const columns = ['created', 'type', 'activity', 'resource']

        return (
            <Griddle
              results                 = {this.props.activities}
              resultsPerPage          = {this.props.resultsPerPage}
              useGriddleStyles        = {false}
              columnMetadata          = {metadata}
              initialSort             = 'created'
              initialSortAscending    = {false}
              useCustomPagerComponent = {true}
              onRowClick              = {row => {
                  let resource = row.props.data.resource
                  if (resource) {
                      window.location.hash = resource
                  }
              }}
              customPagerComponent    = {BootstrapPager}
              columns                 = {columns}
              tableClassName          = 'table table-bordered table-select' />
        )
    }
})

module.exports = ActivitiesView
