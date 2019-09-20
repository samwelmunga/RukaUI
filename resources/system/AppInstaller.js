// GLOBAL PROPERTIES

var SERVICE_WORKER;

var APP_BOOT;


// INSTALLER
(function() {

var loader;

var workerLoader;

var appHasBooted = false;

var awaitWorker  = true;

var AppInstaller = {
    
    install: function() {
        window.addEventListener('load', AppInstaller.onDocumentReady);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('../resources/service-worker.js')
                .then(function(sw) { 
                    console.log('Service Worker Registered');
                    SERVICE_WORKER = sw;
                    awaitWorker = false;
                    AppInstaller.bootApp();
                })
                .catch(function(err) { 
                    console.log('Service Worker failed to install: ' + err);
                    awaitWorker = false;
                    AppInstaller.bootApp();
                });
        } else {
            console.log('support for service worker missing.');
            awaitWorker = false;
            AppInstaller.bootApp();
        }
    },

    onDocumentReady: function() {
        loader = new Loader(document.get('.cover')[0]);
        workerLoader  = loader.start();
    },

    bootApp: function() {
        if(appHasBooted === true) return;
        appHasBooted = true;
        var readyStateCheckInterval = setInterval(function() {
            if (document.readyState === "complete" && awaitWorker === false) {
                clearInterval(readyStateCheckInterval);
                if(workerLoader) loader.stop(workerLoader);
                if(!APP_BOOT) return;
                console.log('Booting app', SERVICE_WORKER);
                APP_BOOT();
            }
        }, 10);
    }
    
};

AppInstaller.install();

})();
