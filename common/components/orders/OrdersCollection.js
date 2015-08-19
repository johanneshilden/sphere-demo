import Bootstrap           from 'react-bootstrap'
import Griddle             from 'griddle-react'
import React               from 'react'
import TimeAgo             from 'react-timeago'

import BootstrapPager      from '../BootstrapPager'
import DataStore           from '../../store/DataStore'
import OrdersView          from './OrdersView'

import {Panel, TabPane, TabbedArea, Modal} from 'react-bootstrap'

const OrdersCollection = React.createClass({
    getInitialState: function() {
        return {
            activeOrder  : null,
            order        : null,
            activeKey    : 1
        }
    },
    getDefaultProps: function() {
        return {
            resultsPerPage : 8,
            tabbedMode     : true
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
    handleSelect: function(key) {
        this.setState({key: key})
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
                              date      = {Number(this.props.rowData.created)}
                              formatter = {DataStore.timeFormatter} />
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

        if (true === this.props.tabbedMode) {
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
                        <OrdersView order={this.state.activeOrder} />
                    </Modal.Body>
                </Modal>
                {this.props.tabbedMode ? (
                    <Panel 
                      className = 'panel-fill'
                      bsStyle   = 'primary'
                      header    = 'Orders'>
                        <TabbedArea fill 
                          animation = {false}
                          activeKey = {this.state.key}
                          onSelect  = {this.handleSelect}>
                            <TabPane 
                              eventKey = {1}
                              tab      = 'Orders'>
                                <Panel>
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
                                </Panel>
                            </TabPane>
                            <TabPane 
                              eventKey = {2}
                              tab      = 'Rejected orders'>
                                <Panel>
                                    <Griddle 
                                      results                 = {this.props.rejected}
                                      showFilter              = {true}
                                      resultsPerPage          = {this.props.resultsPerPage}
                                      columnMetadata          = {metadata}
                                      useGriddleStyles        = {false}
                                      initialSort             = 'created'
                                      initialSortAscending    = {false}
                                      useCustomPagerComponent = {true}
                                      customPagerComponent    = {BootstrapPager}
                                      tableClassName          = 'table table-bordered table-select'
                                      columns                 = {columns} />
                                </Panel>
                            </TabPane>
                        </TabbedArea>
                    </Panel>
                ) : (
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
                )}
            </div>
        )
    }
})

module.exports = OrdersCollection
