var $               = require('jquery');
var React           = require('react');
var Backbone        = require('backbone');
var Bootstrap       = require('react-bootstrap');
var Griddle         = require('griddle-react');

var Alert           = Bootstrap.Alert;
var Button          = Bootstrap.Button;
var ButtonToolbar   = Bootstrap.ButtonToolbar;
var Nav             = Bootstrap.Nav;
var NavItem         = Bootstrap.NavItem;
var Navbar          = Bootstrap.Navbar;
var Panel           = Bootstrap.Panel;
var ProgressBar     = Bootstrap.ProgressBar;

var NavComponent = React.createClass({
    render: function() {
        return (
            <div>
                <Navbar className="navbar-fixed-top" brand={<a href="#"><img src="../common/assets/images/sphere-logo.png" style={{marginTop: '-2px'}} alt="" /></a>} toggleNavKey={0}>
                </Navbar>
                <p className="nav-info">Depot Management</p>
            </div>
        );
    }
});
           
var Router = Backbone.Router.extend({
});

 React.render(
    <NavComponent />,
    document.getElementById('navbar-container')
);

// Close responsive Bootstrap nav when selecting an item
$('.navbar-fixed-top a').on('click', function() {
    if ($('body').width() < 768) {
        $(".navbar-toggle").click();
    }
});
