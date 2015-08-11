import Bootstrap           from 'react-bootstrap'
import Griddle             from 'griddle-react'
import React               from 'react'

import BootstrapPager      from '../BootstrapPager'

import {Panel}             from 'react-bootstrap'

const ProductsCollection = React.createClass({
    getDefaultProps: function() {
        return {
            resultsPerPage : 8
        }
    },
    viewProduct: function(row) {
        window.location.hash = row.props.data.id 
    },
    render: function() {
        var metadata = [
            {
                'columnName'  : 'sku', 
                'displayName' : 'SKU'
            }, 
            {
                'columnName'  : 'name', 
                'displayName' : 'Name'
            }, 
            {
                'columnName'  : 'unitSize', 
                'displayName' : 'Unit size'
            }
        ]
        return (
            <Panel 
              bsStyle = 'primary'
              header  = 'Products'>
                <Griddle 
                  results                 = {this.props.products}
                  showFilter              = {true}
                  resultsPerPage          = {this.props.resultsPerPage}
                  useGriddleStyles        = {false}
                  columnMetadata          = {metadata}
                  onRowClick              = {this.viewProduct}
                  useCustomPagerComponent = {true}
                  customPagerComponent    = {BootstrapPager}
                  tableClassName          = 'table table-bordered table-select'
                  columns                 = {['sku', 'name', 'unitSize']} />
            </Panel>
        )
    }
})

module.exports = ProductsCollection
