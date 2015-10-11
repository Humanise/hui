(function() {

    var listeners = { }, resolves = { };

    function addLoadListener(listener, name) {
        if (name in resolves) {
            // value is already loaded, call listener immediately
            listener(name, resolves[name]);
        } else if (listeners[name]) {
            listeners[name].push(listener);
        } else {
            listeners[name] = [ listener ];
        }
    }

    function resolve(name, value) {
        resolves[name] = value;
        var libListeners = listeners[name];
        if (libListeners) {
            libListeners.forEach(function(listener) {
                listener(name, value);
            });
            // remove listeners (delete listeners[name] is longer)
            listeners[name] = 0;
        }
    }

    function req(deps, definition) {
        var length = deps.length;
        if (!length) {
            // no dependencies, run definition now
            definition();
        } else {
            // we need to wait for all dependencies to load
            var values = [], loaded = 0;
            deps.forEach(addLoadListener.bind(0, function(name, value){
                values[deps.indexOf(name)] = value;
                if (++loaded >= length) {
                    definition.apply(0, values);
                }
            }));
        }
    }

    /** @export */
    require = req;

    /** @export */
    define = function(name, deps, definition) {
        if (!definition) {
            // just two arguments - bind name to value (deps) now
            resolve(name, deps);
        } else {
            // asynchronous define with dependencies
            req(deps, function() {
                resolve(name, definition.apply(0, arguments));
            });
        }
    }

}());