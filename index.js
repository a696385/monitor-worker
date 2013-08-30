/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var MonitorClient = require('./lib/Client'),
    CPUWatcher = require('./lib/watchers/cpu'),
    MemoryWatcher = require('./lib/watchers/memory'),
    TotalCPUWatcher = require('./lib/watchers/totalcpu'),
    TotalMemoryWatcher = require('./lib/watchers/totalmemory'),
    RedisMemoryWatcher = require('./lib/watchers/redis/memory'),
    RedisDataSizeWatcher = require('./lib/watchers/redis/datasize'),
    RedisCommandsWatcher = require('./lib/watchers/redis/commands');

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
 * @param {Object} [options]
 */
exports.registerWatchers = function(monitorClient, watchers, options){
    options = options || {};
    watchers.forEach(function(watcher){
        var constructor = null, params = null;
        if (watcher === 'cpu') constructor = CPUWatcher;
        else if (watcher === 'memory') constructor = MemoryWatcher;
        else if (watcher === 'redis-memory') constructor = RedisMemoryWatcher;
        else if (watcher === 'redis-data-size') constructor = RedisDataSizeWatcher;
        else if (watcher === 'redis-commands') constructor = RedisCommandsWatcher;
        else if (watcher === 'total-cpu') constructor = TotalCPUWatcher;
        else if (watcher === 'total-memory') constructor = TotalMemoryWatcher;
        params = options[watcher];

        if (constructor == null) return;
        monitorClient.registerWatcher(new constructor(params));
    });
};