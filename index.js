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
    proto.constructor.superclass = parent;
    return proto.constructor;
};

exports.Component = exports.create(require('events').EventEmitter, {
    constructor: function(cfg) {
        exports.Component.superclass.constructor.apply(this, arguments);
        mixin(this, cfg);
        this._initComponent();
    },

    _initComponent: function() {

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