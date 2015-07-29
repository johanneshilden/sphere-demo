
const FormElementMixin = {
    updateValue: function() {
        this.setState(this.store.getState())
    },
    componentDidMount: function() {
        this.store.on('change', this.updateValue)
    },
    componentWillUnmount: function() {
        this.store.removeListener('change', this.updateValue)
    },
    handleChange: function(event) {
        this._update(event.target.value)
    },
    reset: function() {
        this._update(this.getInitialState().value)
    },
    _update: function(value) {
        if ('function' === typeof this.update)
            this.update(value)
    }
}

module.exports = FormElementMixin
