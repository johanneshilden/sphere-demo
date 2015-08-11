import Bootstrap          from 'react-bootstrap'
import React              from 'react'

import DataStore          from '../../store/DataStore'
import ComplaintsView     from './ComplaintsView'

import {Panel} from 'react-bootstrap'

const ComplaintsRoute = React.createClass({
    getInitialState: function() {
        return {
            complaint : null
        }
    },
    fetchComplaint: function() {
        let complaint = DataStore.getItem('complaints/' + this.props.params.id)
        if (complaint) {
            if (complaint.items) {
                complaint.items.forEach(item => {
                    item.product = item['_embedded']['product']
                })
            }
            complaint.customer = complaint.getEmbedded('customer')
        }
        this.setState({complaint: complaint})
    },
    componentDidMount: function() {
        this.fetchComplaint()
        DataStore.on('change', this.fetchComplaint)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchComplaint)
    },
    render: function() {
        return (
            <div>
                <Panel 
                  header='Complaints'
                  bsStyle='primary'>
                    <ol className='breadcrumb'>
                        <li>
                            <a href='#complaints'>
                                Complaints
                            </a>
                        </li>
                        <li className='active'>
                            View complaint
                        </li>
                    </ol>
                    <ComplaintsView complaint={this.state.complaint} />
                </Panel>
            </div>
        )
    }
})

module.exports = ComplaintsRoute
