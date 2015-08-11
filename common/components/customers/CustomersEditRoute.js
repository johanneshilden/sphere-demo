import React                from 'react'

import DataStore            from '../../store/DataStore'

import {CustomersEditForm} from './CustomersForm'
import {Panel} from 'react-bootstrap'

const CustomersEditRoute = React.createClass({
    getInitialState: function() {
        return {
            customer : null
        }
    },
    fetchCustomer: function() {
        let customer = DataStore.getItem('customers/' + this.props.params.id)
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
            window.location.hash = this.state.customer.id
    },
    render: function() {
        if (!this.state.customer)
            return <span />
        return (
            <Panel 
              header  = 'Customers'
              bsStyle = 'primary'>
                <CustomersEditForm 
                  onCancel = {this.onEditComplete}
                  onSubmit = {this.onEditComplete}
                  customer = {this.state.customer} />
            </Panel>
        )
    }
})

module.exports = CustomersEditRoute
