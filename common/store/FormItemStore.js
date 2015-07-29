var assign       = require('object-assign')
var EventEmitter = require('events')

var FormItemStore = assign({}, EventEmitter.prototype, {
    value : '',
    state : null,
    hint  : null,

    refresh: function() {
        if ('function' === typeof this.validate)
            this.validate()
        this.emit('change')
    },

    setValue: function(value) {
        if (value === this.value)
            return
        this.value = value
        this.refresh()
    },

    getValue: function() {
        return this.value
    },

    getState: function() {
        return {
            value           : this.value,
            hint            : this.hint,
            validationState : this.state 
        }
    },
    
    isValid: function() {
        return ('success' === this.state)
    },

    reset: function() {
        this.value = ''
        this.state = null
        this.hint  = null
        this.emit('change')
    }

})

module.exports = FormItemStore
