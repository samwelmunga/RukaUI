//--------------------------------------------------------------------------
// Public class
//--------------------------------------------------------------------------

/**
 *  Represents service worker properties and features.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.media.components.RukaWorker = (function( worker, options ) {
    
  
  //----------------------------------------------------------------------
  // Requirements
  //----------------------------------------------------------------------

  if(!worker) {
    return new Error('No Worker object was provided to RukaWorker.');
  } else { options = options || {}; }
    
  
  //----------------------------------------------------------------------
  // Strict mode
  //----------------------------------------------------------------------

  "use strict";


  //----------------------------------------------------------------------
  // Private scope
  //----------------------------------------------------------------------

  var _isSubscribed   = false;
  var _deferredPrompt = null;
  var _this           = null;


  /** Add to home screen */

  window.addEventListener('beforeinstallprompt', (e) => {

    e.preventDefault();
    _deferredPrompt = e;
    
    if(options.addToHomeScreen !== false) {
      addToHomeScreen();
    }

  });

  function addToHomeScreen() {
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        _deferredPrompt = null;
      });
  }

  /** Notifications */

  function getSubscription() {

    worker.pushManager
    .getSubscription()
    .then(function(subscription) {
      _isSubscribed = !(subscription === null);

      if (_isSubscribed) {
      console.log('User IS subscribed.');
      } else {
      console.log('User is NOT subscribed.');
      }

    });

  }

  function subscribeUser() {
    
    if(!window.Notification) {
      return console.warn('Missing browser support for the Notification API.');
    }

    Notification
    .requestPermission()
    .then(function(result) {

      if (result === 'denied') {
        console.log('Permission wasn\'t granted. Allow a retry.');
        return;
      }
      
      if (result === 'default') {
        console.log('The permission request was dismissed.');
        return;
      }
      
      console.log('Permission status:', result);
      
      worker.pushManager.subscribe({
        userVisibleOnly: true,
      })
      .then(function(subscription) {
        console.log('User is subscribed.');
        _isSubscribed = true;
      })
      .catch(function(err) {
        console.log('Failed to subscribe the user: ', err);
      });

    });

  }


  //----------------------------------------------------------------------
  // Public scope
  //----------------------------------------------------------------------
  
  _this = {
    
    get worker() {
      return worker;
    },

    get addToHomeScreen() {
      return addToHomeScreen;
    },

    get notifications() {
      return {
        get getSubscription() {
          return getSubscription;
        },
        get subscribeUser() {
          return subscribeUser;
        }
      }
    }
  
  };

  return _this;

});