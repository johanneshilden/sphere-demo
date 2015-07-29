import Bootstrap           from 'react-bootstrap'
import Griddle             from 'griddle-react'
import React               from 'react'
import TimeAgo             from 'react-timeago'
import DataStore           from '../../store/DataStore'
import BootstrapPager      from '../BootstrapPager'
import OrdersEntityView    from './OrdersEntityView'

import {Panel, TabPane, TabbedArea, Modal} from 'react-bootstrap'

const OrdersView = React.createClass({
    getInitialState: function() {
        return {
            activeOrder  : null,
            order        : null
        }
    },
    getDefaultProps: function() {
        return {
            resultsPerPage : 8,
            showCustomer   : true
        }
    },
    closeModal: function() {
        this.setState({activeOrder: null})
    },
    viewOrder: function(row) {
        let order = DataStore.getItem(row.props.data.id)
        if (order) {
            order.items.forEach(item => {
                item.product = item['_embedded']['product']
            })
            this.setState({activeOrder: order})
        }
    },
    render: function() {
        const metadata = [
            {
                'columnName'      : 'customerName', 
                'displayName'     : 'Customer'
            },
            {
                'columnName'      : 'created',
                'displayName'     : 'Created',
                'customComponent' : React.createClass({
                    render: function() {
                        return (
                            <TimeAgo 
                              date={Number(this.props.rowData.created)} 
                              formatter={DataStore.timeFormatter} />
                        )
                    }
                })
            },
            {
                'columnName'      : 'itemCount', 
                'displayName'     : '# of items'
            },
            {
                'columnName'      : 'user', 
                'displayName'     : 'User'
            },
            {
                'columnName'      : 'total', 
                'displayName'     : 'Order total'
            }
        ]

        let columns = ['created', 'itemCount', 'user', 'total']

        if (true === this.props.showCustomer) {
            columns.unshift('customerName')
        }

        return (
            <div>
                <Modal 
                  onHide = {this.closeModal}
                  show   = {!!this.state.activeOrder}>
                    <Modal.Header 
                      closeButton 
                      onHide={this.closeModal}>
                        <Modal.Title>
                            Order details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <OrdersEntityView order={this.state.activeOrder} />
                    </Modal.Body>
                </Modal>
                <Griddle 
                  results                 = {this.props.orders}
                  showFilter              = {true}
                  resultsPerPage          = {this.props.resultsPerPage}
                  columnMetadata          = {metadata}
                  useGriddleStyles        = {false}
                  onRowClick              = {this.viewOrder}
                  initialSort             = 'created'
                  initialSortAscending    = {false}
                  useCustomPagerComponent = {true}
                  customPagerComponent    = {BootstrapPager}
                  tableClassName          = 'table table-bordered table-select'
                  columns                 = {columns} />
            </div>
        )
    }
})

module.exports = OrdersView
