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
        nsp = 'se/soma/' + url,
        obj = {};

    function next() {
      if(scripts.length == 0) return callback ? callback() : null;
      else loadScripts(scripts, callback);
    }

    console.log('nsp', nsp)

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
      addAlias(key, nsp);
      console.log('> Successfully loaded ' + key + '.');
      next();
    };
    script.onerror = function() {
      failedSrcipts[key] = obj;
      console.warn('> Failed to load ' + key + '.');
      next();
    };
    addNameSpace(nsp);
    script.src = baseUrl + url + '.js?' + cache;
    document.head.appendChild(script);

    return { then: function(cB) { callback = cB; } };

  }

  function getScope( parent, path ) {
    if(path.length <= 1) return parent;
    var p = path.shift().replace('..', 'parent');
    console.log('p', p, parent, window.se);
    if(!parent[p]) throw new Error('Application build error: missing scope "' + p + '"');
    return getScope(parent[p], path);
  }

  function setScope( parent, path ) {
    var p = path.shift().replace('..', 'parent');
    console.log('p2', p, parent, path.slice(0));
    if(!parent[p]) {
      Object.defineProperty(parent, p, {
        value: {}
      });
    } else if(typeof(parent[p]) != 'object' || Array.isArray(parent[p])) {
      throw new Error('Application build error: namespace conflict between scope and property "' + p + '"');
    }
    if(path.length > 1) setScope(parent[p], path);
  }

  function addNameSpace( source ) {
    var path  = source.split('/'),
        _path = path.slice(0);
    setScope(window, path);
    console.log('window.' + _path.join('.'), ' = ', getScope(window, _path.slice(0)));
  }

  function addAlias( alias, source ) {
    var path  = source.split('/');
    window[alias] = getScope(window, path)[alias];
    console.log('window[' + alias + ']', ' = ', window[alias]);
  }

  Object.defineProperty(window, 'require', {
    value: async function( key ) {
      var _Class = await loadScript(key);
      return _Class;
    }
  });
    
})();