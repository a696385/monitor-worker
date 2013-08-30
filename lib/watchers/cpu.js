/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var $util = require("util"),
    $events = require("events"),
    $usage = require('usage');

var CPUWatcher = function(){
    this._pid = process.pid;
    this._ticks = 0;

    this.counter = {
        type: 'store',
        range: 'millisecond',
        name: 'CPU'
    };

    $events.EventEmitter.call(this);
};

$util.inherits(CPUWatcher, $events.EventEmitter);

/**
 * Can execute cpu worker
 * @returns {boolean}
 */
CPUWatcher.prototype.isExecutable = function() { return true; };

/**
 * Execute CPU Worker
 * @param {MonitorClient} monitor
 */
CPUWatcher.prototype.execute = function(monitor){
    var self = this;
    var options = {};
    if ($usage.clearHistory != null) options = { keepHistory: true };
    $usage.lookup(this._pid, options, function(err, result) {
        if (err) return;
        if (self._ticks++ > 120){
            if ($usage.clearHistory != null)$usage.clearHistory();
            self._ticks = 0;
        }
        self.emit('data', (isNaN(result.cpu) ? 0 : result.cpu));
    });
};

module.exports = exports = CPUWatcher;