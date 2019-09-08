//--------------------------------------------------------------------------
// Public class
//--------------------------------------------------------------------------

/**
 *  Represents the different transition animations of a RukaPage-UI.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.components.RukaTransitions = (function( key ) {
    
      //----------------------------------------------------------------------
      // Strict mode
      //----------------------------------------------------------------------
    
      "use strict";


        //----------------------------------------------------------------------
        // Private scope
        //----------------------------------------------------------------------
        var m_this = {
         

          pop: {
            intro:   ['pop-in'],
            outro:   ['pop-out'],
            outro2:  ['pop-in'] 
          },
         
         
          slide_vertical: {
            intro:   ['focus'],
            outro:   ['slide-up'],
            outro2:  ['slide-down'],
            prevent: true 
          },


          slide_pop_vertical: {
            intro:  ['pop-in'],
            outro:  ['slide-up'],
            outro2: ['slide-down']           
          },
         
         
          slide_horizontal: {
            intro:   ['focus'],
            outro:   ['slide-left'],
            outro2:  ['slide-right'],
            prevent: true
          },
          

          roll_up_horizontal: {
            intro:   ['focus'],
            outro:   ['slide-left', 'slide-up', 'roll-up-acw'],
            outro2:  ['slide-right', 'slide-up', 'roll-up-cw'],
            prevent: true
          },


          roll_down_horizontal: {
            intro:   ['focus'],
            outro:   ['slide-left', 'slide-down', 'roll-down-acw'],
            outro2:  ['slide-right', 'slide-down', 'roll-down-cw'],
            prevent: true
          },


          slide_pop_horizontal: {
            intro:  ['pop-in'],
            outro:  ['slide-left'],
            outro2: ['slide-right']           
          },
         
         
          fold_vertical: {
            intro:  ['fold-above'],
            outro:  ['fold-above'],
            outro2: ['fold-below']
          },

          
          fold_pop_vertical: {
            intro:  ['pop-in'],
            outro:  ['fold-above'],
            outro2: ['fold-below']  
          },
         
         
          fold_horizontal: {
            intro:  ['fold-left'],
            outro:  ['fold-left'],
            outro2: ['fold-right']
          },
          
          
          fold_pop_horizontal: {
            intro:  ['pop-in'],
            outro:  ['fold-left'],
            outro2: ['fold-right']
          }
        
        
        };

        if(key && m_this[key]) 
          return m_this[key];

        return m_this;

});