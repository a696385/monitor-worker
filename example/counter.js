/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */

var worker = require('../index');

var monitor = worker.createClient('test','test instance', {host: 'localhost', port: 6379, options: {}}, {waitReconnect: true});
monitor.register(function(err){
    if (err){
        console.error('Can not register monitor');
    } else {
        console.log('Registered');
    }
});
worker.registerWatchers(monitor, ['total-cpu', 'total-memory', 'cpu', 'memory', 'redis-memory', 'redis-data-size', 'redis-commands'], {
    'redis-memory': {
        port: 6379,
        host: 'localhost',
        options: {}
    },
    'redis-data-size': {
        port: 6379,
        host: 'localhost',
        options: {}
    },
    'redis-commands': {
        port: 6379,
        host: 'localhost',
        options: {}
    }
});


