var Bootstrap           = require('react-bootstrap');
var Griddle             = require('griddle-react');
var React               = require('react');
var DataStore           = require('../../store/DataStore');
var AppDispatcher       = require('../../dispatcher/AppDispatcher');

var Panel               = Bootstrap.Panel;
var Table               = Bootstrap.Table;
var Modal               = Bootstrap.Modal;
var Button              = Bootstrap.Button;
var Input               = Bootstrap.Input;

//var ProductInput = React.createClass({
//    getInitialState: function() {
//        return {
//            value           : '',
//            validationState : null,
//            hint            : null,
//            suggestions     : [],
//            fresh           : true
//        };
//    },
//    reset: function() {
//        this.setState(this.getInitialState());
//    },
//    handleChange: function(event) {
//        this._update(event.target.value);
//    },
//    forceValidate: function() {
//        this._update(this.state.value);
//    },
//    _update: function(newValue) {
//        var hint = null,
//            validationState = 'success',
//            found = null,
//            length = newValue.length;
//        if (length <= 2) {
//            validationState = 'error';
//            hint = 'This field is required.';
//        } else {
//            var products = this.props.products,
//                suggestions = [];
//            for (var i = 0; i < products.length; i++) {
//                var product = products[i];
//                if (product.name == newValue || product.sku == newValue) {
//                    found = product;
//                    break;
//                }
//                var name = product.name.toLowerCase(),
//                    sku = product.sku.toLowerCase(),
//                    val = newValue.toLowerCase();
//                if (-1 !== name.indexOf(val) || -1 !== sku.indexOf(val)) {
//                    suggestions.push(product);
//                }
//            }
//            if (i == products.length) {
//                validationState = 'warning';
//            } else {
//                suggestions = [];
//            }
//        }
//        var fresh = this.state.fresh;
//        if (fresh && 'success' === validationState) {
//            this.props.handleFresh();
//            fresh = false;
//        }
//        if (found && found !== this.state.product && 'function' === typeof this.props.onChange) {
//            this.props.onChange(found);
//        }
//        this.setState({
//            value           : newValue,
//            validationState : validationState,
//            hint            : hint,
//            suggestions     : suggestions,
//            fresh           : fresh,
//            product         : found
//        });
//    },
//    isValid: function() {
//        return ('success' === this.state.validationState);
//    },
//    renderSuggestions: function() {
//        var suggestions = this.state.suggestions;
//        if (!suggestions || !suggestions.length)
//            return <span />;
//        var i = 0;
//        return (
//            <Table 
//              bordered  
//              condensed 
//              hover 
//              className='type-ahead' 
//              style={{marginTop: '-16px', border: '2px solid #dce4ec'}}>
//                <tbody>
//                    {suggestions.map(function(item) {
//                        return (
//                            <tr
//                              key={i++} 
//                              onClick={this._update.bind(this, item.name)}>
//                              <td>{item.name}</td>
//                              <td>{item.sku}</td>
//                            </tr> 
//                        );
//                    }.bind(this))}
//                </tbody>
//            </Table>
//        );
//    },
//    render: function() {
//        return (
//            <div>
//                <Input 
//                  type='text'
//                  label={this.props.label}
//                  value={this.state.value}
//                  help={this.state.hint}
//                  placeholder='Enter the name or SKU of a product'
//                  bsStyle={this.state.validationState}
//                  hasFeedback
//                  ref='input'
//                  onChange={this.handleChange} />
//                {this.renderSuggestions()}
//            </div>
//        );
//    }
//});
//
//module.exports = ProductInput;
