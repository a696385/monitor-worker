/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var $util = require("util"),
    $events = require("events"),
    $usage = require('usage');

var MemoryWatcher = function(){
    this._pid = process.pid;
    this._ticks = 0;

    this.counter = {
        type: 'store',
        range: 'millisecond',
        name: 'Memory'
    };

    $events.EventEmitter.call(this);
};

$util.inherits(MemoryWatcher, $events.EventEmitter);

/**
 * Can execute cpu worker
 * @returns {boolean}
 */
MemoryWatcher.prototype.isExecutable = function() { return true; };

/**
 * Execute Memory Worker
 * @param {MonitorClient} monitor
 */
MemoryWatcher.prototype.execute = function(monitor){
    var self = this;
    var options = {};
    if ($usage.clearHistory != null) options = { keepHistory: true };
    $usage.lookup(this._pid, options, function(err, result) {
        if (err) return;
        if (self._ticks++ > 120){
            if ($usage.clearHistory != null)$usage.clearHistory();
            self._ticks = 0;
        }
        self.emit('data', result.memory);
    });
};

module.exports = exports = MemoryWatcher;
