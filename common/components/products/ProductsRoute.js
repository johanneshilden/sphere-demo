import React                from 'react'

import DataStore            from '../../store/DataStore'
import ProductsView         from './ProductsView'

const ProductsRoute = React.createClass({
    getInitialState: function() {
        return {
            product : null
        }
    },
    fetchProduct: function() {
        let product = DataStore.getItem('products/' + this.props.params.id)
        if (product) {
            product.stock  = product.getEmbedded('stock')
            product.prices = product.getEmbedded('prices')
        }
        this.setState({
            product : product
        })
    },
    componentDidMount: function() {
        this.fetchProduct()
        DataStore.on('change', this.fetchProduct)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchProduct)
    },
    render: function() {
        return (
            <ProductsView product={this.state.product} />
        )
    }
})

module.exports = ProductsRoute
