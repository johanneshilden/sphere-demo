import Bootstrap                        from 'react-bootstrap'
import Griddle                          from 'griddle-react'
import React                            from 'react'

import DataStore                        from '../../store/DataStore'

import {Panel, TabPane, TabbedArea, Table, Modal, Row, Col} from 'react-bootstrap'

const ProductsView = React.createClass({
    getDefaultProps: function() {
        return {
            parentResource : 'Products'
        }
    },
    renderPrices: function() {
        let prices = this.props.product.prices,
            items = [],
            i = 0
        if ('object' === typeof prices) {
            for (var key in prices) {
                if (0 === key.indexOf('_') || 'function' === typeof prices[key] || 'id' === key)
                    continue
                items.push(
                    <tr key={i++}>
                        <td><b>{key}</b></td>
                        <td>{prices[key]}</td>
                    </tr>
                )
            }
        }
        if (!items.length) {
            return (
                <p>No data available.</p>
            )
        } else {
            return (
                <Table bordered striped condensed>
                    <col width='180' />
                    <col />
                    {items}
                </Table>
            )
        }
    },
    render: function() {
        var product = this.props.product
        if (!product)
            return <span />
        let parentResource = this.props.parentResource,
            stock = this.props.product.stock
        return ( 
            <div>
               <Panel 
                  className = 'panel-fill'
                  bsStyle   = 'primary'
                  header    = {parentResource}>
                    <ol className='breadcrumb'>
                        <li>
                            <a href={'#/' + parentResource.toLowerCase()}>
                                {parentResource}      
                            </a>
                        </li>
                        <li className='active'>
                            {product.name}
                        </li>
                    </ol>
                    <h3>{product.name}</h3>
                    <hr />
                    <blockquote>
                        {product.description}
                    </blockquote>
                    <h4>Properties</h4>
                    <Table bordered striped>
                        <col width='200' />
                        <col />
                        <tbody>
                            <tr>
                                <td><b>SKU</b></td>
                                <td>{product.sku}</td>
                            </tr>
                            <tr>
                                <td><b>Unit size</b></td>
                                <td>{product.unitSize}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Row>
                        <Col md={6}>
                            <h4>Prices</h4>
                            {this.renderPrices()}
                        </Col>
                        <Col md={6}>
                            <h4>Stock</h4>
                            {stock ? (
                                <Table bordered striped condensed>
                                    <col width='180' />
                                    <col />
                                    <tr>
                                        <td><b>Actual</b></td>
                                        <td>{stock.actual}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Available</b></td>
                                        <td>{stock.available}</td>
                                    </tr>
                                </Table>
                            ) : (
                                <p>No data available.</p>
                            )}
                        </Col>
                    </Row>
                </Panel>
            </div>
        )
    }
})

module.exports = ProductsView
