importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

var dataCacheNames = {
    prefix: 'tz-soma-pwa',
    suffix: 'v1-0-0',
    precache: 'static-precache',
    runtime: 'runtime-cache'
}
var baseUrl = '/soma_beta/pwa/RukaUI/';
var filesToCache = [
  baseUrl + 'main/app.html',
  baseUrl + 'assets/css/custom.css',
  baseUrl + 'assets/css/ruka.css',
  baseUrl + 'assets/css/ruka-loader.css',
  baseUrl + 'assets/css/ruka-scrollbar.css',
  baseUrl + 'assets/css/font-awesome.min.css',
  baseUrl + 'assets/icons/arrow.png',
  baseUrl + 'assets/icons/arrow1.png',
  baseUrl + 'assets/icons/pause.png',
  baseUrl + 'assets/icons/play1.png',
  baseUrl + 'assets/icons/sound.png',
  baseUrl + 'assets/icons/sound1.png',
  baseUrl + 'assets/pics/logo.png',
  baseUrl + 'assets/pics/logo_48.png',
  baseUrl + 'assets/pics/logo_72.png',
  baseUrl + 'assets/pics/logo_96.png',
  baseUrl + 'assets/pics/logo_128.png',
  baseUrl + 'assets/pics/logo_192.png',
  baseUrl + 'assets/pics/logo_256.png',
  baseUrl + 'assets/pics/logo_512.png',
  baseUrl + 'assets/pics/new_background.jpg',
  baseUrl + 'resources/build.js',
  baseUrl + 'resources/scope/Manifest.js',
  baseUrl + 'resources/utils/view/RukaRenderer.js',
  baseUrl + 'resources/components/AudioTrack.js',
  baseUrl + 'resources/components/RukaEvents.js',
  baseUrl + 'resources/components/RukaSettings.js',
  baseUrl + 'resources/components/RukaOptions.js',
  baseUrl + 'resources/components/RukaTransitions.js',
  baseUrl + 'resources/components/RukaAnimations.js',
  baseUrl + 'resources/components/RukaScreenEvents.js',
  baseUrl + 'resources/components/ScrollBar.js',
  baseUrl + 'resources/components/Alertbox.js',
  baseUrl + 'resources/components/Loader.js',
  baseUrl + 'resources/utils/view/RukaPage.js',
  baseUrl + 'resources/utils/MediaPlayer.js',
  baseUrl + 'resources/utils/MailService.js',
  baseUrl + 'resources/system/RukaUI.js',
  baseUrl + 'resources/scope/Alias.js',
  baseUrl + 'resources/system/Polyfill.js'
];

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.core.setCacheNameDetails(dataCacheNames)
  workbox.precaching.precacheAndRoute(filesToCache);

  workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.NetworkFirst()
  );
  workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'css-cache',
    })
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
