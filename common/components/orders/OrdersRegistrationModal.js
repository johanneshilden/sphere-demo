import React                 from 'react'
import assign                from 'object-assign'

import AppDispatcher         from '../../dispatcher/AppDispatcher'

import {OrdersRegistrationForm} from './OrdersForm'
import {Modal} from 'react-bootstrap'

const OrdersRegistrationModal = React.createClass({
    componentDidMount: function() {
        AppDispatcher.dispatch({
            actionType : 'order-form-init',
            customer   : this.props.customer
        })
    },
    render: function() {
        return (
            <Modal
              show={this.props.visible}
              onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Place an order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OrdersRegistrationForm 
                      customer     = {this.props.customer}
                      activityType = {this.props.activityType}
                      close        = {this.props.close} />
                </Modal.Body>
            </Modal>
        )
    }
})

module.exports = OrdersRegistrationModal
