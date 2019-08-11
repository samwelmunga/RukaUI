//--------------------------------------------------------------------------
// Strict mode
//--------------------------------------------------------------------------

"use strict";

//--------------------------------------------------------------------------
// Package
//--------------------------------------------------------------------------

if(!window.se) window.se = {};
if(!window.se.soma) window.se.soma  = {};
if(!window.se.soma.system) window.se.soma.system  = {};

//--------------------------------------------------------------------------
// Private function build
//--------------------------------------------------------------------------

/**
 *  Loads all global system-files into the document.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA)
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 */
(function() {

    var baseURI = '../resources/';
    var cache   = Math.floor(Math.random() * 10000) + 10;

    var system_runtime = [
        baseURI + 'scope/Manifest',
        baseURI + 'utils/RukaRenderer',
        baseURI + 'components/RukaWorker',
        baseURI + 'components/AudioTrack',
        baseURI + 'components/RukaEvents',
        baseURI + 'components/RukaSettings',
        baseURI + 'components/RukaOptions',
        baseURI + 'components/RukaTransitions',
        baseURI + 'components/RukaAnimations',
        baseURI + 'components/RukaScreenEvents',
        baseURI + 'components/ScrollBar',
        baseURI + 'components/Alertbox',
        baseURI + 'components/Loader',
        baseURI + 'utils/RukaPage',
        baseURI + 'utils/MediaPlayer',
        baseURI + 'utils/MailService',
        baseURI + 'system/Ruka',
        baseURI + 'scope/Alias',
        baseURI + 'system/Polyfill'
    ];


    function loadSegment() {

    var script;

        script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function() {
            if(system_runtime.length == 0) return;
                else loadSegment();
        };
        script.src = system_runtime.shift() + '.js?' + cache;
        document.head.appendChild(script);
    
    }

    /**
     * BOOTSTRAP
     */
    loadSegment();
    
})();