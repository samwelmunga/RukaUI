//--------------------------------------------------------------------------
// Public class
//--------------------------------------------------------------------------

/**
 *  Represents a loader on a UI.
 *
 *  @version    0.8
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.media.components.Loader = (function( parent, settings ) {
  
    //----------------------------------------------------------------------
    // Strict mode
    //----------------------------------------------------------------------
  
    "use strict";


      //----------------------------------------------------------------------
      // Private scope
      //----------------------------------------------------------------------
      var _this     = this,
          _loader   = null,//document.getElementsByClassName('loader')[0] || null,
          _parent   = parent || document.body,
          _running  = false,
          _settings = settings || {},
          _obj;
      
      if(!settings) {
        _settings.style = { 
                            background_image: 'url(../assets/pics/logo.png)',
                            background_position: '50%',
                            background_size: 'contain',
                            background_repeat: 'no-repeat',
                            height: '225px',
                            width: '225px'
                          };

        
        _settings.dom = [{ 
                          element: 'div', class: 'circle' 
                        },
                        { 
                          element: 'div', 
                          class: 'emblem',  
                          style: _settings.style
                        }];                                               
        }
      //----------------------------------------------------------------------
      // Public scope
      //----------------------------------------------------------------------


      this.getLoader = function() {

        if(_loader) return _loader;

        var l = document.createElement('div');
  
        l.classList.add('loader');
  
        var loader = new RukaRenderer(l);
        loader.printHTML(_settings.dom);
        _parent.appendChild(loader.dom);
        loader.dom.classList.add('hide');
        _loader = loader.dom;
        return loader.dom;
  
      };

      this.start = function() {
        
        if(_running) return;

        _loader    = _this.getLoader();
        _obj       = run();
        _running   = true;

        if(_settings.present) 
          _settings.present.classList.add(_obj.fx); 

        return _obj;
        
      };

      this.stop = function() {

        if(!_obj || !_running) return;
        
        _obj.cover.classList.add(_obj.fx); 
        if(_settings.present) 
          _settings.present.classList.add(_obj.fx); 
        
        if(!_obj.loader) return;

        _obj.loader.classList.add('hide');
        _running = false;
      
      }

      function run( fx ) {

        fx = fx || 'flash';
        if(_settings.loader !== false) {
          _loader = _this.getLoader();
          _loader.classList.remove('hide');
        }
        _parent.appendChild(_loader);
        _parent.classList.remove(fx);

        return { cover: _parent, loader: _loader, fx: fx };
      
      }
});