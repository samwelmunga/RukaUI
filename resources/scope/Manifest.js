//--------------------------------------------------------------------------
// Public class Manifest
//--------------------------------------------------------------------------


if (window.se == undefined) window.se = {};
if (window.se.soma == undefined) window.se.soma = {};
if (window.se.soma.media == undefined) window.se.soma.media = {};


/**
 *  Framework package
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga88@hotmail.se>
 */
se.soma.media = (function() {

//--------------------------------------------------------------------------
// Public scope
//--------------------------------------------------------------------------

    /**
     *  The object represents the frameworks's package structure, with
     *  associated classes.
     *
     *  @type {Object}
     */
    var _this = {};

    /*-----------------------------------------------------
    ||||||||||||||||||	VERSION 	|||||||||||||||||||
    -------------------------------------------------------*/

    /**
     *  Current version running
     *
     *  @type {String}
     */
    _this.version = "1.3.5";

    /*-----------------------------------------------------
    |||||||||||||||||	PACKAGE STRUCTURE 	|||||||||||||||||
    -------------------------------------------------------*/

    /**
     *  Package structure for component related classes
     *
     *  @type {Object}
     */
    _this.components = {};

    /**
     *  Package structure for scope related classes
     *
     *  @type {Object}
     */
    _this.scope = {};

    /**
     *  Package structure for system related classes
     *
     *  @type {Object}
     */
    _this.system = {};
    
    /**
     *  Package structure for user interface related classes
     *
     *  @type {Object}
     */
    _this.utils = {};

    /**
     *  Package structure for view related classes
     *
     *  @type {Object}
     */
    _this.utils.view = {};


    /**
     *  The entire package as an JavaScript object.
     */
    return _this;

})();
