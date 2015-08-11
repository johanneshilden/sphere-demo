import React                from 'react'

import DataStore            from '../../store/DataStore'

import {Panel, Table} from 'react-bootstrap'

import {ContactsEditForm} from './ContactsForm'

const ContactsEditRoute = React.createClass({
    getInitialState: function() {
        return {
            contact : null
        }
    },
    fetchContact: function() {
        var contact = DataStore.getItem('contacts/' + this.props.params.id)
        contact.customer = contact.getEmbedded('customer')
        this.setState({contact: contact})
    },
    componentDidMount: function() {
        this.fetchContact()
        DataStore.on('change', this.fetchContact)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchContact)
    },
    onEditComplete: function() {
        if (this.state.contact) {
            window.location.hash = this.state.contact.id
        }
    },
    render: function() {
        let contact = this.state.contact
        if (!contact)
            return <span />
        return (
            <Panel 
              header  = 'Contacts'
              bsStyle = 'primary'>
                <ol className='breadcrumb'>
                    <li>
                        <a href='#/customers'>
                            Customers
                        </a>
                    </li>
                    <li>
                        <a href={'#/' + contact.customer.id}>
                            {contact.customer.name}
                        </a>
                    </li>
                     <li className='active'>
                        Edit contact information
                    </li>
                </ol>
                <ContactsEditForm 
                  onSubmit = {this.onEditComplete}
                  onCancel = {this.onEditComplete}
                  contact  = {this.state.contact} />
            </Panel>
        )
    }
})

module.exports = ContactsEditRoute
