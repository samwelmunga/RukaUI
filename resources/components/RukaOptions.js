
/**
 *  Represents options 
 *
 *  @version    0.8
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.media.components.RukaOptions = (function( main ) {
  
    //----------------------------------------------------------------------
    // Strict mode
    //----------------------------------------------------------------------
  
    "use strict";


      //----------------------------------------------------------------------
      // Private scope
      //----------------------------------------------------------------------
    
      Object.defineProperties(this, {

          transitions: {
              get: function() {
                  return new RukaTransitions(main);
              }
          },

          animations: {
              get: function() {
                  return new RukaAnimations(main);
              }
          },

          fullscreen: {
              get: function() {
                  return new RukaScreenEvents(main);
              }
          }
      });

});