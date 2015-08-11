import React         from 'react'
import Bootstrap     from 'react-bootstrap'
import Griddle       from 'griddle-react'

import {Panel} from 'react-bootstrap'

const PerformanceView = React.createClass({
    render: function() {
        return (
            <Panel 
              header  = 'Performance'
              bsStyle = 'primary'>
            </Panel>
        )
    }
})

module.exports = PerformanceView
