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
        this._listeners = [];
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
        this._listeners.push([object, event, method, listener]);
        object.on(event, listener);
    },

    _un: function(object, event, method) {
        for (var i = 0; i < this._listeners.length; i++) {
            var item = this._listeners[i];
            if (item[0] == object && item[1] == event && item[2] == method) {
                object.removeListener(event, item[3]);
                this._listeners.splice(i, 1);
                break;
            }
        }
    },

    _unAll: function() {
        this._listeners.forEach(function(item) {
            item[0].removeListener(item[1], item[3]);
        });
        this._listeners.length = 0;
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
