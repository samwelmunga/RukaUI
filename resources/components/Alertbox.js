//--------------------------------------------------------------------------
// Public class
//--------------------------------------------------------------------------

/**
 *  Represents a alerbox on a UI.
 *
 *  @version    0.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.media.components.Alertbox = (function( message, callback, cancable ) {
  
    //----------------------------------------------------------------------
    // Strict mode
    //----------------------------------------------------------------------
  
    "use strict";

    RukaRenderer.call(this, 'div');

      //----------------------------------------------------------------------
      // Private scope
      //----------------------------------------------------------------------

      var m_this = this;
      var cover = (document.getElementsByClassName('cover')[0]) ? document.getElementsByClassName('cover')[0] : null;

      var button = {
        
        get CONFIRM() {
          return { 
            element: 'button', 
            class: 'confirmBtn', 
            ref: 'confirmBtn', 
            innerHTML: m_this.confirmText,
            value: 1,
            on: { click: m_this.close }
          };
        },
        
        get CANCEL() {
          return { 
            element: 'button', 
            class: 'cancelBtn', 
            ref: 'cancelBtn', 
            innerHTML: m_this.cancelText,
            value: 0,
            on: { click: m_this.close }
          };
        }

      };

      var dom = {
        get DIALOG() {
          return { 
            element: 'p', 
            class: 'alertText',
            innerHTML: m_this.message
          };
        }
      }


      function init() {

        m_this.dom.classList.add('alertbox');
      
        m_this.printHTML([
          dom.DIALOG,
          button.CONFIRM,
        ]);

        if(cancable) {
          m_this.printHTML([button.CANCEL]);
        }

      }


      //----------------------------------------------------------------------
      // Public scope
      //----------------------------------------------------------------------
      
      this.message  = message || null;

      this.callback = callback || null;

      this.cancable = cancable || false;

      this.confirmText = 'OK';

      this.cancelText  = 'Cancel';


      this.alert = function( msg ) {

        m_this.close();

        m_this.message = msg || m_this.message;

        if(m_this.message == null) throw new TypeError('No message have been provided to display.');

        init();

        document.body.appendChild(m_this.dom);

        if(!cover) return;
        
        cover.classList.remove('flash-in');
        cover.classList.add('blurred');

      };
      
      this.close = function( e ) {
        if(e && e.target && Number(e.target.getAttribute('value')) === 1) {
          if (m_this.callback) {
            m_this.callback(m_this.dom);
          }
        }
        
        if(m_this.dom.parentNode == document.body) document.body.removeChild(m_this.dom);
        
        if(!cover) return;
        
        cover.classList.add('flash-in');
        cover.classList.remove('blurred');
      };


      if(message) this.alert();

});
se.soma.media.components.Alertbox.prototype = Object.create(se.soma.media.utils.view.RukaRenderer.prototype);
se.soma.media.components.Alertbox.prototype.constructor = se.soma.media.components.Alertbox;