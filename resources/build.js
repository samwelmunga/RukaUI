//--------------------------------------------------------------------------
// Strict mode
//--------------------------------------------------------------------------

"use strict";

//--------------------------------------------------------------------------
// Anonymous function
//--------------------------------------------------------------------------

/**
 *  Loads all global system-files into the document.
 *
 *  @version    3.2
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA)
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 */
(function() {
  var baseUrl = '../resources/',
      systemRuntime = [
        'AppInstaller',
        'Manifest',
        'Polyfill',
        'RukaRenderer',
        'RukaWorker',
        'RukaEvents',
        'RukaSettings',
        'RukaOptions',
        'RukaTransitions',
        'RukaAnimations',
        'RukaScreenEvents',
        'ScrollBar',
        'Alertbox',
        'Loader',
        'RukaPage',
        'RukaUI',
        'RukaOS',
        'App'
      ],
      loadedSrcipts = {},
      failedSrcipts = {},
      sysUrl  = '../scripts.json',
      cache   = Math.floor(Math.random() * 10000) + 10,
      request = null,
      library = null;

  if(XMLHttpRequest){
      request = new XMLHttpRequest();
  } else if (ActiveXObject){
      request = new ActiveXObject("Microsoft.XMLHTTP");
  } else{
      throw new Error('Fatal Error: Missing support for AJAX request.');
  }

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      library = JSON.parse(this.responseText);
      loadScripts(systemRuntime);
      console.log('system fetched.', library);
    }
  }

  request.open('GET', sysUrl, true);
  request.send();

  function loadScript( key ) {
    return new Promise(function( resolve ) {
      loadScripts([key]).then(resolve.bind(null, window[key]));
    });
  }

  function loadScripts( scripts, callback ) {

    var script,
        key = scripts.shift(),
        url = library[key],
        obj = {};

    function next() {
      if(scripts.length == 0) return callback ? callback() : null;
      else loadScripts(scripts, callback);
    }

    obj[key] = url;
    if(!url) {
      failedSrcipts[key] = obj;
      return next();
    } else if(loadedSrcipts[key]) {
      return next();
    }

    script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
      loadedSrcipts[key] = obj;
      addAlias(key, 'se/soma/' + url);
      console.log('> Successfully loaded ' + key) + '.';
      next();
    };
    script.onerror = function() {
      failedSrcipts[key] = obj;
      console.warn('> Failed to load ' + key) + '.';
      next();
    };
    script.src = baseUrl + url + '.js?' + cache;
    document.head.appendChild(script);

    return { then: function(cB) { callback = cB; } };

  }

  function getClass( parent, path ) {
    if(path.length == 0) return parent;
    var p = path.shift().replace('..', 'parent');
    if(!parent[p]) parent[p] = {};
    return getClass(parent[p], path);
  }

  function addAlias( alias, source ) {
    var path  = source.split('/');
    var _path = path.slice(0);
    window[alias] = getClass(window, path);
    console.log('window + [' + alias + ']', ' = ', window[alias], _path);
  }

  window.require = async function( key ) {
    var _Class = await loadScript(key);
    return _Class;
  };
    
})();