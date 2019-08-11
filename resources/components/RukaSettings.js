//--------------------------------------------------------------------------
// Public class
//--------------------------------------------------------------------------

/**
 *  Represents the settings of a RukaPage-UI.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 *  @return { Object }
 */
se.soma.media.components.RukaSettings = (function( _ui, _ix ) {
    
    //----------------------------------------------------------------------
    // Strict mode
    //----------------------------------------------------------------------
  
    "use strict";


    
    //----------------------------------------------------------------------
    // Private scope
    //----------------------------------------------------------------------

    _ui = _ui || new RukaPage();

    _ix = _ix || 0;


var _settings    = _ui.settings || document.getElementsByTagName('global-settings')[_ix],

    _initial     = _settings.cloneNode(),

    _permissions = document.getElementsByTagName('custom-settings')[_ix],

    _added       = [],

    _updated     = [],

    _this        = this;


    function updateSettingList( list, name, remove ) {
        
        var i = list.indexOf(name); 

        if(remove) {
            if(i < 0) return;
            list.splice(i, 1);
        } else {
            if(i < 0) list.push(name);
        }
    }
    
    //----------------------------------------------------------------------
    // Public scope
    //----------------------------------------------------------------------

    

    this.addSetting    = function( name, value ) {
        
        if(_this.permissions.indexOf(name) < 0) return false;

        _settings.setAttribute(name, value);
        updateSettingList(_added, name);
        return true;

    };

    this.removeSetting = function( name ) {
        
        if(_this.permissions.indexOf(name) < 0) return false;
        
        _settings.removeAttribute(name);
        updateSettingList(_added, name);
        return true;
    
    };

    this.reset  = function( name ) {

        if(name && _this.permissions.indexOf(name) < 0) return false;

        _this.ui.resetUI();

        if( name ) {
            _settings.setAttribute(name, _initial.getAttribute(name));
            updateSettingList(_added, name, true);
            updateSettingList(_updated, name, true);
        } else {
            _settings = _initial.cloneNode();
            _added.map(function(n) {
                updateSettingList(_added, p, true);
                updateSettingList(_updated, p, true);
            });
        }
        _this.ui.updateSettings();

    };

    this.updateSetting = function( name, value ) {
        
        if(_this.permissions.indexOf(name) < 0) return false;

        _this.ui.resetUI();
        value = value || _settings.getAttribute(name);
        _this.ui.settings.setAttribute(name, value);
        updateSettingList(_added, name, true);
        updateSettingList(_updated, name);
        _this.ui.updateSettings();

        return true;

    };

    this.updateAll = function() {
        _this.ui.resetUI();
        for(var prop in _this.settings) {
            _this.ui.settings.setAttribute(prop, _this.settings[prop]);
            updateSettingList(_added, prop, true);
            updateSettingList(_updated, prop);
        }
        _this.ui.updateSettings();
    };



    Object.defineProperties(this, { 

        ui: { get: function() { return _ui; } },

        ix: { get: function() { return _ix; } },

        initial: { 

            get: function() { 

                var _attr = _initial.attributes, sett = {}, i = 0, prop;

                for(; i < _attr.length; prop = _attr.item(i++), sett[prop.name] = prop.value);

                return sett;
        
            }

        },

        permissions: { 
        
            get: function() { 
            
                var _attr = _permissions.attributes, perm = [], i = 0;

                for(; i < _attr.length; perm.push(_attr.item(i++).name));

                return perm;

            } 
        
        },

        settings: { 
       
            get: function() { 

                var _attr = _settings.attributes, sett = {}, i = 0, prop;

                for(; i < _attr.length; prop = _attr.item(i++), sett[prop.name] = prop.value);

                return sett; 
            
            },

            set: function( s ) { 

                _this.ui.resetUI();

                _settings = s; 
            
                _this.ui.updateSettings();

            }
       
        },

        added: {

            get: function() {
                return _added;
            }

        },

        updated: {
            get: function() {
                return _updated;
            } 
        }

    });

    return this;

});