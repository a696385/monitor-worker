/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var $util = require("util"),
    $events = require("events"),
    $osUtils = require('os-utils');

var TotalCPUWatcher = function(){
    this._pid = process.pid;
    this._ticks = 0;

    this.counter = {
        type: 'store',
        range: 'millisecond',
        name: 'Total CPU'
    };

    $events.EventEmitter.call(this);
};

$util.inherits(TotalCPUWatcher, $events.EventEmitter);

/**
 * Can execute cpu worker
 * @returns {boolean}
 */
TotalCPUWatcher.prototype.isExecutable = function() { return true; };

/**
 * Execute CPU Worker
 * @param {MonitorClient} monitor
 */
TotalCPUWatcher.prototype.execute = function(monitor){
    var self = this;
    $osUtils.cpuUsage(function(v){
        self.emit('data', v * 100);
    });
};

module.exports = exports = TotalCPUWatcher;