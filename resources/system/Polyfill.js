//--------------------------------------------------------------------------
// Public class Polyfill
//--------------------------------------------------------------------------


//----------------------------------------------------------------------
// Strict mode
//----------------------------------------------------------------------

"use strict";

/**
 *  Polyfill browser support
 *
 *  @version    0.5
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 */
se.soma.system.Polyfill = (function() {

    var element = document.createElement('div');


    if (!window.XMLHttpRequest) {
        if (window.ActiveXObject) {
            window.XMLHttpRequest = function() { var xhttp = new ActiveXObject("Microsoft.XMLHTTP"); return xhttp; };
        }
    } 

    if (typeof window.CustomEvent !== 'function') {

        function CustomEvent ( event, params ) {
          params = params || { bubbles: false, cancelable: false, detail: undefined };
          var evt = document.createEvent( 'CustomEvent' );
          evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
          return evt;
         }
      
        CustomEvent.prototype = window.Event.prototype;
      
        window.CustomEvent = CustomEvent;
    }

    if(!HTMLCollection.prototype.each) {

        Object.defineProperties(HTMLCollection.prototype, {
            each: {
                value: function(func) {
                    for(var arr = [], i = 0; i < this.length; arr.push(func.call(this[i], i++, this)));
                    return arr;
                }
            }
        });

    }

    if(!HTMLCollection.prototype.toArray) {

        Object.defineProperties(HTMLCollection.prototype, {
            toArray: {
                value: function() {
                    for(var arr = [], i = 0; i < this.length; arr.push(this[i++]));
                    return arr;
                }
            }
        });

    }

    if(!NodeList.prototype.toArray) {

        Object.defineProperties(NodeList.prototype, {
            toArray: {
                value: function() {
                    for(var arr = [], i = 0; i < this.length; arr.push(this[i++]));
                    return arr;
                }
            }
        });

    }

    if(!Array.prototype.flatArray) {

        Array.prototype.flatArray = function() {
            return this.reduce(function(a, b) {
                return a.concat(b);
            }, []);
        };

    };

    if(!Array.prototype.item) {

        Object.defineProperties(Array.prototype, {
            item: {
                value: function( ix ) {
                    if(!ix) throw new Error('No index provided.');
                    else if(isNaN(ix)) throw new Error('Provided index (' + ix + ') isNaN.');
                    //else if(ix < 0 || ix >= this.length) throw new Error('Provided index (' + ix + ') is out of the range of the array.');
                    return this[ix] || null;
                }
            }
        });

    }

    if(!document.get) {

        Object.defineProperty(document, 'get', {
            value: function( key ) {
                if(!key || typeof(key).toLowerCase() != 'string') throw new Error('Exception error: Expected key as string, got ' + JSON.stringify(key));
                var sign = key[0];
                switch(sign) {
                    case '.': return this.getElementsByClassName(key.slice(1));
                    case '#': return this.getElementById(key.slice(1));
                    case '[': return this.querySelectorAll(key);
                    case '?': return key[1] == '#' ? !!this.get(key.slice(1)) : !!this.get(key.slice(1))[0];
                    default : return this.getElementsByTagName(key);
                }
            }
        });

    }

    if(!element.get) {

        Object.defineProperty(Element.prototype, 'get', {
            value: function( key ) {
                if(!key || typeof(key).toLowerCase() != 'string') throw new Error('Exception error: Expected key as string, got ' + JSON.stringify(key));
                var sign = key[0];
                switch(sign) {
                    case '.': return this.getElementsByClassName(key.slice(1)).toArray();
                    case '#': return this.getElementById(key.slice(1));
                    case '[': return this.querySelectorAll(key).toArray();
                    case '?': return key[1] == '#' ? !!this.get(key.slice(1)) : !!this.get(key.slice(1))[0];
                    default: return this.getElementsByTagName(key).toArray();
                }
            }
        });

    }

    if(!element.attr) {

        Object.defineProperty(Element.prototype, 'attr', {
            value: function( key, val ) {
                if(!key || typeof(key).toLowerCase() != 'string') throw new Error('Exception error: Expected key as string, got ' + JSON.stringify(key));
                if(!val || typeof(val).toLowerCase() != 'string') throw new Error('Exception error: Expected val as string, got ' + JSON.stringify(val));

                if(!val) return this.getAttribute(key);
                if(val == '?') return this.hasAttribute(key);
                this.setAttribute(key, val);
            }
        });

    }

    if(!element.classList) {

        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {

                var m_this = this, cls = m_this.className.split(' ');

                cls.add = function ( args ) {
                    
                    var cl  = m_this.getAttribute('class'),
                        str = '';

                    args = (typeof args == 'string') ? [args] : args;
                    
                    for(var i in args) {
                        if(cl == null) {
                            str += args[i] + ' ';
                        } else if(cl.indexOf(args[i].replace(' ', '')) < 0) {
                            cl += ' ' + args[i].replace(' ', '');
                            str = cl;
                        } else str = cl;
                    }
                    m_this.setAttribute('class', str);
                    return true;
                }

                cls.remove = function( args ) {
                    
                    var cl = m_this.getAttribute('class');
                    
                    args = (typeof args == 'string') ? [args] : args;
                    
                    if(cl == null) return true;

                    var arr = cl.split(' ');

                    for(var i in args) {
                        if(arr.indexOf(args[i]) < 0) continue;
                        if(arr.length > 1) {
                            if(arr.indexOf(args[i]) > 0)
                                cl = cl.replace(' ' + args[i], '');
                            else 
                                cl = cl.replace(args[i] + ' ', '');
                        } else {
                            cl = cl.replace(args[i], '');
                        }
                    }

                    m_this.setAttribute('class', cl);
                    return true;
                };

                /**
                 * TODO: MOST PROBABLY NEEDS FIXING, BUILD LIKE 'ADD' AND 'REMOVE'
                 */
                cls.toggle = function( x ) {
                    var b;
                    if(x) {
                        m_this.className = '';
                        b = false;
                        for (var j = 0; j<cls.length; j++) {
                            if(cls[j] != x) {
                                m_this.className += (m_this.className ? ' ' : '') + cls[j];
                                b = false;
                            } else b = true;
                        }
                        if(!b) {
                            m_this.className += (m_this.className ? ' ' : '') + x;
                        }
                    } else throw new TypeError('No arguments provided')
                    return !b;
                };

                
                cls.contains = function( x ) {
                    
                    if(x) {
                        
                        var cl = m_this.getAttribute('class');
                        
                        if(cl == null) return false;

                        return (cl.indexOf(x) > -1) ? true : false;

                    } else throw new TypeError('No arguments provided');

                };

                return cls; 
            },
            enumerable: false
        });

    };

    if(!window.getType) {

        Object.defineProperty(window, 'getType', {
            value: function( thing ) {
                var _type = thing.constructor.toString().split('()')[0].split(' ')[1],
                    _ix   = _type.indexOf('Element') > -1 ? _type.indexOf('Element') : 4;

                if(_type.indexOf && _type.indexOf('HTML') > -1)
                    _type = _type.slice(0,4) + _type.slice(_ix);
                return _type;
            }
        });

    }

    if(!element.add) {

        Object.defineProperty(Element.prototype, 'add', {
            get: function() {

                var m_this = this, handler; 
                
                if(!m_this.eventList) m_this.eventList = {};
                
                m_this.eventList.trigger = function( e ) {
                    if(e.currentTarget != m_this) return;

                    if(m_this.eventList[ e.type ]) {
                        m_this.eventList[ e.type ].map(function( f ) {
                            f.call( m_this, e );
                        });
                    }
                };

                return function( obj, prop ) {

                    switch(window.getType(obj)) {

                        case 'String':
                            if(Element.attachEvent) {
                                m_this.attachEvent(obj, prop);
                            } else {
                                if(!m_this.eventList[ obj ]) m_this.eventList[ obj ] = [];
                                m_this.eventList[ obj ].push(prop);
                                m_this[ 'on' + obj ] = m_this.eventList.trigger;
                            }            
                            return m_this;

                        case 'Object': 
                            for( var p in obj ) {
                                if(p != 'class')
                                    m_this.setAttribute(p, obj[p])
                                else  
                                    m_this.classList.add(obj[p]);
                            }
                            return m_this;

                        case 'Array':
                            for(var i = 0; i < obj.length; m_this.add(obj[i++], prop));
                            return m_this;

                        case 'HTMLCollection':
                            for(var i = 0; i < obj.length; m_this.add(obj[i++], prop));
                            return m_this;

                        case 'HTMLElement':
                            m_this.appendChild(obj);
                            prop = prop || {};
                            for( var p in prop ) {
                                obj.setAttribute(p, prop[p])
                            }
                            return m_this;                          

                    }
                };

            },
            enumerable: false

        });
    }

    if(!element.remove) {

        Object.defineProperty(Element.prototype, 'remove', {
            get: function() {
                var m_this = this, handler; 

                return function( obj, prop ) {

                    switch(window.getType(obj)) {
                        case 'String':
                            if(Element.detachEvent) {
                                m_this.detachEvent(obj, prop);
                            } else {
                                m_this['on' + obj] = null;
                                if(m_this.eventList && m_this.eventList[ obj ]) {
                                    m_this.eventList[ obj ].splice(m_this.eventList[ obj ].indexOf(obj), 1);
                                }
                            }
            
                            return;

                        case 'Object': 
                            for( var p in obj ) {
                                if(p != 'class')
                                    m_this.removeAttribute(p, obj[p]);
                                else  
                                    m_this.classList.remove(obj[p]);
                            }
                            return obj;

                        case 'Array':
                            for(var i = 0; i < obj.length; m_this.remove(obj[i++], prop))
                            return obj;

                        case 'HTMLCollection':
                            for(var i = 0; i < obj.length; m_this.remove(obj[i++], prop))
                            return obj;

                        case 'HTMLElement':
                            if(!prop) 
                                m_this.removeChild(obj);
                            else
                                for( var p in prop ) {
                                    obj.removeAttribute(p);
                                }
                            return;   
                    }
                };

            },
            enumerable: false
        });
    }


    if(!element.dispatch) {

        Object.defineProperty(Element.prototype, 'dispatch', {
            get: function() {
            var m_this = this, dispatch;
            
            dispatch = function( obj ) {
                if(m_this.eventList) {
                    m_this.eventList.trigger({currentTarget: m_this, type: obj});
                }
            };

            return dispatch;
            },
            enumerable: false
        });

    };

    if(!element.origo) {

        Object.defineProperty(Element.prototype, 'origo', {
            get: function() {            
                var m_this = this, 

                    origo  = {
                        get x() {
                            var xPos  = m_this.getBoundingClientRect().left,
                                xSize = m_this.offsetWidth;
                                return xPos + (xSize >> 1);
                        },

                        get y() {
                            var yPos  = m_this.getBoundingClientRect().top,
                                ySize = m_this.offsetHeight;
                                return yPos + (ySize >> 1);
                        }  
                    };

                return origo;
            }

        });
    }

})();