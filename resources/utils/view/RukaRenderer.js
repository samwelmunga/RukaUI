//--------------------------------------------------------------------------
// Public class RukaRenderer
//--------------------------------------------------------------------------


/** @class RukaRenderer
 * 
 *  @version    1.1.8
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 * 
 * @desc RukaRenderer is a class that create or sets a dom and attach it to a instance,
 *       which can then use it's included methods to effectivly set up subelements in
 *       the dom.
 *
 * @param  { HTMLElement } el The main DOM in which subelements will be inserted.
 * @param  { String }      el Creates the DOM represented by the string and makes it the main DOM.
 * @param  { boolean }     el If no parameter has been set, the document body will be set as main DOM.
 * @prop   { HTMLElement } dom The property through which the instance can access the main DOM.
 * @return { Object}
 *
 */
se.soma.utils.view.RukaRenderer = (function( el ) {

  var elem;

  if(typeof(el)=='string') elem = document.createElement(el);
    else if(!el)           elem = document.body;
    else                   elem = el;

  this.dom = elem;

  return this;

});


/*-----------------------------------------------------
                    PROTOTYPES
-------------------------------------------------------*/



/** 
* @method isSet
* @desc                 isSet checks if any valid value has been set to the current array-index.
* @param { ref } Array  The array to be checked.
* @param { ix }  Number The index-position to be checked.
*/
se.soma.utils.view.RukaRenderer.prototype.isSet = function( ref, ix ) {
  if(!ref) return false;
  return (Array.isArray(ref) && ref[ ix ] && ref[ ix ] != '') ? true : false;
};


/** 
* @method isTag
* @description                isTag checks if the given element matches the desired tag name.
* @param { elem } DOMElement  The element to be checked.
* @param { tag }  String      The desired tag name.
*/
se.soma.utils.view.RukaRenderer.prototype.isTag = function( elem, tag ) {
  return (elem.tagName && elem.tagName.toLowerCase() == tag) ? true : false;
}


/** 
* @method domToArray
* @desc                  Converts DOM-list to array.
* @param { list } Array  The DOM-list to be converted.
*/
se.soma.utils.view.RukaRenderer.prototype.domToArray = function( list ) {
  for(var arr = [], i = 0; i < list.length; arr.push(list[i++]));
  return arr;
};


/** 
* @method flatDOMList
* @desc                  Flatmaps a given array.
* @param { list } Array  The array to be fattened.
*/
se.soma.utils.view.RukaRenderer.prototype.flatDOMList = function( list ) {
  return list.reduce(function(a, b) {
      return a.concat(b);
  }, []);
};


/** @method addAttribute
* @desc                    addAttribute sets attribute(s) to a subelement.
* @param { el } DOMElement the target-element of the attributes.
* @param { vl } Object the attributes to be set.
*/
se.soma.utils.view.RukaRenderer.prototype.addAttribute = function( el, vl ) {

  for(var x in vl) {
    switch(x) {
      case 'element':                                              break;
      case 'children':                                             break;
      case 'ref':                                                  break;
      case 'innerHTML': el.innerHTML = vl[x];                      break;
      case 'innerText': el.innerText = vl[x];                      break;
      case 'text': el.innerText = vl[x];                           break;
      case 'style': el.setAttribute(x,convertStyleObject(vl[x]));  break;
      case 'on':  for(var p in vl[x]) { el['on' + p] = vl[x][p]; } break;
      default: el.setAttribute(x.replace(/_/gi, '-'),vl[x]);
    }
  }

  function convertStyleObject( obj ) {
    var key, str = '';
    for(key in obj) { str += key.replace('_', '-') + ':' + obj[ key ] + ';'; }
    return str;
  }

};



/** @method setRef
* @desc                      setRef attaches a subelement to a property.
* @param { Array }       ref Array containing DOM-reference name and object.
* @param { String }      ref String containing DOM-reference name and object.
* @param { HTMLElement } el  The DOM to refer to.
*/
se.soma.utils.view.RukaRenderer.prototype.setRef = function( el, ref ) {
  switch(this.isSet(ref,0)) {
    case true: ref[0][ ref[1] ] = new se.soma.utils.view.RukaRenderer(el); break;
    default:   this[ ref ]      = new se.soma.utils.view.RukaRenderer(el);
  }
  return el;
};


/** @method getElements
* @desc
*/
se.soma.utils.view.RukaRenderer.prototype.each = function( children, func ) {
  
  children = typeof(children) == 'string' ? this.dom.get(children) : (children) ? children :this.dom.children;
  for(var i = 0, child; i < children.length; i++) {
    child = children[i];
    if(child.children.length > 0) {
      this.each(child.children, func);
    }
    func(child);
  }
};


