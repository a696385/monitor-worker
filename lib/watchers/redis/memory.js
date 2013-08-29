/**
 * Powered by Andy <andy@away.name>
 * Date: 29.08.13
 */


var RedisCore = require('./core'),
    $util = require("util");

var RedisMemoryWatcher = function(params){
    RedisCore.call(this, params);
    this.counter = {
        type: 'store',
        range: 'millisecond',
        name: 'Redis Memory'
    };
};

$util.inherits(RedisMemoryWatcher, RedisCore);

RedisMemoryWatcher.prototype.execute = function(monitor){
    var self = this;
    this.getRedisInfo('memory', function(err, result){
        if (err) return;
        var memory = result.used_memory_rss || null;
        if (memory != null){
            self.emit('data', parseFloat(memory));
        }
    });
};

module.exports = exports = RedisMemoryWatcher;