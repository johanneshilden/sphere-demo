import Bootstrap                        from 'react-bootstrap'
import React                            from 'react'

import DataStore                        from '../../store/DataStore'
import ComplaintsCollection             from './ComplaintsCollection'

import {Panel} from 'react-bootstrap'

const ComplaintsCollectionRoute = React.createClass({
    getInitialState: function() {
        return {
            complaints : []
        }
    },
    fetchComplaints: function() {
        let complaints = DataStore.fetchCollection('complaints')
        complaints.forEach(item => {
            item.customer = item.getEmbedded('customer')
        })
        this.setState({
            complaints : complaints
        })
    },
    componentDidMount: function() {
        this.fetchComplaints()
        DataStore.on('change', this.fetchComplaints)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaints)
    },
    render: function() {
        return (
            <Panel 
              header  = 'Complaints'
              bsStyle = 'primary'>
                <ComplaintsCollection complaints={this.state.complaints} />
            </Panel>
        )
    }
})

module.exports = ComplaintsCollectionRoute
