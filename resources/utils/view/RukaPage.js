//--------------------------------------------------------------------------
// Public class RukaPage
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

//----------------------------------------------------------------------
// Anonymous scope
//----------------------------------------------------------------------
(function() {

      
  //----------------------------------------------------------------------
  // Strict mode
  //----------------------------------------------------------------------

  "use strict";

    
  //----------------------------------------------------------------------
  // CLASS
  //----------------------------------------------------------------------

  se.soma.utils.view.RukaPage = (function( layers, settings ) {

      
    //----------------------------------------------------------------------
    // Super
    //----------------------------------------------------------------------

    RukaRenderer.call(this, document.body);


    //----------------------------------------------------------------------
    // Private properies
    //----------------------------------------------------------------------

    var m_this        = this;
    
    prevent           = false;

    scrollDelay       = 1500;

    pageCacheSize     = 5;


    //----------------------------------------------------------------------
    // Public properies
    //----------------------------------------------------------------------
    
    this.page         = 0;

    this.activePage   = null;

    this.origin       = window.pageYOffset;

    this.offset       = null;
    
    this.direction    = false;

    this.orientation  = settings.getAttribute('orientation') || 'horizontal';

    this.margin       = 2;

    this.layers       = toArray(layers) || toArray(document.getElementsByClassName('page-wrapper'));

    this.length       = this.layers.length;

    this.innerLength  = this.length - 1;

    this.parent       = (this.layers[0]) ? this.layers[0].parentNode : this.dom;

    this.id           = this.parent.id;

    this.settingsTag  = settings ? settings.cloneNode(true) : null;

    this.settings     = {};

    this.fullscreen   = false;

    this.autoTimer    = settings.getAttribute('timer') || 5000;
    
    this.scrollTimer  = null;

    this.scrollBar    = null;

    this.breakpoint   = this.layers[0].clientHeight || 500;

    this.scrolling    = false;

    this.calls        = 0;

    this.loader       = document.getElementsByClassName('loader')[0] || initLoader.call(this);
    
    this.prevBtn      = document.getElementById(settings.getAttribute('previous')) || false;
          
    this.nextBtn      = document.getElementById(settings.getAttribute('next')) || false;
      
    this.eventEnded   = false,

    this.pageEvents   = RukaEvents.addAll(layers),

    this.eventData    = {};

    this.mode         = settings.getAttribute('mode') || this.modes.scroll;

    this.modes        = {

      get scroll() {
        return 'scroll';
      },

      get button() {
        return 'button';
      },

      get timer() {
        return 'timer';
      },

      get touch() {
        return 'touch';
      }

    };

    /** Prototype binding */
    this.manualUpdateInterface = this.manualUpdateInterface.bind(this);

      
    //----------------------------------------------------------------------
    // Bootstrap
    //----------------------------------------------------------------------
    
    function init() {

      initGlobalSettings.call(m_this);
      
      initPageWrappers.call(m_this);
      
      initContent.call(m_this);
      
      initInterface.call(m_this);

      initScrollBar.call(m_this);

    }

    if(this.settings != null) init();

    return this;

  });
  se.soma.utils.view.RukaPage.prototype = Object.create(se.soma.utils.view.RukaRenderer.prototype);
  se.soma.utils.view.RukaPage.prototype.constructor = se.soma.utils.view.RukaPage;




  //----------------------------------------------------------------------
  // PROTOTYPES
  //----------------------------------------------------------------------

  se.soma.utils.view.RukaPage.prototype.autoUpdateInterface = function( dir ) {
    this.offset = window.pageYOffset;
  
    if(this.scrolling == true || this.calls > 0) {
      if(this.mode != this.modes.scroll) return;
      window.scrollTo(0, this.margin);
      return;
    }
    
    this.scrolling = true;
    this.eventEnded = false;
    
    if(this.mode == this.modes.scroll) {
      window.scrollTo(0, this.margin); 
    }
    
    this.loader.classList.remove('inactive');

    switch(this.mode) {
      case this.modes.scroll: updateScrollDirection.call(this); break;
      case this.modes.timer : updatePageDirection.call(this);   break;
      case this.modes.button: this.direction = !!dir; break;
    }

    //console.log('autoUpdateInterface', this, dir);
    updatePages.call(this);
    return this.page;
    
  };

  se.soma.utils.view.RukaPage.prototype.manualUpdateInterface = function( page ) {
  //console.log('manualUpdateInterface', this, page);
    rearrangeLayers.call(this, page);
    this.direction = (page < this.page) ? false : true;
    this.page = (this.direction) ? page - 1 : page + 1;
    updatePages.call(this);
    
  };

  se.soma.utils.view.RukaPage.prototype.touchUpdateInterface = function( e, dir ) {

    if(!dir || dir.orientation != this.orientation) return;

//console.log('touchUpdateInterface', this)
    this.eventData.touch = dir;
    this.direction       = dir.isNext;
    this.offset   = dir.offset;
    this.origin   = dir.origin;
    
//console.log('dir', dir, Math.abs(this.offset));
    
    if(Math.abs(this.offset) < 30) return;
    if(this.mode != this.modes.scroll) {
      var d = this.direction ? 1 : -1;
      this.manualUpdateInterface(this.page + d)
    } else {
      updatePages.call(this);
    }
    this.eventData = {}; // ok?
  };

  se.soma.utils.view.RukaPage.prototype.resetUI = function() {

    for(var i = 1; i < this.layers.length; i++) {
      this.activePage = this.layers[i];
      activate.call(this);
    }

  };

  se.soma.utils.view.RukaPage.prototype.addSettings = function( prop ) {
    if(!prop) return;
    for(var p in prop) {
      this.settings[p] = prop[p];
    }
  };

  se.soma.utils.view.RukaPage.prototype.updateSettings = function() {
    initGlobalSettings.call(this);
    initPageWrappers.call(this);
    initInterface.call(this);
    initScrollBar.call(this);
  };



  //----------------------------------------------------------------------
  // UTILS
  //----------------------------------------------------------------------

  //----------------------------------------------------------------------
  // Private variables
  //----------------------------------------------------------------------
  var prevent             = null,

      scrollDelay         = null,

      pageCacheSize       = null;


  //----------------------------------------------------------------------
  // Private functions
  //----------------------------------------------------------------------

  function initGlobalSettings() {

    var transition;  	  
    
    if(this.settingsTag.getAttribute('transitions') != 'custom') {
      transition = new RukaTransitions(this.settingsTag.getAttribute('transitions'));      
    } else {
      transition = {
        intro: this.settingsTag.getAttribute('intro'),
        outro: this.settingsTag.getAttribute('outro')
      };
      if(this.settingsTag.hasAttribute('outro2')) {
        transition['outro2'] = this.settingsTag.getAttribute('outro2');
      }
    }

    if(this.settingsTag.hasAttribute('noloader')) this.loader.classList.add('hide');

    prevent       = transition.prevent || this.settingsTag.hasAttribute('prevent') || false;

    scrollDelay   = (this.mode == this.modes.button) ? 300 : (prevent) ? 1100 : 1300;

    pageCacheSize = Number(this.settingsTag.getAttribute('preload')) || pageCacheSize;

    this.settings.transition    = transition;

    this.settings.scrollDelay   = scrollDelay;
    
    this.settings.pageCacheSize = pageCacheSize;

    //console.log('this.settings', this.settings.transition);

  }


  function initPageWrappers() {
    
    for(var i = 0; i < this.layers.length; i++) {
      initEventListeners.call(this, this.layers[i]);
      
      if(this.settingsTag) {
        initPageSettings.call(this, this.layers[i]);
      }
    }

  }
  
  function initEventListeners( layer ) {

    if(typeof layer != 'object') return;
    var _callback = endScroll.bind(this, layer);
    layer.addEventListener('transitionend', _callback);

  }
  
  function initPageSettings( layer ) {

    var attr = this.settingsTag.attributes;

    for(var i = 0; i < attr.length; i++) {
      layer.style[ attr[ i ].nodeName ] = attr[ i ].nodeValue;
    }
    return layer;

  }
  
  function initLoader() {

    this.setChild([{
      element: 'div',
      class: 'loader',
      ref: 'loader'
    }]);

    if(this.settingsTag.hasAttribute('noloader')) {
      this.loader.dom.classList.add('hide');
    }

    return this.loader.dom;

  }

  function initContent() {
    
    var list = this.flatDOMList(this.getElements('tag', 'img'));

    for(var i = 0, j, src, ats, cls, img, div; i < list.length; i++) {
      img = list[i];
      src = img.src;
      ats = img.attributes;
      cls = img.className;
      div = document.createElement('div');
      for(j = 0; j < ats.length; div.setAttribute(ats[j].name, ats[j++].value));
      img.parentNode.replaceChild(div, img);
      div.className = cls + ' image-div';
      div.style.backgroundImage = 'url(' + src + ')';
    }

  }

  function initInterface() {

    var _this = this;
    
    for(var i = 1; i < this.layers.length; i++) {
      this.activePage = this.layers[i];
      inactivate.call(this);
    }
    this.activePage = this.layers[0];
    hideDistanceLayers.call(this);
    setTimeout(function(){activate.call(_this);}, 50);

  }

  function initScrollBar() {
        
    var scrollBar  = document.get('[data-scroll-bar="' + this.id + '"]')[0] || null,
        layers     = this.layers,
        labels     = layers.reduce(function(curr, next) { 
                        var t = next.getAttribute('title') || ''; 
                        curr.push(t);
                        return curr;
                      },[]);

    if(scrollBar == null) return;

    var  scrollBar = new ScrollBar({ parent: scrollBar, length: layers.length, labels: labels });
    this.scrollBar = scrollBar;
    this.scrollBar.setHandler(this.manualUpdateInterface);
    this.scrollBar.updateScrollBar(this.activePage);
    this.addSettings({ scrollBar: this.scrollBar });
    // //console.log('initscrollBar > ' + this.id, scrollBar)
    
  }

  function updateScrollDirection() {

    if(this.offset < this.origin) {
      this.direction = false;
    } else {
      this.direction = true;
    }

  }

  function updatePageDirection() {

    if(this.page < 0) this.page = 0;

    if(this.page == this.innerLength) {
      this.direction = false;
    }
    if(this.page == 0) {
      this.direction = true;
    }

  }

  function updatePages() {

    var data = {};
    clearPages.call(this);
    data.previousPage   = this.activePage;
    data.previousPageNr = this.page;
    
    updatePage.call(this);

    data.nextPage   = this.activePage;
    data.nextPageNr = this.page;
    this.eventData['pageChangeEvent'] = data;
    if(this.scrollBar)
      this.scrollBar.updateScrollBar(this.page);
    resetPages.call(this);
    //console.log('updatePages', data)
    
  }

  function updatePage() {
    if(this.direction) {
      this.page += Number(this.page < this.innerLength);
      updateControls.call(this, this.page < this.innerLength, 1);
    } else if(!this.direction) {
      this.page -= Number(this.page > 0);
      updateControls.call(this, this.page > 0);
    }      
    this.activePage = this.layers[ this.page ];
  }

  function clearPages() {
    setScrollReboot.call(this);
    this.calls++;
    inactivate.call(this);
  }

  function resetPages() {
    var _this = this;
    hideDistanceLayers.call(this);
    onPageChangeEvent.call(this);
    setTimeout(function(){activate.call(_this);}, 50);
  }

  function hideDistanceLayers() {
    var _pageCacheSize = this.settings.pageCacheSize;
    for(var i = 0; i < this.layers.length; i++) {
      if(i < this.page - _pageCacheSize || i > this.page + _pageCacheSize) {
        this.layers[i].classList.add('hide');
        continue;
      }
      this.layers[i].classList.remove('hide');
    }
  }

  function onPageChangeEvent() {
    //this.pageEvents.pagechange(this.eventData);
    if(this.settings.scrollBar) {
      this.settings.scrollBar.updateScrollBar(this.page);
    }
    this.eventData = {};
  }

  function rearrangeLayers( page ) {
    var transition = this.settings.transition;
    for(var i = 0; i < this.layers.length; i++) {
      if(i < page) {
        this.layers[i].classList.remove(transition.outro2);
        this.layers[i].classList.add(transition.outro);
        for(var j = 0; j < this.layers[i].children.length; j++) {
          this.layers[i].children[j].classList.remove(transition.outro2);
          this.layers[i].children[j].classList.add(transition.outro);
        }
      } else if(i > page) {
        this.layers[i].classList.remove(transition.outro);
        this.layers[i].classList.add(transition.outro2);
        for(var j = 0; j < this.layers[i].children.length; j++) {
          this.layers[i].children[j].classList.remove(transition.outro);
          this.layers[i].children[j].classList.add(transition.outro2);
        }
      }
    }
  }
  
  function activate() {
    var transition = this.settings.transition;
    this.activePage.classList.remove(transition.outro);
    this.activePage.classList.remove(transition.outro2);
    this.activePage.classList.remove(transition.intro);
    //this.activePage.activate();
    
    if(this.activePage.hasAttribute('background')) {
      (this.mode == this.modes.scroll) 
      ? this.dom.setAttribute('style', 'background:' + this.activePage.getAttribute('background'))
      : this.parent.setAttribute('style', 'background:' + this.activePage.getAttribute('background'));
    } // else this.parent.style.background = '#000';
  
    if(transition.prevent === true) return;

    /* ANIMATE CHILDREN */
    for(var i = 0; i < this.activePage.children.length; i++) {
      this.activePage.children[i].classList.remove(transition.outro);
      this.activePage.children[i].classList.remove(transition.outro2);
      this.activePage.children[i].classList.remove(transition.intro);
      
      if (this.activePage.children[i].classList.contains('arrow')) continue;
      this.activePage.children[i].classList.remove('inactive');
    }
    
  }
  
  function inactivate() {
    var transition = this.settings.transition;
    var out = (this.direction == true) ? transition.outro : transition.outro2;

    this.activePage.classList.add(transition.intro);
    this.activePage.classList.add(out);
    //this.activePage.inactivate();

    if(transition.prevent === true) return;

    /* ANIMATE CHILDREN */
    for(var i = 0; i < this.activePage.children.length; i++) {
      this.activePage.children[i].classList.add(transition.intro);
      this.activePage.children[i].classList.add(out);
      
      if (this.activePage.children[i].classList.contains('arrow')) continue;
      this.activePage.children[i].classList.add('inactive');
    }
    
  }

  function setScrollReboot() {

    if(this.scrollTimer != null) return;
    var _this = this;
    this.loader.classList.remove('inactive');

    if(this.settingsTag.hasAttribute('noloader')) {
      this.loader.classList.add('hide');
    } else {
      this.loader.classList.remove('hide');
    } 

    this.scrollTimer = setTimeout(function(){
      _this.loader.classList.add('inactive');
      _this.scrolling   = false;
      _this.eventEnded  = true;
      _this.scrollTimer = null;
      _this.calls       = 0;
    }, _this.settings.scrollDelay);

  }

  function endScroll( layer ) {

    if(this.mode == this.modes.scroll) {
      window.scrollTo(0, this.margin);
    }
    
    if(this.eventEnded == true) return;
    
    this.loader.classList.add('inactive');
    this.scrolling = false;
    this.eventEnded = true;

    layer.removeEventListener('transitionend', endScroll);
    
  }

  function updateControls( status, ctrl ) {
    
    if(!this.nextBtn) return;

    var control1 = (ctrl) ? this.nextBtn : this.prevBtn;
    var control2 = (control1 == this.prevBtn) ? this.nextBtn : this.prevBtn;

    if(this.length <= 1) {
      control1.classList.add('inactive');
      control2.classList.add('inactive');
      return;
    } else if(status == true) {
      control1.classList.remove('inactive');
    } else {
      control1.classList.add('inactive');
    }
    control2.classList.remove('inactive');

  }

  function toArray( obj ) {
    if(!obj) return null;

    var arr = [];
    for(var prop in obj) {
      if(typeof obj[ prop ] == 'object') arr.push(obj[ prop ]);
    }
    return arr;

  }
  
})();