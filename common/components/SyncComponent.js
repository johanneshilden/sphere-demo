var Bootstrap           = require('react-bootstrap')
var React               = require('react')

var DataStore           = require('../store/DataStore')

var Button              = Bootstrap.Button
var Panel               = Bootstrap.Panel
var ProgressBar         = Bootstrap.ProgressBar

const SyncComponent = React.createClass({
    runSync: function() {
        this.setState({
            syncRunning : true,
            syncStep    : 0,
            syncTotal   : 0
        })
        DataStore.endpoint.sync(['sink'],
            this.onSyncSuccess,
            this.onSyncError,
            this.updateProgress)
    },
    onSyncSuccess: function() {
        this.setState({syncRunning: false})
        DataStore.emit('change')
        DataStore.emit('sync-complete')
    },
    onSyncError: function() {
        this.setState({syncRunning: false})
    },
    updateProgress: function(step, total) {
        this.setState({
            syncStep  : step,
            syncTotal : total
        })
    },
    getInitialState: function() {
        return {
            syncStep    : 0,
            syncTotal   : 0,
            syncRunning : false
        }
    },
    componentDidMount: function() {
        DataStore.on('sync-run', this.runSync)
    },
    componentWillUnmount: function() {
        DataStore.removeListener('sync-run', this.runSync)
    },
    render: function() {
        let title = (
            <span>
                <i style={{marginRight: '.4em'}} className='fa fa-refresh fa-spin'></i>
                Processing 
            </span>
        )
        return (
            <Bootstrap.Modal
              onHide={function() {}}
              show={this.state.syncRunning}>
                <Bootstrap.Modal.Header>
                    <Bootstrap.Modal.Title>
                        {title}
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    <ProgressBar
                      style={{marginBottom: 0}}
                      max={this.state.syncTotal}
                      now={this.state.syncStep} />
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
        )
    }
})

module.exports = SyncComponent
