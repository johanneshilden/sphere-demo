import Bootstrap          from 'react-bootstrap'
import Griddle            from 'griddle-react'
import React              from 'react'
import TimeAgo            from 'react-timeago'

import AppDispatcher      from '../../dispatcher/AppDispatcher'
import DataStore          from '../../store/DataStore'

import {Glyphicon, Button, Table} from 'react-bootstrap'

const ComplaintsView = React.createClass({
    getDefaultProps: function() {
        return {
            onResolve: function() {}
        }
    },
    resolve: function() {
        let patch = { resolved: Date.now() }
        let complaint = this.props.complaint
        AppDispatcher.dispatch({
            actionType : 'customer-activity',
            command    : {
                method   : 'PATCH',
                resource : complaint.id, 
                payload  : patch
            },
            activity   : {
                'type'     : 'complaint-resolve',
                'activity' : '',
                'created'  : Date.now(),
                '_links'   : {
                    '_collection' : complaint['_links']['customer']
                }
            }, 
            notification : {
                message : 'The complaint was successfully resolved.',
                level   : 'success'
            }
        })
        this.props.onResolve()
    },
    renderButton: function() {
        let complaint = this.props.complaint
        if (!complaint || !!complaint.resolved) {
            return <span /> 
        }
        return (
            <div>
                <Button 
                  onClick={this.resolve} 
                  block>
                    <Glyphicon glyph='ok' />
                    Resolve
                </Button>
            </div>
        )
    },
    render: function() {
        let complaint = this.props.complaint
        if (!complaint) {
            return (
                <span>Error: Invalid or missing record.</span>
            )
        }
        let i = 0
        return (
            <div>
                <Table striped bordered fill>
                    <col width='130' />
                    <col />
                    <tbody>
                        <tr>
                            <td><b>Customer</b></td>
                            <td>{complaint.customer.name}</td>
                        </tr>
                        <tr>
                            <td><b>Type</b></td>
                            <td>{('quality' === complaint.type) ? 'Quality' : 'Service'}</td>
                        </tr>
                        <tr>
                            <td><b>Created</b></td>
                            <td>
                                <TimeAgo 
                                  date      = {Number(complaint.created)}
                                  formatter = {DataStore.timeFormatter} />
                            </td>
                        </tr>
                        <tr>
                            <td><b>Status</b></td>
                            <td>{complaint.resolved ? (
                                <span>
                                    <Bootstrap.Glyphicon 
                                      style={{marginRight: '.4em'}}
                                      glyph='ok' />
                                    <span>Resolved&nbsp;
                                        <TimeAgo 
                                          date      = {Number(complaint.resolved)}
                                          formatter = {DataStore.timeFormatter} />
                                    </span>
                                </span>
                            ) : (
                                <h4 style={{margin: '0 0 .2em'}}>
                                    <Bootstrap.Label
                                      bsStyle='danger'>
                                        Unresolved
                                    </Bootstrap.Label>
                                </h4>
                            )}</td>
                        </tr>
                        {complaint.description ? (
                            <tr>
                                <td><b>Description</b></td>
                                <td>{complaint.description}</td>
                            </tr>
                        ) : ( null )}
                    </tbody>
                </Table>
                {(complaint.items && complaint.items.length) ? (
                    <div>
                        <h4>Products</h4>
                        <Table striped bordered fill>
                            <thead>
                                <th>Product name</th>
                                <th>Batch</th>
                                <th>Quantity</th>
                                <th>Comment</th>
                            </thead>
                            <tbody>
                                {complaint.items.map(item => {
                                    return (
                                        <tr key={i++}>
                                            <td>{item.product.name}</td>
                                            <td>{item.batch}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.comment}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <span />
                )}
                {this.renderButton()}
            </div>
        )
    }
})

module.exports = ComplaintsView
