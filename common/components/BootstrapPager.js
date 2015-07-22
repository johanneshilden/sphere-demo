var React      = require('react');
var Bootstrap  = require('react-bootstrap');
var Griddle    = require('griddle-react');
var DataStore  = require('../store/DataStore');

var Panel      = Bootstrap.Panel;
var Pagination = Bootstrap.Pagination;

var BootstrapPager = React.createClass({
    getInitialState: function() {
        return {
            activePage: 0
        };
    },
    getDefaultProps: function() {
        return {
            maxButtons: 10
        };
    },
    handleSelect: function(event, selectedEvent) {
        var page = selectedEvent.eventKey;
        if (page > this.props.maxPage || !page)
            return;
        this.setState({
            activePage: page
        });
        this.props.setPage(page-1);
    },
    render: function() {
        var maxPage = this.props.maxPage;
        if (maxPage < 2) {
            return <span />;
        }
        return (
            <Pagination
              bsSize='small'
              items={maxPage}
              prev={true}
              next={true}
              ellipsis={true}
              maxButtons={Math.min(this.props.maxButtons, maxPage)}
              activePage={this.state.activePage}
              onSelect={this.handleSelect} />
        );
    }
});

module.exports = BootstrapPager;
