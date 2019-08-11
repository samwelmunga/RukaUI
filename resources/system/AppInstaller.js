// GLOBAL PROPERTIES

var SERVICE_WORKER;

var APP_BOOT;


// INSTALLER
(function() {

var loader;

var workerLoader;

var appHasBooted = false;

var awaitWorker  = true;

var awaitWindow  = true;

var AppInstaller = {
    
    install: function() {
        console.log('Booting worker');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('../../service-worker.js')
                .then(function(sw) { 
                    console.log('Service Worker Registered');
                    SERVICE_WORKER = sw;
                    awaitWorker = false;
                    AppInstaller.bootApp();
                })
                .catch(function(err) { 
                    console.log('Something went wrong: ' + err);
                    awaitWorker = false;
                    AppInstaller.bootApp();
                });
        } else {
            console.log('support for service worker missing.');
            awaitWorker = false;
            AppInstaller.bootApp();
        }
    },

    onApplicationReady: function() {
        loader = new Loader(document.get('.cover')[0]);
        workerLoader  = loader.start();
        awaitWindow = false;
        if(!awaitWorker) { 
            AppInstaller.bootApp();
        } else{
            setTimeout(function() {
                awaitWorker = false; 
                AppInstaller.bootApp();
            }, 5000);
        }
    },

    bootApp: function() {
        if(appHasBooted === true || awaitWorker === true || awaitWindow == true) return;
        if(workerLoader) loader.stop(workerLoader);
        appHasBooted = true;
        console.log('Booting app', SERVICE_WORKER);
        APP_BOOT();
    }
    
};

window.addEventListener('load', AppInstaller.onApplicationReady);
AppInstaller.install();

})();
