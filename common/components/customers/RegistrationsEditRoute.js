import React                from 'react'

import DataStore            from '../../store/DataStore'

import {CustomersEditForm} from './CustomersForm'
import {Panel} from 'react-bootstrap'

const RegistrationsEditRoute = React.createClass({
    getInitialState: function() {
        return {
            customer : null
        }
    },
    fetchCustomer: function() {
        let customer = DataStore.getItem('registrations/' + this.props.params.id)
        if (customer) {
            this.setState({customer : customer})
        }
    },
    componentDidMount: function() {
        this.fetchCustomer()
        DataStore.on('change', this.fetchCustomer)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomer)
    },
    onEditComplete: function() {
        if (this.state.customer)
            window.location.hash = '/registrations'
    },
    render: function() {
        if (!this.state.customer)
            return <span />
        return (
            <Panel 
              header  = 'Customers'
              bsStyle = 'primary'>
                <CustomersEditForm 
                  isPartial = {true}
                  onCancel  = {this.onEditComplete}
                  onSubmit  = {this.onEditComplete}
                  customer  = {this.state.customer} />
            </Panel>
        )
    }
})

module.exports = RegistrationsEditRoute
