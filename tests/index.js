var assert = require('chai').assert;
var EventEmitter = require('events').EventEmitter;
var iclass = require('../index');

describe('iclass', function() {
    it('create', function() {
        var C = iclass.create({
            constructor: function(foo) {
                this.foo = foo;
            }
        });
        var c = new C(5);
        assert.typeOf(c, 'object');
        assert.equal(c.foo, 5);
    });
    
    it('extend', function() {
        var C = iclass.create(EventEmitter, {
            emitEvent: function() {
                this.emit('event');
            }
        });
        var c = new C();
        assert.isFunction(c.on);
        var eventEmitted = false;
        c.on('event', function() {
            eventEmitted = true;
        });
        c.emitEvent();
        assert.isTrue(eventEmitted);
    });
    
    it('create component', function() {
        var C = iclass.create(iclass.Component, {
            a: 1,
            b: 1
        });
        var c = new C({
            b: 2,
            c: 3
        });
        assert.equal(c.a, 1);
        assert.equal(c.b, 2);
        assert.equal(c.c, 3);
    });

    it('component events', function() {
        var ee = new EventEmitter();
        var C = iclass.create(iclass.Component, {
            _initComponent: function() {
                C.superclass._initComponent.apply(this, arguments);
                this.emitCount = 0;
                this._on(ee, 'event', this.method);
            },
            
            method: function() {
                this.emitCount++;
            },
            
            unEvent: function() {
                this._un(ee, 'event', this.method);
            }
        });
        
        var c = new C();
        assert.equal(c.emitCount, 0);
        ee.emit('event');
        assert.equal(c.emitCount, 1);
        ee.emit('event');
        assert.equal(c.emitCount, 2);
        c.unEvent();
        ee.emit('event');
        assert.equal(c.emitCount, 2);
    });
    
    it('component events unAll', function() {
        var ee = new EventEmitter();
        var C = iclass.create(iclass.Component, {
            _initComponent: function() {
                C.superclass._initComponent.apply(this, arguments);
                this.emitCount1 = 0;
                this.emitCount2 = 0;
                this._on(ee, 'event1', this.method1);
                this._on(ee, 'event2', this.method2);
            },
            
            method1: function() {
                this.emitCount1++;
            },
            
            method2: function() {
                this.emitCount2++;
            }
        });
        var c = new C();
        ee.emit('event1');
        ee.emit('event2');
        assert.equal(c.emitCount1, 1);
        assert.equal(c.emitCount2, 1);
        c._unAll();
        ee.emit('event1');
        ee.emit('event2');
        assert.equal(c.emitCount1, 1);
        assert.equal(c.emitCount2, 1);
    });
});
