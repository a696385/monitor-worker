/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var $redis = require('redis'),
    $util = require("util"),
    $events = require("events");

var utils = require('./utils'),
    wr = utils.wrappers;

/**
 * Monitor client instance
 * @param {String} name Instance name
 * @param {String} description Instance Description
 * @param {Object} redis Redis connection configuration
 * @param {Object} [options] Additional options
 * @constructor
 */
var MonitorClient = function(name, description, redis, options){
    if (redis instanceof Object && (redis.read == null || redis.write == null)){
        redis = {
            read: redis,
            write: redis
        };
    }
    this._options = options || {};
    this._options.waitReconnect = this._options.waitReconnect || false;
    this._options.calulateTime = this._options.calulateTime || 1000;
    var self = this;
    this._connected = {
        read: false,
        write: false
    };
    this.name = name;
    this.description = description;
    this.redis = {
        read: $redis.createClient(redis.read.port, redis.read.host, redis.read.options),
        write: $redis.createClient(redis.write.port, redis.write.host, redis.write.options)
    };
    this.redis.read.on('connect', function(){
        self._connected.read = true;
        if (self._connected.read && self._connected.write){
            self.emit('connected');
        }
    });
    this.redis.read.on('error', function(err){
        self._connected.read = false;
        self.emit('disconnected');
    });

    this.redis.write.on('connect', function(){
        self._connected.write = true;
        if (self._connected.read && self._connected.write){
            self.emit('connected');
        }
    });
    this.redis.write.on('error', function(err){
        self._connected.write = false;
        self.emit('disconnected');
    });
    this._watchers = [];

    if (this._options.calulateTime > 0){
        setInterval(this._onTimer.bind(this), this._options.calulateTime);
    }

    $events.EventEmitter.call(this);
};

$util.inherits(MonitorClient, $events.EventEmitter);

/**
 * Register monitor client in redis
 * @param {Function} callback
 */
MonitorClient.prototype.register = function(callback){
    var self = this;
    if (!this._connected.write){
        if (!this._options.waitReconnect){
            callback(new Error('Redis is not connected'));
            return;
        }
        setTimeout(function(){
            self.register(callback);
        }, 1000);
        return;
    }
    this.redis.write.set('instance:' + this.name + ':description', this.description, wr.callback(this, callback));
};

/**
 * Store counter value
 * @param {Object} counter
 * @param {Number} value
 * @param {Function} callback
 */
MonitorClient.prototype.store = function(counter, value, callback){
    var self = this;
    if (!this._connected.write){
        if (!this._options.waitReconnect){
            callback(new Error('Redis is not connected'));
            return;
        }
        setTimeout(function(){
            self.store(counter, value, callback);
        }, 1000);
        return;
    }
    var fn = null;
    if (counter.type === 'store'){
        fn = this.redis.write.set.bind(this.redis.write);
    } else if (counter.type === 'inc'){
        fn = this.redis.write.incrby.bind(this.redis.write);
    } else {
        callback(new Error('Counter type not supported'));
        return;
    }
    var date = new Date();
    if (counter.range === 'second'){
        date.setMilliseconds(0);
    } else if (counter.range === 'minute'){
        date.setMilliseconds(0);
        date.setMinutes(0)
    } else if (counter.range === 'hour'){
        date.setMilliseconds(0);
        date.setMinutes(0);
        date.setHours(0);
    }
    var key = 'counters:' + counter.name + ':' + this.name + ':' + date.toISOString();
    fn(key, value, wr.callback(this, callback));
};

/**
 * Register watcher in monitor
 * @param {Object} watcher
 */
MonitorClient.prototype.registerWatcher = function(watcher){
    var self = this;
    this._watchers.push(watcher);
    watcher.on('data', function(value){
        self.store(watcher.counter, value, function(){});
    });
};

/**
 * On calculate timer
 * @private
 */
MonitorClient.prototype._onTimer = function(){
    for (var i = 0; i < this._watchers.length; i++){
        if (this._watchers[i].isExecutable != null && this._watchers[i].isExecutable()){
            this._watchers[i].execute(this);
        }
    }
};

module.exports = exports = MonitorClient;