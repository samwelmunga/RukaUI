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

    var m_this    = this,
        source    = obj.audio,
        title     = obj.title,
        playIcon  = 'fa-play',
        pauseIcon = 'fa-pause',
        soundIcon = 'fa-volume-up',
        muteIcon  = 'fa-volume-off',
        playState = 'updatePlayback',
        errorIcon = 'fa-exclamation-circle',
        loadIcon  = 'fa-spinner',
        btns = {},
	    pBtn = newBtn(playIcon, play),
        mBtn = newBtn(soundIcon, muted),
        ranges   = {},
	    pBRange  = newRange('seeker'),
        sndRange = newRange('volume'),
        volume   = 0.5,
        seekJump = 30,
        status   = null,
        active   = false,
        initCall = [],
        holdCall = null,
        endCall  = null
        inactive = null;



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
    };
    
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

    this.play = function() {
        if(initCall) {
            //console.log('onPlaybackStarted', initCall, m_this);
            initCall.map(function( f ) { f(m_this); });
        }
        navigator.vibrate(20);
        plPs();
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

    this.updateButtonState = function( el ) {
        el = el && el.target ? el.target : el ? el : this;
        removeButtonState(el);
        addButtonState(el);
        return el;
    };

    this.updateAllButtonsState = function() {
        var buttons = btns[playIcon] || [];
        buttons.map(m_this.updateButtonState);
        return buttons;
    };

    Object.defineProperties(this, {
        ready: {
            get: function() {
                return m_this.player.dom.canplay;
            }
        },
        playing: {
            get: function() {
                return m_this.player.dom.playing;
            }
        },
        paused: {
            get: function() {
                return m_this.player.dom.paused;
            },
            set: function( state ) {
                m_this.player.dom.paused = state;
            }
        },
        ended: {
            get: function() {
                return m_this.player.dom.ended;
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
        updateState: {
            value: function( state ) {
                status = typeof(state) == 'string' ? state : null;
                m_this.updateAllButtonsState();
            }
        }
    })

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

    function play() {
        m_this.play();
    }

    function plPs() {

        if(!parent.contains(m_this.dom))  m_this.append();
        if(m_this.player.dom.src == null) m_this.load();

        if (m_this.player.dom.paused) {
            m_this.player.dom.play();
        } else {
            m_this.player.dom.pause();
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

    function addButtonState( el ) {
        if(status == 'loading' && !el.classList.contains(loadIcon)) {
            el.classList.add(loadIcon);
        } else if(status == 'playing' && !el.classList.contains(pauseIcon)) {
            el.classList.add(pauseIcon);
        } else if(status == 'error' && !el.classList.contains(errorIcon)) {
            el.classList.add(errorIcon);
        } else if(!el.classList.contains(playIcon)) {
            el.classList.add(playIcon);
        }
    }

    function removeButtonState( el ) {
        el.classList.remove(playIcon);
        el.classList.remove(pauseIcon);
        el.classList.remove(loadIcon);
        el.classList.remove(errorIcon);
    }

    function updateTimeTable( e ) {
        var duration = convertTime(m_this.duration),
            elapsed  = convertTime(m_this.elapsed);
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

    function tmUpd() {
        var time = m_this.player.dom.currentTime * (100 / m_this.player.dom.duration);
        m_this.playbackRange.dom.value = time;
        m_this.dom.dispatch(playState);
    }
    
    function skVid( time ) {
        time = (typeof(time) == 'number') ? time : 0;
        var cur = m_this.player.dom.duration * (m_this.playbackRange.dom.value / 100);
        //console.log('cur', cur)
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
            src: obj.audio,
            type: obj.mime,
            preload: 'metadata',
            on: { 
                timeupdate: tmUpd, 
                ended: m_this.reload,
                click: function(){pBtn.click();},
                contextmenu: function(e){e.preventDefault();},
                loadstart: m_this.updateState.bind(null, 'loading'),
                canplay: m_this.updateState,
                play: m_this.updateState.bind(null, 'playing'),
                playing: m_this.updateState.bind(null, 'playing'),
                pause: m_this.updateState,
                ended: m_this.updateState,
                waiting: m_this.updateState.bind(null, 'loading'),
                stalled: m_this.updateState.bind(null, 'loading'),
                error: m_this.updateState.bind(null, 'error')
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