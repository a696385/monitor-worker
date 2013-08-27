/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var MonitorClient = require('./lib/Client'),
    CPUWatcher = require('./lib/watchers/cpu'),
    MemoryWatcher = require('./lib/watchers/memory');

/**
 * Create monitor client instance
 * @param {String} name Instance name
 * @param {String} description Instance Description
 * @param {Object} redis Redis connection configuration
 * @param {Object} [options] Additional options
 * @returns {MonitorClient}
 */
exports.createClient = function(name, description, redis, options){
    return new MonitorClient(name, description, redis, options);
};

/**
 * Register watchers for monitor
 * @param {MonitorClient} monitorClient
 * @param {Array} watchers
 */
exports.registerWatchers = function(monitorClient, watchers){
    watchers.forEach(function(watcher){
        var constructor = null;
        if (watcher === 'cpu') constructor = CPUWatcher;
        else if (watcher === 'memory') constructor = MemoryWatcher;

        if (constructor == null) return;
        monitorClient.registerWatcher(new constructor());
    });
};