
/**
 * Powered by Andy <andy@away.name>
 * Date: 29.08.13
 */

var $util = require("util"),
    $events = require("events"),
    $redis = require('redis');

var RedisWatcher = function(params){
    var self = this;
    this.counter = {
        type: 'store',
        range: 'millisecond',
        name: 'Redis Core'
    };
    this._connected = false;
    this.redis = $redis.createClient(params.port, params.host, params.options);

    this.redis.on('connect', function(){
        self._connected = true;
    });
    this.redis.on('error', function(err){
        self._connected = false;
    });

    $events.EventEmitter.call(this);
};

$util.inherits(RedisWatcher, $events.EventEmitter);

/**
 * Can execute Redis Memory Worker
 * @returns {boolean}
 */
RedisWatcher.prototype.isExecutable = function() { return true; };

/**
 * Get Redis Info Object
 * @param {String} category
 * @param callback
 */
RedisWatcher.prototype.getRedisInfo = function(category, callback){
    var self = this;
    if (!self._connected) {
        callback(null, {});
        return;
    }
    self.redis.info(function(err, result){
        if (err) result = '';
        result = result.split('\r\n').map(function(el){
            if (el.indexOf('#') > -1){
                return el.substring(0, el.indexOf('#')).trim();
            } else {
                return el;
            }
        }).filter(function(el) { return el != ''}).map(function(el){ return el.split(':'); });
        var obj = {};
        for (var i = 0; i < result.length; i++){
            obj[result[i][0]] = result[i][1];
        }
        callback(err, obj);
    });
};

/**
 * Execute Redis Worker
 * @param {MonitorClient} monitor
 */
RedisWatcher.prototype.execute = function(monitor){

};

module.exports = exports = RedisWatcher;
