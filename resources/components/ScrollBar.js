//--------------------------------------------------------------------------
// Public class
//--------------------------------------------------------------------------

/**
 *  Represents a scrollbar on a UI.
 *
 *  @version    0.8
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.components.ScrollBar = (function( settings, hold ) {
    
      //----------------------------------------------------------------------
      // Strict mode
      //----------------------------------------------------------------------
    
      "use strict";


        //----------------------------------------------------------------------
        // Private scope
        //----------------------------------------------------------------------
        var m_this = this,

            parent = settings.parent,

            length = settings.length || 1,

            margin = document.body.getBoundingClientRect().height / (length + 1),

            labels = settings.labels || [],

            titles = settings.titles || [];


        function load() {

          var scrollBar    = new RukaRenderer(parent);

          function setIxHandler( ix ) {
            return function() { console.log('click scrollBar', scrollBar, ix); scrollBar['outer' + ix].dom.click(); }
          }

          for(var i = 0, j = 0; i < length; i++) {
            labels[i] = labels[i] || '';
            scrollBar.printHTML([
              {
                element: 'div',
                class: 'outer',
                ref: 'outer' + i,
                children: [
                  {
                    element: 'div',
                    class: 'inner vertical',
                    ref: 'innerV' + i,
                    on: {
                      click: setIxHandler(i)
                    } 
                  },
                  {
                    element: 'div',
                    class: 'inner horizontal',
                    ref: 'innerH' + i,
                    children: [
                      {
                        element:'span',
                        ref: 'label' + i,
                        innerText: labels[i] || '',
                        title: titles[i] || '',
                        on: {
                          click: setIxHandler(i)
                        }
                      }
                    ],
                    on: {
                      click: setIxHandler(i)
                    }
                  }
                ]
              }
              // {
              //   element: 'div',
              //   class: 'label',
              //   innerText: labels[i],
              //   ref: 'label' + j++ 
              // }
            ]);

            var offsetY = (margin * (i + 1)) - (scrollBar['outer' + i].dom.offsetWidth) + 'px';
            scrollBar['outer' + i].dom.style.top = offsetY;
            //scrollBar['label' + i].dom.style.top = offsetY;

          }

          m_this.bar  = scrollBar;
          m_this.dom  = scrollBar.dom;
          var markings = scrollBar.dom.getElementsByClassName('outer');
          for(var i = 0; i < markings.length; m_this.markings.push(markings[i++]));

        }


        //----------------------------------------------------------------------
        // Public scope
        //----------------------------------------------------------------------

        this.dom      = null;

        this.bar      = null;

        this.markings = [];

        this.handler  = null;

        
        this.init = load;

        this.setHandler = function( handler ) {

          for(var i = 0; i < m_this.markings.length; i++) {
            m_this.markings[i].addEventListener('click', function(e) {
              e.stopPropagation();
              var page = m_this.markings.indexOf(this);
              handler(page);
            });
          }

        };

        this.addLabels = function( labels ) {

          var i = 0, label;
          console.log('addLabels', this.bar, labels);
          while(this.bar['outer' + i] && labels[i]) {
            label = this.bar['outer' + i]['innerV' + i]['label' + i].dom;
            label.innerText = labels[i++];
          };

        };

        this.updateScrollBar = function( page ) {
          
          var _marking = m_this.markings[page];

          m_this.markings.map(function( marking ) {
            marking.classList.remove('active-outer');
            marking.getElementsByClassName('vertical')[0].classList.remove('active-vertical');
            marking.getElementsByClassName('horizontal')[0].classList.remove('active-horizontal');
          });

          if(!_marking) return;
          
          _marking.classList.add('active-outer');
          _marking.getElementsByClassName('vertical')[0].classList.add('active-vertical');
          _marking.getElementsByClassName('horizontal')[0].classList.add('active-horizontal');
          
        };
     

      if(!hold) load();

});