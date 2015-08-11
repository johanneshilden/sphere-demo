import React                from 'react'

import DataStore            from '../../store/DataStore'
import CustomersCollection  from './CustomersCollection'

const CustomersCollectionRoute = React.createClass({
    getDefaultProps: function() {
        return {
            activeKey : 1,
            isPartial : false
        }
    },
    getInitialState: function() {
        return {
            registrations : [],
            customers     : []
        }
    },
    fetchCustomers: function() {
        let customers = DataStore.fetchCollection('customers'),
            partial = DataStore.fetchCollection('registrations')
        this.setState({
            registrations : partial,
            customers     : customers
        })
    },
    componentDidMount: function() {
        this.fetchCustomers()
        DataStore.on('change', this.fetchCustomers)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchCustomers)
    },
    render: function() {
        return (
            <CustomersCollection 
              customers     = {this.state.customers} 
              isPartial     = {this.props.isPartial}
              activeKey     = {this.props.activeKey}
              registrations = {this.state.registrations} />
        )
    }
})

module.exports = CustomersCollectionRoute
