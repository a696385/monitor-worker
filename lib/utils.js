/**
 * Powered by Andy <andy@away.name>
 * Date: 27.08.13
 */


exports.wrappers = {
    /**
     * Wrap callback with one param (error only)
     * @param {Object} [bind] This object for function
     * @param {Function} fn Execute function on callback
     * @returns {Function}
     */
    callback: function(bind, fn){
        if (typeof bind === 'function' && fn == null){
            fn = bind;
            bind = this;
        }
        return function(err){
            fn.call(bind, err);
        };
    }
};