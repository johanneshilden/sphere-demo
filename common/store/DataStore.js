var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');

function StoreItem() {}

StoreItem.prototype.getLink = function(link) {
    if (!this.hasOwnProperty('_links') || !this['_links'].hasOwnProperty(link))
        return null;
    return this['_links'][link].href;
};

StoreItem.prototype.getEmbedded = function(item) {
    if (!this.hasOwnProperty('_embedded') || !this['_embedded'].hasOwnProperty(item))
        return null;
    return this['_embedded'][item];
};

StoreItem.prototype.getParent = function(link) {
    return this.getLink('_parent');
};

StoreItem.prototype.getCollection = function(link) {
    return this.getLink('_collection');
};

StoreItem.prototype.embed = function(resource) {
    DataStore.store.embed(this, resource);
};

var DataStore = assign({}, EventEmitter.prototype, {

    fetchCollection: function(collection) {
        var data = [];
        var items = this.store.getItem(collection);
        if (items && items.hasOwnProperty('_links') && items['_links'].hasOwnProperty(collection)) {
            var collection = items['_links'][collection];
            for (var key in collection) {
                var item = collection[key],
                    href = item.href, 
                    obj = null;
                if (href && (obj = this.store.getItem(href))) {
                    assign(obj, StoreItem.prototype);
                    obj.id  = href;
                    obj.key = href.split('/')[1];
                    data.push(obj);
                }
            }
        }
        return data;
    },

    getItem: function(key, expand) {
        var item = this.store.getItem(key);
        if (false === expand)
            return item;
        if (item && item.hasOwnProperty('_links')) {
            for (var link in item['_links']) {
                this._embed(item, link);
            }
        }
        if (item) {
            assign(item, StoreItem.prototype);
            item.id = item.getLink('self');
        }
        return item;
    },

    invokeCommand: function(command) {
        if ('POST' === command.method) {
            command.payload._local = true;
        }
        return this.api.command(command);
    },

    timeFormatter: function(value, unit, suffix) {
        if ('second' === unit) {
            return 'less than a minute ago';
        }
        if (value !== 1) {
            unit += 's';
        }
        return value + ' ' + unit + ' ' + suffix;
    },

    _maxDepth: 1,

    _embedCollection: function(collection, resource, depth) {
        var links = collection['_links'][resource],
            items = [];
        for (var i = 0; i < links.length; i++) {
            var item = this.store.getItem(links[i].href);
            if (item) {
                assign(item, StoreItem.prototype);
                var _item = {};
                for (var key in item) {
                    if ('_embedded' !== key) 
                        _item[key] = item[key];
                    if ('_links' === key) {
                        for (var _link in _item['_links']) {
                            this._embed(_item, _link, depth+1);
                        }
                    }
                }
                items.push(_item);
            }
        }
        if (!collection.hasOwnProperty('_embedded')) 
            collection['_embedded'] = {};
        collection['_embedded'][resource] = items;
    },

    _embed: function(obj, link, depth) {
        if (!depth)
            depth = 1;
        if (depth > this._maxDepth || 'self' === link || '_parent' === link || '_collection' === link)
            return;
        var target = obj['_links'][link];
        if (Array.isArray(target)) {
            this._embedCollection(obj, link, depth);
        } else {
            var item = this.store.getItem(target.href);
            if (item) {
                assign(item, StoreItem.prototype);
                if (!obj.hasOwnProperty('_embedded')) 
                    obj['_embedded'] = {};
                var _item = {};
                for (var key in item) {
                    if ('_embedded' !== key) 
                        _item[key] = item[key];
                    if ('_links' === key) {
                        for (var _link in _item['_links']) {
                            this._embed(_item, _link, depth+1);
                        }
                    }
                }
                obj['_embedded'][link] = _item;
            }
        }
    }

});

module.exports = DataStore;
