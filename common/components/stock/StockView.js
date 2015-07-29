import Bootstrap           from 'react-bootstrap'
import Griddle             from 'griddle-react'
import React               from 'react'

import DataStore           from '../../store/DataStore'
import BootstrapPager      from '../BootstrapPager'

import {Panel, TabPane, TabbedArea} from 'react-bootstrap'

const StockView = React.createClass({
    getInitialState: function() {
        return {
            activeKey : 1
        }
    },
    handleSelect: function(key) {
        this.setState({key: key})
    },
    viewProduct: function(row) {
        let product = row.props.data.id 
        window.location.hash = product.replace('products', 'stock') 
    },
    render: function() {
        const stockMetadata = [
            {
                'columnName'  : 'productName',
                'displayName' : 'Product'
            }, 
            {
                'columnName'  : 'actual',
                'displayName' : 'Actual qty.'
            }, 
            {
                'columnName'  : 'available',
                'displayName' : 'Available qty.'
            }
        ]
        const activityMetadata = [
            { 
                'columnName'  : 'action',
                'displayName' : 'Action'
            },
            {
                'columnName'  : 'productName',
                'displayName' : 'Product'
            },
            {
                'columnName'  : 'type',
                'displayName' : 'Quantity changed'
            },
            {
                'columnName'  : 'quantity',
                'displayName' : 'Change incurred'
            }
        ]
        return (
            <Panel 
              className = 'panel-fill'
              bsStyle   = 'primary'
              header    = 'Stock'>
                <TabbedArea fill 
                  animation = {false}
                  activeKey = {this.state.key}
                  onSelect  = {this.handleSelect}>
                    <TabPane eventKey={1} tab='Summary'>
                        <Panel>
                            <Griddle 
                              results                 = {this.props.stock}
                              showFilter              = {true}
                              resultsPerPage          = {8}
                              useGriddleStyles        = {false}
                              useCustomPagerComponent = {true}
                              onRowClick              = {this.viewProduct}
                              customPagerComponent    = {BootstrapPager}
                              columnMetadata          = {stockMetadata}
                              tableClassName          = 'table table-bordered table-select'
                              columns                 = {['productName', 'actual', 'available']} />
                        </Panel>
                    </TabPane>
                    <TabPane 
                      eventKey = {2}
                      tab      = 'Activity'>
                        <Panel>
                            <Griddle 
                              results                 = {this.props.activity}
                              showFilter              = {true}
                              resultsPerPage          = {8}
                              useGriddleStyles        = {false}
                              useCustomPagerComponent = {true}
                              customPagerComponent    = {BootstrapPager}
                              columnMetadata          = {activityMetadata}
                              tableClassName          = 'table table-bordered table-select'
                              columns                 = {['action', 'productName', 'type', 'quantity']} />
                        </Panel>
                    </TabPane>
                </TabbedArea>
            </Panel>
        )
    }
})

module.exports = StockView
