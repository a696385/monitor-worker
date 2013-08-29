/**
 * Powered by Andy <andy@away.name>
 * Date: 29.08.13
 */


var RedisCore = require('./core'),
    $util = require("util");

var RedisCommandsWatcher = function(params){
    RedisCore.call(this, params);
    this.counter = {
        type: 'store',
        range: 'second',
        name: 'Redis Commands in sec'
    };
    this._last = null;
};

$util.inherits(RedisCommandsWatcher, RedisCore);

RedisCommandsWatcher.prototype.execute = function(monitor){
    var self = this;
    this.getRedisInfo('stats', function(err, result){
        if (err) return;
        var total = result.total_commands_processed || null;
        if (total != null){
            total = parseInt(total);
            if (self._last != null){
                var diff = total - self._last.value;
                self.emit('data', diff);
            }
            self._last = {
                date: new Date(),
                value: total
            };
        }
    });
};

module.exports = exports = RedisCommandsWatcher;