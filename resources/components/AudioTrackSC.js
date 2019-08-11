//--------------------------------------------------------------------------
// Public class AudioTrack
//--------------------------------------------------------------------------

/**
 *  Creates an instance representing a audioplayer.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 */
se.soma.media.components.AudioTrack = (function( obj, parent, autoplay ) {

    RukaRenderer.call(this, 'div');


    /**
     * PRIVATE PROPERTIES
     */

    var m_this    = this,
        source    = obj.audio,
        title     = obj.title,
        client_id = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF',
        playIcon  = 'fa-play',
        pauseIcon = 'fa-pause',
        errorIcon = 'fa-exclamation-circle',
        loadIcon  = 'fa-spinner',
        soundIcon = 'fa-volume-up',
        muteIcon  = 'fa-volume-off',
        playState = 'updatePlayback',
        btns = {},
	    pBtn = newBtn(playIcon, play),
        mBtn = newBtn(soundIcon, muted),
        ranges   = {},
	    pBRange  = newRange('seeker'),
        sndRange = newRange('volume'),
        volume   = 0.5,
        seekJump = 30,
        active   = false,
        initCall = [],
        endCall  = null
        inactive = null;


    /**
     * PUBLIC METHODS
     */

    this.append = function() {
        parent.appendChild(m_this.dom);
    };

    this.remove = function() {
        plPs(false);
        if(!parent) return;
        
        try {
            parent.removeChild(m_this.dom);
        } catch(err) {
            console.warn('Failed to remove AudioTrack[' + title + ']: ' + err);
        }
    }
    
    this.getPlayButton = function() {
        return m_this.updateButtonState.call(newBtn(playIcon, play));
    };

    this.getSoundButton = function() {
        return updateSoundState.call(newBtn(soundIcon, muted));
    };

    this.getTimeTable = function() {
        var table = document.createElement('span'),
            func  = updateTimeTable.bind(table);
        m_this.dom.add(playState, func);
        return table;
    };

    this.play = function( state ) {
        if(initCall) {
            //console.log('onPlaybackStarted', initCall, m_this);
            initCall.map(function( f ) { f(m_this); });
        }
        navigator.vibrate(20);
        plPs(state);
    };

    this.pause = function() {
        m_this.player.dom.pause();
    };

    this.reload = function() {
        m_this.player.dom.load();
        m_this.playbackRange.dom.value = 0;
        plPs(false);
    };

    this.seek = function( time ) {
        if(isNaN(parseInt(time))) return console.warn('Given time is NaN');
        var val = m_this.playbackRange.dom.value + time;
        m_this.playbackRange.dom.value = (val > 100) ? 100 : (val < 0) ? 0 : val;
        skVid();
    };

    this.loop = function( bool ) {
        return m_this.player.dom.loop = bool || !m_this.player.dom.loop;
    };

    this.beforePlaybackStart = function( fun ) {
        initCall.push(fun);
    };

    this.onPlaybackPaused = function( fun ) {
        holdCall = fun;
    };

    this.onPlaybackFinish = function( fun ) {
        endCall = fun;
    };

    this.load = function( src ) {
        m_this.player.dom.src = src || source;
        m_this.player.dom.load();
    };

    this.unload = function() {
        m_this.load(null);
    };

    this.updateButtonState = function( state ) {
        
        var el;
        if(state) {
            el = pBtn;
        } else {
            el = this;
        }

        el.classList.remove(playIcon);
        el.classList.remove(pauseIcon);
        el.classList.remove(loadIcon);
        el.classList.remove(errorIcon);

        if(state == 'loading') {
            el.classList.add(loadIcon);
        } else if(state == 'playing') {
            el.classList.add(pauseIcon);
        } else if(state == 'error') {
            el.classList.add(errorIcon);
        } else {
            el.classList.add(playIcon);
        }

        return el;

    };

    this.updateAllButtonsState = function( state ) {
        
        var buttons = btns[playIcon] || [];
        state = state || 'ended';
        console.log('updateAllButtonsState', state, buttons);
        
        buttons.map(function(button) {
            button.classList.remove(playIcon);
            button.classList.remove(pauseIcon);
            button.classList.remove(loadIcon);
            button.classList.remove(errorIcon);
        });

        if(state == 'loading') {
            buttons.map(function(button) {
                if(!button.classList.contains(loadIcon)) {
                    button.classList.add(loadIcon);
                }
            });
        } else if(state == 'playing') {
            buttons.map(function(button) {
                if(!button.classList.contains(pauseIcon)) {
                    button.classList.add(pauseIcon);
                }
            });
        } else if(state == 'error') {
            buttons.map(function(button) {
                if(!button.classList.contains(errorIcon)) {
                    button.classList.add(errorIcon);
                }
            });
        } else {
            buttons.map(function(button) {
                if(!button.classList.contains(playIcon)) {
                    button.classList.add(playIcon);
                }
            });
        }

        return state;
    };

    Object.defineProperties(this, {
        loaded: {
            get: function() {
                return !!m_this.track;
            }
        },
        playing: {
            get: function() {
                if(!m_this.track) return false;
                return m_this.track.getState() == 'playing';
            }
        },
        paused: {
            get: function() {
                if(!m_this.track) return false;
                return m_this.track.getState() == 'paused';
            }
        },
        ended: {
            get: function() {
                if(!m_this.track) return false;
                return m_this.track.getState() == 'ended';
            }
        },
        elapsed: {
            get: function() {
                return Math.round(m_this.player.dom.currentTime);
            }
        },
        duration: {
            get: function() {
                return Math.round(m_this.player.dom.duration);
            }
        },
        title: {
            get: function() {
                return title;
            }
        },
    });

    /**
     * PRIVATE METHODS
     */

    function initTrack() {

        SC.initialize({
            client_id: client_id
        });
        console.log('SC', SC)

        SC.stream('/tracks/' + m_this.player.dom.id)
            .then(function(track) { 
                m_this.track = track;
                m_this.track.on('state-change', m_this.updateAllButtonsState); 
            })
            .then(plPs);

    }

    function newBtn( icon, callback ) {
        var btn = document.createElement('i');
        btn.classList.add('fa', icon);
        btn.add('click', callback);
        if(!btns[icon]) btns[icon] = [];
        btns[icon].push(btn);
        return btn;
    }

    function newRange( name ) {
        var range = document.createElement('input');
        range.type = 'range';
        range.min = '0';
        range.max = '100';
        range.value = '0';
        range.step = '1';
        range.id = name;
        if(!ranges[name]) ranges[name] = [];
        ranges[name].push(range);
        return range;
    }

    function play( state ) {
        m_this.play(state);
    }

    function plPs( state ) {
        
        if(!SC) throw new Error('SC wasn\'t found.');   
        if(parent && !parent.contains(m_this.dom)) m_this.append();     
        

        if(!m_this.track) {
            initTrack();
            return;
        }

        if (!m_this.track.isPlaying() && state !== false) {
            m_this.track.play();
        } else {
            m_this.track.pause();
        }

    }
    
    function muted() {

        var buttons = btns[soundIcon];

        if(RukaUI.isMobile()) {
            return m_this.soundRange.dom.classList.toggle('inactive');
        }

        if (m_this.player.dom.muted) {
            m_this.player.dom.muted = false;
            m_this.soundRange.dom.value = volume * 100;
            for(var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove(muteIcon);
                buttons[i].classList.add(soundIcon);
            }
        } else {
            m_this.player.dom.muted = true;
            for(var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove(soundIcon);
                buttons[i].classList.add(muteIcon);
            }
        }
    }

    function updateTimeTable( e ) {
        var duration = convertTime(m_this.track.getDuration() / 1000),
            elapsed  = convertTime(m_this.track.currentTime / 1000);
        var time = elapsed + '/' + duration;
        if(this.innerHTML != time) this.innerHTML = time;
        return time;
    }

    function convertTime( num ) {
        var time = new Date(null), res;
        time.setSeconds(num); 
        res = time.toISOString().substr(11, 8);
        if(res.slice(0, 2) == '00') {
            res = res.slice(3);
        }
        return res;
    }

    function updateSoundState() {
        
        if (m_this.player.dom.muted) {
            this.dom.classList.remove(muteIcon);
            this.classList.add(soundIcon);
        } else {
            this.classList.remove(soundIcon);
            this.classList.add(muteIcon);
        }
        return this;

    }
    
    function skVid( time ) {
        time = (typeof(time) == 'number') ? time : 0;
        var cur = m_this.player.dom.duration * (m_this.playbackRange.dom.value / 100);
        m_this.player.dom.currentTime = cur + time;
        m_this.playbackRange.dom.value = (m_this.player.dom.currentTime / m_this.player.dom.duration) * 100;
    }
    
    function setSound() {
        volume = m_this.soundRange.dom.value / 100;
        m_this.player.dom.volume = volume;
        if(volume == 0 && m_this.player.dom.muted == false
            || volume > 0 && m_this.player.dom.muted == true) muted();
    }

    this.printHTML([
        {
            element: 'audio',
            ref: 'player',
            class: 'audio-tag',
            volume: 0.5,
            id: obj.audio,
            type: obj.mime,
            preload: 'metadata',
            on: { 
                click: function(){pBtn.click();},
                contextmenu: function(e){e.preventDefault();}
            }
        },
        {
            element: 'span',
            ref: 'title',
            class: 'meta audio-title',
            innerText: title
        },
        {
            element: 'div',
            class: 'play-button',
            ref: 'playButton'
        },
        {
            element: pBRange,
            ref: 'playbackRange',
            value: 0,
            on: { change: skVid }
        },
        {
            element: mBtn,
            id: 'volume-btn',
            ref: 'muteBtn'
        },
        {
            element: sndRange,
            class: function() { return RukaUI.isMobile() ? 'inactive' : ''; }(),
            ref: 'soundRange',
            value: 50,
            on: { change: setSound }
        },
        {
            element: 'div',
            class: 'main-controls',
            ref: 'mainControls'
        }
    ]);

    this.playButton.printHTML([
        {
            element: pBtn,
            id: 'play-btn',
            ref: 'playBtn'
        }
    ]);

    this.mainControls.printHTML([
        {
            element: 'i',
            aria_hidden: 'true',
            class: 'fa fa-repeat skip-backward',
            style: {
                transform: 'rotateY(180deg)',
                float: 'left'
            },
            on: {
                click: function() {
                    skVid(-seekJump);
                }
            }
        },
        {
            element: m_this.getTimeTable(),
            ref: 'timeTable',
            class: 'meta time',
            innerText: '00:00'
        },
        {
            element: 'i',
            aria_hidden: 'true',
            class: 'fa fa-repeat skip-forward',
            on: {
                click: function() {
                    skVid(seekJump);
                }
            }
        }
    ]);

    this.soundRange.dom.value = volume * 100;
    
    return this;
        
});
se.soma.media.components.AudioTrack.prototype = Object.create(se.soma.media.utils.view.RukaRenderer.prototype);
se.soma.media.components.AudioTrack.prototype.constructor = se.soma.media.components.AudioTrack;