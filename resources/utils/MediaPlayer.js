//--------------------------------------------------------------------------
// Public class MediaPlayer
//--------------------------------------------------------------------------

/**
 *  Creates an instance representing a mediaplayer.
 *
 *  @version    1.0
 *  @copyright  Copyright (c) 2017-2022.
 *  @license    Creative Commons (BY-NC-SA) 3.0
 *  @since      Nov 15, 2017
 *  @author     Samwel Munga <samwelmunga@hotmail.se>
 * 
 */
se.soma.utils.MediaPlayer = (function() {
    var _this = {},
        history = [],
        playlist = [],
        now_playing = null,
        queue = [],
        repeat = {
            one: false,
            all: false
        },
        isMedia = function( m ) {
            if(!m || !m.player) return false;
            return m.player.dom.tagName == 'VIDEO' || m.player.dom.tagName == 'AUDIO';
        },
        isPlaying = function() {
            return now_playing && !now_playing.paused && !now_playing.ended;
        },
        getMedia = function( m ) {
            if(typeof(m) === 'number') return _this.playlist.get()[m]
            return playlist.indexOf(m) > -1 ? playlist.slice(playlist.indexOf(m), 1)[0] : null;
        };

    Object.defineProperties(_this, {
        playlist: {
            value: {
                get: function( ix ) {
                    console.log('!isNaN(ix)', !isNaN(ix))
                    return (!isNaN(ix)) ? playlist.slice(ix, ix + 1)[0] : playlist.slice(0);
                },
                set: function( pl ) {
                    var bool = true;
                    if(!Array.isArray(pl)) return !bool;
                    pl.map(function(t){ if(!isMedia(t)) bool = false;});
                    if(bool) playlist = pl;
                    return true;
                },
                add: function( m ) {
                    
                    if(isMedia(m)) {
                        m.beforePlaybackStart(_this.play);
                        playlist.push(m);
                    }
                },
                remove: function( m ) {
                    return playlist.indexOf(m) > -1 ? playlist.splice(playlist.indexOf(m), 1)[0] : null;
                },
                removeIndex: function( ix ) {
                    return playlist[ix] ? playlist.splice(ix, 1) : null;
                }
            }
        },
        queue: {
            value: function( m, rmv ) {
                if(!isMedia(m)) return //console.warn('Unsupported media format.');
                return (!rmv) ? queue.push(m) : (queue.indexOf(m) > -1) ? queue.splice(queue.indexOf(m), 1) : null;
            }
        },
        play: {
            value: function( m ) {
                if(typeof(m) === 'undefined' || m === now_playing) return;
                m = getMedia(m) || m || queue.pop() || playlist.slice(0).shift();
                console.log('m:', m);
                if(repeat.all === true) playlist.unshift(m);
                else if(repeat.one === true) m.loop(true);
                if(now_playing) _this.stop();
                m.onPlaybackFinish(_this.next);
                now_playing = m;
            }
        },
        pause: {
            value: function( m ) {
                if(isPlaying()) now_playing.pause();
                return now_playing;
            }
        },
        stop: {
            value: function() {
                if(isPlaying()) now_playing.pause();
                now_playing.remove();
            }
        },
        previous: {
            value: function() {
                if(_this.pause() && repeat.all) {
                    _this.stop();
                }
                playlist.push(history.pop());
                _this.play();
            }
        },
        next: {
            value: function( manual ) {
                if(manual === true) {
                    _this.pause();
                } 
                history.push(now_playing);
                if(!now_playing.loop) {
                    now_playing.remove();
                    _this.play();
                }
            }
        },
        repeat: {
            value: function( loop ) {
                repeat.one = false;
                repeat.all = false;
                if(loop === 1) {
                    repeat.one = true;
                } else if(loop === 2) {
                    repeat.all = true;
                }
            }
        },
        rewind: {
            value: function() {
                if(isPlaying()) now_playing.seek(-15);
            }
        },
        forward: {
            value: function() {
                if(isPlaying()) now_playing.seek(15);
            }
        }
    });

    return _this;

})();
