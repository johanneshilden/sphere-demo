import React                from 'react'

import DataStore            from '../store/DataStore'

const DeveloperRoute = React.createClass({
    getInitialState: function() {
        return {
            value        : '',
            lookupValue  : '',
            msg          : '',
            lookupResult : ''
        }
    },
    handleChange: function(event) {
        this.setState({
            value : event.target.value
        })
    },
    handleChangeLookup: function(event) {
        this.setState({
            lookupValue : event.target.value
        })
    },
    handleSubmit: function() {
        if (this.state.value) {
            var cmd
            try {
                cmd = JSON.parse(this.state.value)
            } catch(e) {
                cmd = null
            }
            if (!cmd) {
                this.setState({
                    msg : 'Bad JSON.'
                })
            } else {
                DataStore.api.command(cmd)
                this.setState({
                    value : '',
                    msg   : 'Ok!'
                })
            }
        }
    },
    lookup: function() {
        let result = DataStore.store.getItem(this.state.lookupValue)
        this.setState({
            lookupResult : result
        })
    },
    render: function() {
        let lookupResult = this.state.lookupResult
        return (
            <div>
                <div>
                    <input
                      ref      = 'lookup'
                      onChange = {this.handleChangeLookup}
                      value    = {this.state.lookupValue}
                      type     = 'text' />
                    <button
                      onClick  = {this.lookup}>
                        Lookup
                    </button>
                    <pre>
                        {lookupResult ? JSON.stringify(lookupResult, null, 3) : ''}
                    </pre>
                </div>
                <div>
                    {this.state.msg}
                </div>
                <div>
                    <textarea
                      ref      = 'textarea'
                      onChange = {this.handleChange}
                      value    = {this.state.value}
                      style    = {{fontFamily: 'monospace'}}
                      rows     = {15}
                      cols     = {80} />
                </div>
                <div>
                    <button onClick={this.handleSubmit}>
                        Commit
                    </button>
                </div>
            </div>
        )
    }
})

module.exports = DeveloperRoute
