/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var $util = require("util"),
    $events = require("events"),
    $osUtils = require('os-utils');

var TotalMemoryWatcher = function(){
    this._pid = process.pid;
    this._ticks = 0;

    this.counter = {
        type: 'store',
        range: 'millisecond',
        name: 'Total Memory'
    };

    $events.EventEmitter.call(this);
};

$util.inherits(TotalMemoryWatcher, $events.EventEmitter);

/**
 * Can execute memory worker
 * @returns {boolean}
 */
TotalMemoryWatcher.prototype.isExecutable = function() { return true; };

/**
 * Execute memory Worker
 * @param {MonitorClient} monitor
 */
TotalMemoryWatcher.prototype.execute = function(monitor){
    var self = this;
    var v = 100 - ($osUtils.freememPercentage() * 100);
    self.emit('data', v.toFixed(0));

};

module.exports = exports = TotalMemoryWatcher;