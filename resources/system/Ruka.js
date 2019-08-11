//--------------------------------------------------------------------------
// Public class Ruka
//--------------------------------------------------------------------------


//----------------------------------------------------------------------
// Strict mode
//----------------------------------------------------------------------

"use strict";

/**
 *  Runtime
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 */

(function() {

  var main,

      view,

      serv,

      http,

      conn,

      last,

      ping,

      lost,
  
      back,

      freq = 7000,
      
      load = false;

  window.se.soma.system.Ruka = {

    ui:             [],

    body:           null,

    cover:          null,

    loader:         null,

    settings:       null,

    init: function() {

      console.log('Starting Ruka');
      if(!main) main = se.soma.system.Ruka;
      if(!view) view = new RukaRenderer();

      var layers     = document.get('.global-wrapper'),
          settings   = document.get('page-settings').toArray(),
          user_sett  = document.get('custom-settings');

      window.scrollTo(0, 2);

      main.initOptionsComponent();
      main.initUI(layers, settings);
      main.initSettingsComponent();
      load = true;
      // main.removeSettingsTags(settings);
      // main.removeSettingsTags(user_sett);
      console.log('Ruka loaded');

    },

    pingConnection: function() {
      
      console.log('ping', conn, main.pingFrequencey, main.endpoint);
      if(ping) clearTimeout(ping);
      if(!main.endpoint) {
        console.warn('Missing endpoint to ping.');
        return;
      }

      http         = new XMLHttpRequest();
      http.timeout = 3500;

      http.onerror = function() {
        last = conn;
        conn = false;
        main.updateConnectionState();
      }
      http.onreadystatechange = function() {
        if (this.readyState == 4) {
          if(this.status == 200) {
            last = conn;
            conn = true;
            main.updateConnectionState();
          } 
        }
      };

      http.open('GET', main.endpoint, true);
      http.send();
    
    },

    stopConnectionPing: function() {
      clearTimeout(ping);    
    },

    updateConnectionState: function() {
      if(last == conn) {
        ping = setTimeout(main.pingConnection, main.pingFrequencey);
        return;
      }

      if(conn == true) {
        console.log('online');
        if(back && typeof back == 'function') { back(); }
      } else {
        console.log('offline');
        if(lost && typeof lost == 'function') { lost(); }
      }
      ping = setTimeout(main.pingConnection, main.pingFrequencey);
    },

    connect: function( _on, _off ) {
      if(!main) main = se.soma.system.Ruka;
      back = _on;
      lost = _off;
      main.pingConnection();
    },

    initOptionsComponent: function() {

      main.options  = new RukaOptions(main);
      main.events   = RukaEvents;
      main.screen   = main.options.fullscreen;

    },

    initSettingsComponent: function() {
      
      //...
    
    },

    initUI: function( layers, settings ) {
      for(var i = 0, s; i < layers.length; i++) {
        if(layers[i].children.length < 1) continue;
        s = settings.filter(function(_s){ return _s.getAttribute('for') == layers[i].id; })[0] || document.get('default-settings')[0];
        main.ui[i] = new RukaPage(layers[i].children, s);
        
        switch(main.ui[i].mode) {
          case 'scroll': main.initScrollMode(main.ui[i]); break;
          case 'timer' : main.initTimerMode(main.ui[i]); break;
          case 'button': main.initButtonMode(main.ui[i]); break;
          default: main.initScrollMode(main.ui[i]);
        };
      }
    },

    initScrollMode: function( ui ) {

      if(main.isMobile()) {
        /**
          * Mobile
          */
        ui.layers.map(function( parent ) { 

          parent.classList.add('absolute'); 
  
          parent.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            main.screen.checkTouchScreenNavigation.call(parent, e);
          });
          parent.addEventListener('touchend', function(e) {
            e.stopPropagation();
            main.screen.checkTouchScreenNavigation.call(parent, e);
          });
  
        });

      } else {
        /**
          * Desktop
          */
        ui.layers.map(function( parent ) { parent.classList.add('fixed'); });
        setTimeout(function() {
          if(main.isMobile()) {
            main.screen.addTouchEvents(document.body, true);
          } else {
            window.addEventListener('scroll', function(e) {
              var p1 = ui.page;
              var p2 = ui.autoUpdateInterface.call(ui);
              main.dispatchEvent(ui.dom, p1, p2);
            });
          }
        }, 1000);

      }
    },

    initTimerMode:  function( ui ) {

      ui.layers.map(function( parent ) { parent.classList.add('absolute'); });
      setInterval(function() {
        var p1 = ui.page;
        var p2 = ui.autoUpdateInterface.call(ui);
        main.dispatchEvent(ui.dom, p1, p2);
      }, ui.autoTimer);  

    },

    initButtonMode: function( ui ) {

      var ix = main.ui.indexOf(ui);

      ui.prevBtn.addEventListener('click', function(e) {
        ui.autoUpdateInterface.call(ui,0);
        main.dispatchEvent(this, 2, 1);
      });
      ui.nextBtn.addEventListener('click', function(e) {
        ui.autoUpdateInterface.call(ui,1);
        main.dispatchEvent(this, 1, 2);
      });

      ui.autoUpdateInterface.call(ui,0);
      
    },
    
    initScrollBar: function( ui, opt ) {
      
    },

    preventUpdateEvent: function( _elem ) {
        
        var _event = main.screen.checkTouchScreenNavigation.bind(_elem);
        _elem.addEventListener('touchstart', _event);
        _elem.addEventListener('touchend', _event);
        
    },

    dispatchEvent: function( _that, p1, p2 ) {

      _that.dispatch(main.events.pagechange);
      if(p1 > p2)
        _that.dispatch(main.events.pageback);
      else if(p2 > p1)
        _that.dispatch(main.events.pageforward);

    },

    removeSettingsTags: function( settings ) {
      for(;0 < settings.length; document.body.removeChild(settings[0]));
    },

    isConnected: function() {
      return !!conn;
    },

    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

  };
  
  Object.defineProperties(window.se.soma.system.Ruka, {

    loaded: {
      get: function() {
        return load;
      }
    },

    endpoint: {
      get: function() {
        return serv;
      },
      set: function( url ) {
        return serv = url;
      },
    },

    online: {
      get: function() {
        return conn;
      }
    },

    pingFrequencey: {
      get: function() {
        return freq / (2 - Number(conn));
      },
      set: function( fq ) {
        if(isNaN(fq)) { return new Error('The provided ping frequency must be a number.') }
        else if(fq < 10) { return new Error('Maximum ping frequency is 10 ms.'); }
        freq = Math.round(fq);
      }
    }
    
  });

})();
