import React                from 'react'

import DataStore            from '../../store/DataStore'
import ProductsCollection   from './ProductsCollection'

const ProductsCollectionRoute = React.createClass({
    fetchProducts: function() {
        let products = DataStore.fetchCollection('products')
        this.setState({
            products : products
        })
    },
    getInitialState: function() {
        return {
            products : []
        }
    },
    componentDidMount: function() {
        this.fetchProducts()
        DataStore.on('change', this.fetchProducts)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('change', this.fetchProducts)
    },
    render: function() {
        return (
            <ProductsCollection products={this.state.products} />
        )
    }
})

module.exports = ProductsCollectionRoute
