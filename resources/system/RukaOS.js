
(function() {

  window.se.soma.system.RukaOS = {};

  var _functions = {};

  var _templates;

  function ajax(url, callback) {
      
    var request;

    if(XMLHttpRequest){
        request = new XMLHttpRequest();
    } else if (ActiveXObject){
        request = new ActiveXObject("Microsoft.XMLHTTP");
    } else{
        throw new Error('Fatal Error: Missing support for AJAX request.');
    }

    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if(callback) {
          try {
            callback(JSON.parse(this.responseText));
          } catch(err) {
            callback(this);
          }
        }
      }
    };

    request.open('GET', url, true);
    request.send();

    return {
      then: function(f) { callback = f; }
    };
  
  }

  function loadTemplates( resp ) {
    _templates = resp.templates.reduce(function(copy, obj) { if(obj.name) copy[obj.name] = obj.url; return copy; }, {});
    resp.templates.map(function(data) { ajax(data.url).then(function(temp) {
      _templates[data.name] = temp.responseText;
    }); })
  }

  function loadFunctions( elem ) {
    if(elem.children) {
      if(elem.children.map) elem.children.map(loadFunctions)
      else elem.children.toArray().map(loadFunctions);
    }
    if(elem.on) {
      for(event in elem.on) {
        if(typeof(elem.on[event]) == 'string') {
          elem.on[event] = _functions[elem.on[event]];
        }
      }
    }
  }

  ajax(location.href + '/../../templates.json', loadTemplates)

  Object.defineProperties(window.se.soma.system.RukaOS, {

    templates: {
      get() {
        return {
          get all() {
            return JSON.parse(JSON.stringify(_templates));
          },
          get: function( temp ) {
            return _templates[temp];
          },
          set: function( name, data ) {
            if(!_templates[name])
              throw new Error('Template "' + name + '" does not exist.');

            var html = _templates[name],
                wrap = document.get('ruka-page')[0],
                head = html.split('</page-settings>')[1].split('<ruka-page>')[0],
                body = html.split('<ruka-page>')[1].split('</ruka-page>')[0],
                foot = html.split('</ruka-page>')[1],
                temp = head,
                copy = document.createElement('div'),
                page = null,
                ruka = new RukaRenderer(wrap);

            var bCopy;
            data.map(function(content, ix) {
              bCopy = body.slice(0);
              for(prop in content) {
                bCopy = bCopy.split('#{' + prop + '}').join(content[prop]);
                if(bCopy.split(':"' + prop + '"').length > 1 && ix == 0) {
                  _functions[prop] = content[prop];
                }
              }
              temp += bCopy;
            });
            temp += foot;
            copy.innerHTML += temp;
            page = ruka.convertHTML(copy, true);
            page.map(loadFunctions)
            ruka.printHTML(page);
            //console.log('Convertion: ', ruka, copy, page);
            _functions = {};
          }
        };
      }
    }

  });

})();