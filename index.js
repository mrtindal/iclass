exports.create = function(parent, proto) {
    if (arguments.length < 2) {
        proto = parent;
        parent = Object;
    }
    proto = proto || {};
    if (!proto.hasOwnProperty('constructor')) {
        proto.constructor = function() {
            parent.apply(this, arguments);
        };
    }
    require('util').inherits(proto.constructor, parent);
    mixin(proto.constructor.prototype, proto);
    proto.constructor.superclass = parent.prototype;
    return proto.constructor;
};

exports.Component = exports.create(require('events').EventEmitter, {
    constructor: function(cfg) {
        exports.Component.superclass.constructor.apply(this, arguments);
        mixin(this, cfg);
        this._listeners = new Map();
        this._initComponent();
    },

    _initComponent: function() {

    },

    destroy: function() {
        this._unAll();
    },


    _on: function(object, event, method) {
        var ctx = this;
        var listener = function() {
            method.apply(ctx, arguments);
        };
        this._listeners.set([object, event, method], listener);
        object.on(event, listener);
    },

    _un: function(object, event, method) {
        var key = [object, event, method];
        var listener = this._listeners.get(key);
        if (listener) {
            this._listeners.delete(key);
            object.removeListener(event, listener);
        }
    },

    _unAll: function() {
        this._listeners.entries().forEach(function(entry) {
            entry[0][0].removeListener(entry[0][1], entry[1]);
        });
        this._listeners.clear();
    }
});

function mixin(dst, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) {
            dst[key]= src[key];
        }
    }
    return dst;
}
