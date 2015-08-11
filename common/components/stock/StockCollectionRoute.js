import React                from 'react'

import DataStore            from '../../store/DataStore'
import StockCollection      from './StockCollection'

const StockCollectionRoute = React.createClass({
    fetchStock: function() {
        let embedProduct = (item) => {
            item.embed('product')
            item.product = item.getEmbedded('product')
            if (item.product)
                item.productName = item.product.name
        }
        let stock = DataStore.fetchCollection('stock')
        stock.forEach(embedProduct)
        let activity = DataStore.fetchCollection('stock-movements')
        activity.forEach(embedProduct)
        this.setState({
            stock    : stock,
            activity : activity
        })
    },
    getInitialState: function() {
        return {
            data     : [],
            activity : []
        }
    },
    componentDidMount: function() {
        this.fetchStock()
        DataStore.on('change', this.fetchStock)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchStock)
    },
    render: function() {
        return (
            <StockCollection
              stock    = {this.state.stock}
              activity = {this.state.activity} />
        )
    }
})

module.exports = StockCollectionRoute
