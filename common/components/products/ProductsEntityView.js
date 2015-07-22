var Bootstrap                        = require('react-bootstrap');
var Griddle                          = require('griddle-react');
var React                            = require('react');
var DataStore                        = require('../../store/DataStore');
var QualityComplaintRegistrationForm = require('../../components/complaints/QualityComplaintRegistrationForm');
var ServiceComplaintRegistrationForm = require('../../components/complaints/ServiceComplaintRegistrationForm');

var Panel                            = Bootstrap.Panel;
var TabPane                          = Bootstrap.TabPane;
var TabbedArea                       = Bootstrap.TabbedArea;
var Table                            = Bootstrap.Table;
var Modal                            = Bootstrap.Modal;

var ProductsEntityView = React.createClass({
    getProduct: function() {
        var product = DataStore.getItem('products/' + this.props.productId);
        var stock  = null, 
            prices = null;
        if (product && product.hasOwnProperty('_embedded')) {
            stock  = product['_embedded']['stock'];
            prices = product['_embedded']['prices'];
        }
        this.setState({
            product : product,
            stock   : stock,
            prices  : prices
        });
    },
    getInitialState: function() {
        return {
            product : null,
            stock   : null, 
            prices  : null
        };
    },
    componentDidMount: function() {
        this.getProduct();
    },
    render: function() {
        var product = this.state.product,
            stock   = this.state.stock,
            prices  = this.state.prices;
        if (!product)
            return <span />;
        var stockItems = (
            <p>No data available.</p>
        );
        var priceItems = (
            <p>No data available.</p>
        );
        if (stock) {
            stockItems = (
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
            );
        }
        if (prices) {
            var items = [],
                i = 0;
            for (var key in prices) {
                if (0 === key.indexOf('_'))
                    continue;
                items.push(
                    <tr key={i++}>
                        <td><b>{key}</b></td>
                        <td>{prices[key]}</td>
                    </tr>
                );
            }
            priceItems = (
                <Table bordered striped condensed>
                    <col width='180' />
                    <col />
                    {items}
                </Table>
            );
        }
        return ( 
            <div>
               <Panel 
                  className='panel-fill'
                  bsStyle='primary'  
                  header='Products'>

                    <ol className='breadcrumb'>
                        <li>
                            <a href='#products'>
                                Products
                            </a>
                        </li>
                        <li className='active'>
                            {product.name}
                        </li>
                    </ol>
 
                    <h3>{product.name}</h3>
                    <hr />
                    <Bootstrap.Well>
                        {product.description}
                    </Bootstrap.Well>
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
                    <Bootstrap.Row>
                        <Bootstrap.Col md={6}>
                            <h4>Prices</h4>
                            {priceItems}
                        </Bootstrap.Col>
                        <Bootstrap.Col md={6}>
                           <h4>Stock</h4>
                            {stockItems}
                        </Bootstrap.Col>
                    </Bootstrap.Row>
                </Panel>
            </div>
        );
    }
});

module.exports = ProductsEntityView;
