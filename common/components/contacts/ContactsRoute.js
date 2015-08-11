import React                from 'react'

import DataStore            from '../../store/DataStore'

import {Glyphicon, Button, Panel, Table} from 'react-bootstrap'

const ContactsRoute = React.createClass({
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
    editContact: function() {
        window.location.hash = this.state.contact.id + '/edit'
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
                        Contact information
                    </li>
                </ol>
                <Table bordered striped>
                    <col width='180' />
                    <col />
                    <tr>
                        <td><b>Type</b></td>
                        <td>{contact.type}</td>
                    </tr>
                    <tr>
                        <td><b>Info</b></td>
                        <td>{contact.info}</td>
                    </tr>
                    <tr>
                        <td><b>Comment</b></td>
                        <td>{contact.meta}</td>
                    </tr>
                </Table>
                <div>
                    <Button
                      onClick={this.editContact}
                      block>
                        <Glyphicon glyph='pencil' />
                        Edit
                    </Button>
                </div>
            </Panel>
        )
    }
})

module.exports = ContactsRoute
