import Bootstrap               from 'react-bootstrap'
import React                   from 'react'
import TimeAgo                 from 'react-timeago'

import {Glyphicon, Label} from 'react-bootstrap'

const TasksDueComponent = React.createClass({
    render: function() {
        if (!this.props.rowData.due)
            return <span />
        let now     = new Date(),
            dueDate = new Date(Number(this.props.rowData.due))
        if (now.setHours(0,0,0,0) == dueDate.setHours(0,0,0,0)) {
            return (
                <h4 style={{margin: '0 0 .2em'}}>
                    <Label bsStyle='warning'>
                        <Glyphicon 
                          style = {{marginRight: '.4em'}}
                          glyph = 'flag' />
                        Due today
                    </Label>
                </h4>
            )
        } else if (now > dueDate) {
            return (
                <h4 style={{margin: '0 0 .2em'}}>
                    <Label bsStyle='danger'>
                        <Glyphicon 
                          style = {{marginRight: '.4em'}}
                          glyph = 'warning-sign' />
                        Overdue
                    </Label>
                </h4>
            )
        } else {
            return (
                <span>
                    {dueDate.toDateString()}
                </span>
            )
        }
    }
})

module.exports = TasksDueComponent