/** @method getElements
* @desc                           getElements returns an array containing all child elements matching the selector.
* @param { String }         type  ...
* @param { String }         name  ...
* @param { HTMLCollection } elems ...
*/
se.soma.utils.view.RukaRenderer.prototype.getElements = function( type, name, elems ) {

      elems    = elems || this.dom.children;
  var results  = [],
      i;

  if(!elems[0]) return null;
  if(type[0] == '.') return this.domToArray(elems[0].parentNode.getElementsByClassName(type.slice(1)));
  if(type[0] == '#') return elems[0].parentNode.getElementById(type.slice(1));
  if(type[0] == '[') return elems[0].parentNode.querySelectorAll(type.slice(1, -1));
  for(i = 0; i < elems.length; i++) {

    if(elems[i].children.length > 0) {
      results.push(this.getElements(type,name,elems[i].children));
    }
    switch(type) {
      case 'tag': if(this.isTag(elems[i], name)) results.push(elems[i]); break;
      default: if(elems[i].hasAttribute(name)) results.push(elems[i]);
    }
  
  }
  
  return this.flatDOMList(results);

}


/** 
 * 
 * @method setChild
 * @desc   setChild is the main method for processing subelements and placing them in either
 *         the main-DOM of the object or in the calling element representation.
 *
 * @param  { Array }       domData Properties to be set to a subelement.
 * @prop   { HTMLElement } parent The main element in which subelements will be placed within.
 * @prop   { HTMLElement } frame  The document fragment.
 * @prop   { HTMLElement } elem   The current subelement.
 * @return { HTMLElement } The processed main element.
 */
se.soma.utils.view.RukaRenderer.prototype.setChild = function( domData, parent ) {

  var elem,
      parent = (parent && parent.nodeName) ? parent : this.dom, 
      frame  = document.createDocumentFragment();
      
  for (var i = 0, ch = domData[i][ 'element' ]; i < domData.length; i++) { 
    elem = typeof ch == 'string' ? document.createElement(ch) : ch;
    
    if(this.isSet(domData,i)) this.addAttribute(elem,domData[i]);
    frame.appendChild(elem);
    
    if(!domData[i][ 'ref' ]) continue;
    this.setRef(elem,domData[i][ 'ref' ]);
  }

  parent.appendChild(frame);

  return parent;

};


/** 
 * 
 * @method convertHTML
 * @desc   convertHTML converts DOM-elements into internal format.
 *
 * @param  { HTMLElement }  html Element to be converted.
 * @return { Object }       The internal object-representation of the Element.
 */
se.soma.utils.view.RukaRenderer.prototype.convertHTML = function( html, array ) {
  
  html = html || this.dom;
  
  var i = 0, copies = array ? [] : {};
  for(var copy, attrs; i < html.children.length; i++) {
    
    copy           = {};
    copy.element   = html.children[i].tagName.toLowerCase();

    attrs = html.children[i].getAttributeNames();
    if(attrs.length > 0) {
      attrs.forEach(function(attr) {
        if(attr == 'on') {
          copy['on']   = JSON.parse(html.children[i].getAttribute( attr ));
        } else {
          copy[ attr ] = html.children[i].getAttribute( attr ) || attr;
        }
      });
    }
    if(html.children[i].children.length > 0) {
      copy.children = se.soma.utils.view.RukaRenderer.prototype.convertHTML(html.children[i], array);
    } else {
      copy.text = html.children[i].innerHTML;
    }

    copies[i] = copy;

  }
  copies.length = i;

  return copies;
} 



/** 
 * 
 * @method printHTML
 * @desc   convertHTML converts DOM-elements into internal format.
 *
 * @param  { Object[, Array[Object]] } obj Data to be converted to HTML.
 * @param  { RukaRenderer } scope Currently running RukaRenderer.
 * @return { RukaRenderer } A RukaRenderer-instance representing the printed Object data.
 */
se.soma.utils.view.RukaRenderer.prototype.printHTML = function( obj, scope ) {
  scope = scope || this;
  
  for(var data in obj) {
    if(typeof obj[ data ] == 'object') {
      if(obj[ data ][ 'children' ]) {
        
        var elem = new se.soma.utils.view.RukaRenderer(obj[ data ][ 'element' ]);
        elem.printHTML(obj[ data ][ 'children' ], elem);
        obj[ data ][ 'element' ] = elem.dom;
        scope.setChild(new Array(obj[ data ]));
        if(scope[obj[0]['ref']]) scope[obj[0]['ref']] = elem;
        
      } else scope.setChild(new Array(obj[ data ]));    
    }
  }

  return scope;
}