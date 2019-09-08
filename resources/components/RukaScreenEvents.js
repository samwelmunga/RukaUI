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
se.soma.components.RukaScreenEvents = (function( main ) {
  
    //----------------------------------------------------------------------
    // Strict mode
    //----------------------------------------------------------------------
  
    "use strict";
  
var m_this = this, 

    m_body = null,
    
    m_stop = false,

    m_time = 250,

    m_elem = null,

    m_move = null,
    
    m_offY = 0;
    
    function timeout() {
        m_stop = true;
        setTimeout(function() { m_stop = false; }, 250);
    }

    function setDirection( e, end ) {
        if(!e.changedTouches) return;

        if(!end) {
            m_move = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
            }
        } else if(m_move && m_move.x && m_move.y) {
            var x = Math.abs(m_move.x - e.changedTouches[0].pageX),
                y = Math.abs(m_move.y - e.changedTouches[0].pageY),
                origin,
                offset,
                isNext,
                direction,
                orientation;
            
            if(x > y) {
                origin = m_move.x;
                offset = x;
                isNext = !(origin < e.changedTouches[0].pageX);
                direction = isNext ? 'left' : 'right';
                orientation = 'horizontal';
            } else {
                origin = m_move.y;
                offset = y;
                isNext = !(origin < e.changedTouches[0].pageY);
                direction = isNext ? 'up' : 'down';
                orientation = 'vertical';
            }
            m_move = { origin, offset, direction, orientation, isNext };
        }
    }

    function getDirection() {
        if(!m_move || !m_move.origin || !m_move.offset) return null;
        return m_move;
    }

    function isScrollable( e ) {

        if(e.type == 'touchstart') {
            setDirection(e);
// console.log('touchstart', m_elem)
            if(this.classList.contains('page-wrapper')) {
                m_elem = this.get('[scrollable]')[0];
                return true;
            }
            return false;
        } else if(e.type == 'touchend') {
            setDirection(e, true);
            if(m_elem) {
// console.log('isScrollable?', m_elem, !!getDirection(), '&&', m_elem.scrollTop, '> 0 &&', m_elem.offsetHeight, '+', m_elem.scrollTop, '<', m_elem.scrollHeight)
                if(getDirection()) {
                    var o = getDirection().orientation;
                    if( o == 'vertical' && m_elem.scrollTop > 0 && (m_elem.offsetHeight + m_elem.scrollTop) < m_elem.scrollHeight ||
                        o == 'horizontal' && m_elem.scrollLeft > 0 && (m_elem.offsetWidth + m_elem.scrollLeft) < m_elem.scrollWidth ) {
                        m_elem = null;
                        timeout();
                        return true;
                    }
                }
                m_elem = null;
            }
            return false;
        }
        m_elem = null;
        
    }

    Object.defineProperties(this, {

        body: {
            get: function() {
                return m_body;
            },
            set: function( el ) {
                m_body = el;
            }
        },

        setFullScreenEvent: {

            value: function( el, type ) {
              el = el.target ? el.target : el;
              el.add(type, function( e ) { m_this.toggleFullScreen(e); });
            }

        },

        toggleFullScreen: {

            value: function( e ) {
    
              var elem = document.body;
              var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);
      
              if (isInFullScreen) {
                m_this.cancelFullScreen(document);
              } else {
                m_this.requestFullScreen(elem);
              }
            }

        },
    
        toggleFullScreenActiveX: {

            value: function() {
              var wscript = new ActiveXObject("WScript.Shell");
          
              if (wscript !== null) {
                  wscript.SendKeys("{F11}");
              }
            }

        },
    
        requestFullScreen: {
            
            value: function( el ) {
              var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
      
              m_this.body = el || document.body;
      
              m_this.addTouchEvents(el);
              
              if (requestMethod) { 
                requestMethod.call(el);
              } else if (typeof window.ActiveXObject !== "undefined") {
                m_this.toggleFullScreenActiveX();
              }
            }
          
        },
    
        cancelFullScreen: {

            value: function( el ) {
              var requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
      
              m_this.removeTouchEvents();
      
              if (requestMethod) {
                requestMethod.call(el);
              } else if (typeof window.ActiveXObject !== "undefined") {
                m_this.toggleFullScreenActiveX();
              }
            }

        },
    
        checkTouchScreenNavigation: {

          value: function( e, ix ) {
            if(e && e.target && e.target.offsetTop === 0) e.preventDefault();
            
            ix = ix ? ix : main.ui.length > 1 ? main.ui[0].layers.indexOf(main.ui[0].activePage) : 0;

            if(m_stop === true || isScrollable.call(main.ui[ix].activePage, e)) return;

            var dir = getDirection();
            //if(!dir || dir.orientation == 'vertical') return;
// console.log('ix', ix, this, isScrollable.call(this, e));
            // TODO: Review
            if(dir) {
                if(dir.orientation == 'vertical') { 
                    if(e.type == 'touchend' && isScrollable(e)) return;// only vertical? most mouses only support vertical scrolling 
                    else ix = 0;
                }
            }
// console.log('dir: ', dir, '\nindex: ' + ix, '\nui:', main.ui, '\ntarget:', e, '\nthis:', this);

            main.ui[ix].touchUpdateInterface.call(main.ui[ix], e, dir);
            if(main.scrollBar) {
                main.scrollBar.updateScrollBar.call(main.ui[ix], main.ui[ix].page);
            }
            m_move = null;
          }

        },

        addEvent: {

            value: function( elem, type, func, intv ) {
                elem.addEventListener(type, func);
                if(!intv) return;
                setTimeout(function() {
                    elem.removeEventListener(type, func);
                }, intv);
            }

        },
    
        addTouchEvents: {

            value: function( el, noMouse ) {
              el = el || this;
              el.addEventListener('touchstart', m_this.checkTouchScreenNavigation);
              el.addEventListener('touchend', m_this.checkTouchScreenNavigation);
      
              if(noMouse) return;
              el.addEventListener('mousedown', m_this.checkTouchScreenNavigation);
              el.addEventListener('mouseup', m_this.checkTouchScreenNavigation);
            }

        },
    
        removeTouchEvents: {

            value: function() {
                m_this.body.removeEventListener('touchstart', m_this.checkTouchScreenNavigation);
                m_this.body.removeEventListener('touchend', m_this.checkTouchScreenNavigation);
                m_this.body.removeEventListener('mousedown', m_this.checkTouchScreenNavigation);
                m_this.body.removeEventListener('mouseup', m_this.checkTouchScreenNavigation);
            }

        }

    });

    return this;

});
