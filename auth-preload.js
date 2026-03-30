// auth-preload.js - runs before ANY page JS
window.chrome = {
    runtime: {
        id: undefined,
        connect: function() { return { onMessage: { addListener: function(){} }, postMessage: function(){}, disconnect: function(){} }; },
        sendMessage: function() {},
        onMessage: { addListener: function() {}, removeListener: function() {}, hasListener: function() {} },
        onConnect: { addListener: function() {}, removeListener: function() {} },
    },
    app: {
        isInstalled: false,
        getDetails: function() { return null; },
        runningState: function() { return 'cannot_run'; }
    },
    csi: function() {},
    loadTimes: function() {}
};