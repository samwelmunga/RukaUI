//--------------------------------------------------------------------------
// Public class RukaEvents
//--------------------------------------------------------------------------

/**
 *  Controls the page-layers.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 */
se.soma.components.RukaEvents = (function() {

  var m_this        = {},

      pageload      = 'pageload',

      pagecover     = 'pagecover',

      pagechange    = 'pagechange',

      pageenter     = 'pageenter',

      pageleave     = 'pageleave';

  

  function triggerEvent( type, data ) {
    data = data || {};
    data.rukaEvent = { type, target: this };
    console.log('RukaEvents::triggerEvent', type, data);

    var event = new CustomEvent(type, {
      detail: data 
    });
    
    this.dispatchEvent(event);
    return event;
  }


  Object.defineProperties(m_this, {
    addAll: {
      value: function( list ) {
        if(!list.length) return console.error('RukaEvents.addAll expects a numerically iterable list');
        for(var i = 0, res = []; i < list.length; res.push(m_this.add(list[i++])));
        console.log('RukaEvents::addAll[results]', res);
        return res;
      }
    },
    add: {
      value: function( _this ) {
        var fireEvent, events;
        fireEvent = triggerEvent.bind(_this);
        events = {
      
          /**
           * @dispatch pageload
           */
          pageload: function( data ) { return  fireEvent(pageload, data); },
      
          /**
           * @dispatch pagecover
           */
          pagecover: function( data ) { return  fireEvent(pagecover, data); },
      
          /**
           * @dispatch pagechange
           */
          pagechange: function( data ) { console.log('RukaEvents::pagechange', data); return  fireEvent(pagechange, data); },
      
          /**
           * @dispatch pageenter
           */
          pageenter: function( data ) { return  fireEvent(pageenter, data); },
      
          /**
           * @dispatch pageleave
           */
          pageleave: function( data ) { return  fireEvent(pageleave, data); }
          
        };
        return events;

      }
    }
  });

  return m_this;

})();