import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var penner = createCommonjsModule(function (module, exports) {
/*
	Copyright © 2001 Robert Penner
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, 
	are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of 
	conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list 
	of conditions and the following disclaimer in the documentation and/or other materials 
	provided with the distribution.

	Neither the name of the author nor the names of contributors may be used to endorse 
	or promote products derived from this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
	AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function() {
  var penner, umd;

  umd = function(factory) {
    {
      return module.exports = factory;
    }
  };

  penner = {
    linear: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    easeInCubic: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    easeInQuart: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    easeInQuint: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      } else {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
      }
    },
    easeOutExpo: function(t, b, c, d) {
      if (t === d) {
        return b + c;
      } else {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }
    },
    easeInOutExpo: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      } else {
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    easeInCirc: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      } else {
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    easeInElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) ; else if ((t /= d) === 1) ;
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) ; else if ((t /= d) === 1) ;
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) ; else if ((t /= d / 2) === 2) ;
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      } else {
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    },
    easeInBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      } else {
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      }
    },
    easeInBounce: function(t, b, c, d) {
      var v;
      v = penner.easeOutBounce(d - t, 0, c, d);
      return c - v + b;
    },
    easeOutBounce: function(t, b, c, d) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      }
    },
    easeInOutBounce: function(t, b, c, d) {
      var v;
      if (t < d / 2) {
        v = penner.easeInBounce(t * 2, 0, c, d);
        return v * .5 + b;
      } else {
        v = penner.easeOutBounce(t * 2 - d, 0, c, d);
        return v * .5 + c * .5 + b;
      }
    }
  };

  umd(penner);

}).call(commonjsGlobal);
});

const scrollboxOptions = {
    'boxWidth': 100,
    'boxHeight': 100,
    'scrollbarSize': 10,
    'scrollbarBackground': 14540253,
    'scrollbarBackgroundAlpha': 1,
    'scrollbarForeground': 8947848,
    'scrollbarForegroundAlpha': 1,
    'dragScroll': true,
    'stopPropagation': true,
    'scrollbarOffsetHorizontal': 0,
    'scrollbarOffsetVertical': 0,
    'underflow': 'top-left',
    'fadeScrollbar': false,
    'fadeScrollbarTime': 1000,
    'fadeScrollboxWait': 3000,
    'fadeScrollboxEase': 'easeInOutSine',
    'passiveWheel': false,
    'clampWheel': true
};

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */
class Scrollbox extends PIXI.Container {
    /**
     * create a scrollbox
     * @param {object} options
     * @param {boolean} [options.dragScroll=true] user may drag the content area to scroll content
     * @param {string} [options.overflowX=auto] (none, scroll, hidden, auto) this changes whether the scrollbar is shown
     * @param {string} [options.overflowY=auto] (none, scroll, hidden, auto) this changes whether the scrollbar is shown
     * @param {string} [options.overflow] (none, scroll, hidden, auto) sets overflowX and overflowY to this value
     * @param {number} [options.boxWidth=100] width of scrollbox including scrollbar (in pixels)
     * @param {number} [options.boxHeight=100] height of scrollbox including scrollbar (in pixels)
     * @param {number} [options.scrollbarSize=10] size of scrollbar (in pixels)
     * @param {number} [options.scrollbarOffsetHorizontal=0] offset of horizontal scrollbar (in pixels)
     * @param {number} [options.scrollbarOffsetVertical=0] offset of vertical scrollbar (in pixels)
     * @param {boolean} [options.stopPropagation=true] call stopPropagation on any events that impact scrollbox
     * @param {number} [options.scrollbarBackground=0xdddddd] background color of scrollbar
     * @param {number} [options.scrollbarBackgroundAlpha=1] alpha of background of scrollbar
     * @param {number} [options.scrollbarForeground=0x888888] foreground color of scrollbar
     * @param {number} [options.scrollbarForegroundAlpha=1] alpha of foreground of scrollbar
     * @param {string} [options.underflow=top-left] what to do when content underflows the scrollbox size: none: do nothing; (left/right/center AND top/bottom/center); OR center (e.g., 'top-left', 'center', 'none', 'bottomright')
     * @param {boolean} [options.noTicker] do not use PIXI.Ticker (for fade to work properly you will need to manually call updateLoop(elapsed) on each frame)
     * @param {PIXI.Ticker} [options.ticker=PIXI.Ticker.shared] use this PIXI.Ticker for updates
     * @param {boolean} [options.fade] fade the scrollbar when not in use
     * @param {number} [options.fadeScrollbarTime=1000] time to fade scrollbar if options.fade is set
     * @param {number} [options.fadeScrollboxWait=3000] time to wait before fading the scrollbar if options.fade is set
     * @param {(string|function)} [options.fadeScrollboxEase=easeInOutSine] easing function to use for fading
     * @param {boolean} [options.passiveWheel=false] whether wheel events are propogated beyond the scrollbox (NOTE: default is now false)
     * @param {boolean} [options.clampWheel=true] wheel events should be clamped (to avoid weird bounce with mouse wheel)
     * @param {PIXI.InteractionManager} [options.interaction] InteractionManager, available from instantiated PIXI.Renderer.plugins.interaction - used to calculate pointer postion relative to canvas location on screen
     * @param {HTMLElement} [options.divWheel] the HTMLElement to use for wheel interactions
     */
    constructor(options = {}) {
        super();
        this.options = Object.assign({}, scrollboxOptions, options);
        if (options.overflow) {
            this.options.overflowX = this.options.overflowY = options.overflow;
        }
        this.ease = typeof this.options.fadeScrollboxEase === 'function' ? this.options.fadeScrollboxEase : penner[this.options.fadeScrollboxEase];

        /**
         * content in placed in here
         * you can use any function from pixi-viewport on content to manually move the content (see https://davidfig.github.io/pixi-viewport/jsdoc/)
         * @type {Viewport}
         */
        this.content = this.addChild(new Viewport({
            passiveWheel: false,
            stopPropagation: this.options.stopPropagation,
            screenWidth: this.options.boxWidth,
            screenHeight: this.options.boxHeight,
            interaction: this.options.interaction,
            divWheel: this.options.divWheel,
        }));
        this.content
            .decelerate()
            .on('moved', () => this._drawScrollbars());

        // needed to pull this out of viewportOptions because of pixi.js v4 support (which changed from PIXI.ticker.shared to PIXI.Ticker.shared...sigh)
        if (options.ticker) {
            this.options.ticker = options.ticker;
        }
        else {
            // to avoid Rollup transforming our import, save pixi namespace in a variable
            // from here: https://github.com/pixijs/pixi.js/issues/5757
            let ticker;
            const pixiNS = PIXI;
            if (parseInt(/^(\d+)\./.exec(PIXI.VERSION)[1]) < 5) {
                ticker = pixiNS.ticker.shared;
            }
            else {
                ticker = pixiNS.Ticker.shared;
            }
            this.options.ticker = options.ticker || ticker;
        }

        /**
         * graphics element for drawing the scrollbars
         * @type {PIXI.Graphics}
         */
        this.scrollbar = this.addChild(new PIXI.Graphics());
        this.scrollbar.interactive = true;
        this.scrollbar.on('pointerdown', this.scrollbarDown, this);
        this.interactive = true;
        this.on('pointermove', this.scrollbarMove, this);
        this.on('pointerup', this.scrollbarUp, this);
        this.on('pointercancel', this.scrollbarUp, this);
        this.on('pointerupoutside', this.scrollbarUp, this);
        this._maskContent = this.addChild(new PIXI.Graphics());
        this.update();

        if (!this.options.noTicker) {
            this.tickerFunction = () => this.updateLoop(Math.min(this.options.ticker.elapsedMS, 16.6667));
            this.options.ticker.add(this.tickerFunction);
        }
    }

    /**
     * offset of horizontal scrollbar (in pixels)
     * @type {number}
     */
    get scrollbarOffsetHorizontal() {
        return this.options.scrollbarOffsetHorizontal
    }
    set scrollbarOffsetHorizontal(value) {
        this.options.scrollbarOffsetHorizontal = value;
    }

    /**
     * offset of vertical scrollbar (in pixels)
     * @type {number}
     */
    get scrollbarOffsetVertical() {
        return this.options.scrollbarOffsetVertical
    }
    set scrollbarOffsetVertical(value) {
        this.options.scrollbarOffsetVertical = value;
    }

    /**
     * disable the scrollbox (if set to true this will also remove the mask)
     * @type {boolean}
     */
    get disable() {
        return this._disabled
    }
    set disable(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            this.update();
        }
    }

    /**
     * call stopPropagation on any events that impact scrollbox
     * @type {boolean}
     */
    get stopPropagation() {
        return this.options.stopPropagation
    }
    set stopPropagation(value) {
        this.options.stopPropagation = value;
    }

    /**
     * user may drag the content area to scroll content
     * @type {boolean}
     */
    get dragScroll() {
        return this.options.dragScroll
    }
    set dragScroll(value) {
        this.options.dragScroll = value;
        if (value) {
            this.content.drag();
        }
        else {
            if (typeof this.content.removePlugin !== 'undefined') {
                this.content.removePlugin('drag');
            }
            else {
                this.content.plugins.remove('drag');
            }
        }
        this.update();
    }

    /**
     * width of scrollbox including the scrollbar (if visible)- this changes the size and not the scale of the box
     * @type {number}
     */
    get boxWidth() {
        return this.options.boxWidth
    }
    set boxWidth(value) {
        this.options.boxWidth = value;
        this.content.screenWidth = value;
        this.update();
    }

    /**
     * sets overflowX and overflowY to (scroll, hidden, auto) changing whether the scrollbar is shown
     * scroll = always show scrollbar
     * hidden = hide overflow and do not show scrollbar
     * auto = if content is larger than box size, then show scrollbar
     * @type {string}
     */
    get overflow() {
        return this.options.overflow
    }
    set overflow(value) {
        this.options.overflow = value;
        this.options.overflowX = value;
        this.options.overflowY = value;
        this.update();
    }

    /**
     * sets overflowX to (scroll, hidden, auto) changing whether the scrollbar is shown
     * scroll = always show scrollbar
     * hidden = hide overflow and do not show scrollbar
     * auto = if content is larger than box size, then show scrollbar
     * @type {string}
     */
    get overflowX() {
        return this.options.overflowX
    }
    set overflowX(value) {
        this.options.overflowX = value;
        this.update();
    }

    /**
     * sets overflowY to (scroll, hidden, auto) changing whether the scrollbar is shown
     * scroll = always show scrollbar
     * hidden = hide overflow and do not show scrollbar
     * auto = if content is larger than box size, then show scrollbar
     * @type {string}
     */
    get overflowY() {
        return this.options.overflowY
    }
    set overflowY(value) {
        this.options.overflowY = value;
        this.update();
    }

    /**
     * height of scrollbox including the scrollbar (if visible) - this changes the size and not the scale of the box
     * @type {number}
     */
    get boxHeight() {
        return this.options.boxHeight
    }
    set boxHeight(value) {
        this.options.boxHeight = value;
        this.content.screenHeight = value;
        this.update();
    }

    /**
     * scrollbar size in pixels
     * @type {number}
     */
    get scrollbarSize() {
        return this.options.scrollbarSize
    }
    set scrollbarSize(value) {
        this.options.scrollbarSize = value;
    }

    /**
     * width of scrollbox less the scrollbar (if visible)
     * @type {number}
     * @readonly
     */
    get contentWidth() {
        return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0)
    }

    /**
     * height of scrollbox less the scrollbar (if visible)
     * @type {number}
     * @readonly
     */
    get contentHeight() {
        return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
    }

    /**
     * is the vertical scrollbar visible
     * @type {boolean}
     * @readonly
     */
    get isScrollbarVertical() {
        return this._isScrollbarVertical
    }

    /**
     * is the horizontal scrollbar visible
     * @type {boolean}
     * @readonly
     */
    get isScrollbarHorizontal() {
        return this._isScrollbarHorizontal
    }

    /**
     * top coordinate of scrollbar
     */
    get scrollTop() {
        return this.content.top
    }
    set scrollTop(top) {
        this.content.top = top;
        this._drawScrollbars();
    }

    /**
     * left coordinate of scrollbar
     */
    get scrollLeft() {
        return this.content.left
    }
    set scrollLeft(left) {
        this.content.left = left;
        this._drawScrollbars();
    }

    /**
     * width of content area
     * if not set then it uses content.width to calculate width
     */
    get scrollWidth() {
        return this._scrollWidth || this.content.width
    }
    set scrollWidth(value) {
        this._scrollWidth = value;
    }

    /**
     * height of content area
     * if not set then it uses content.height to calculate height
     */
    get scrollHeight() {
        return this._scrollHeight || this.content.height
    }
    set scrollHeight(value) {
        this._scrollHeight = value;
    }

    /**
     * draws scrollbars
     * @private
     */
    _drawScrollbars() {
        this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowX) !== -1 ? false : this.scrollWidth > this.options.boxWidth;
        this._isScrollbarVertical = this.overflowY === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowY) !== -1 ? false : this.scrollHeight > this.options.boxHeight;
        this.scrollbar.clear();
        this.scrollWidth + (this._isScrollbarVertical ? this.options.scrollbarSize : 0);
        this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        const width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
        const height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        this.scrollbarTop = (this.content.top / height) * this.boxHeight;
        this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop;
        this.scrollbarHeight = (this.boxHeight / height) * this.boxHeight;
        this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight;
        this.scrollbarLeft = (this.content.left / width) * this.boxWidth;
        this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft;
        this.scrollbarWidth = (this.boxWidth / width) * this.boxWidth;
        this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth;
        if (this.isScrollbarVertical) {
            this.scrollbar
                .beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha)
                .drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, 0, this.scrollbarSize, this.boxHeight)
                .endFill();
        }
        if (this.isScrollbarHorizontal) {
            this.scrollbar
                .beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha)
                .drawRect(0, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.boxWidth, this.scrollbarSize)
                .endFill();
        }
        if (this.isScrollbarVertical) {
            this.scrollbar
                .beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha)
                .drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight)
                .endFill();
        }
        if (this.isScrollbarHorizontal) {
            this.scrollbar
                .beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha)
                .drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.scrollbarWidth, this.scrollbarSize)
                .endFill();
        }
        // this.content.forceHitArea = new PIXI.Rectangle(0, 0 , this.boxWidth, this.boxHeight)
        this.activateFade();
    }

    /**
     * draws mask layer
     * @private
     */
    _drawMask() {
        this._maskContent
            .beginFill(0)
            .drawRect(0, 0, this.boxWidth, this.boxHeight)
            .endFill();
        this.content.mask = this._maskContent;
    }

    /**
     * call when scrollbox content changes
     */
    update() {
        this.content.mask = null;
        this._maskContent.clear();
        if (!this._disabled) {
            this._drawScrollbars();
            this._drawMask();
            const direction = this.isScrollbarHorizontal && this.isScrollbarVertical ? 'all' : this.isScrollbarHorizontal ? 'x' : 'y';
            if (direction !== null) {
                if (this.options.dragScroll) {
                    this.content.drag({ clampWheel: this.options.clampWheel, direction });
                }
                this.content.clamp({ direction, underflow: this.options.underflow });
            }
        }
    }

    /**
     * called on each frame to update fade scrollbars (if enabled)
     * @param {number} elapsed since last frame in milliseconds (usually capped at 16.6667)
     */
    updateLoop(elapsed) {
        if (this.fade) {
            if (this.fade.wait > 0) {
                this.fade.wait -= elapsed;
                if (this.fade.wait <= 0) {
                    elapsed += this.fade.wait;
                }
                else {
                    return
                }
            }
            this.fade.duration += elapsed;
            if (this.fade.duration >= this.options.fadeScrollbarTime) {
                this.fade = null;
                this.scrollbar.alpha = 0;
            }
            else {
                this.scrollbar.alpha = this.ease(this.fade.duration, 1, -1, this.options.fadeScrollbarTime);
            }
            this.content.dirty = true;
        }
    }

    /**
     * dirty value (used for optimizing draws) for underlying viewport (scrollbox.content)
     * @type {boolean}
     */
    get dirty() {
        return this.content.dirty
    }
    set dirty(value) {
        this.content.dirty = value;
    }

    /**
     * show the scrollbar and restart the timer for fade if options.fade is set
     */
    activateFade() {
        if (!this.fade && this.options.fade) {
            this.scrollbar.alpha = 1;
            this.fade = { wait: this.options.fadeScrollboxWait, duration: 0 };
        }
    }

    /**
     * handle pointer down on scrollbar
     * @param {PIXI.interaction.InteractionEvent} e
     * @private
     */
    scrollbarDown(e) {
        const local = this.toLocal(e.data.global);
        if (this.isScrollbarHorizontal) {
            if (local.y > this.boxHeight - this.scrollbarSize) {
                if (local.x >= this.scrollbarLeft && local.x <= this.scrollbarLeft + this.scrollbarWidth) {
                    this.pointerDown = { type: 'horizontal', last: local };
                }
                else {
                    if (local.x > this.scrollbarLeft) {
                        this.content.left += this.content.worldScreenWidth;
                        this.update();
                    }
                    else {
                        this.content.left -= this.content.worldScreenWidth;
                        this.update();
                    }
                }
                if (this.options.stopPropagation) {
                    e.stopPropagation();
                }
                return
            }
        }
        if (this.isScrollbarVertical) {
            if (local.x > this.boxWidth - this.scrollbarSize) {
                if (local.y >= this.scrollbarTop && local.y <= this.scrollbarTop + this.scrollbarWidth) {
                    this.pointerDown = { type: 'vertical', last: local };
                }
                else {
                    if (local.y > this.scrollbarTop) {
                        this.content.top += this.content.worldScreenHeight;
                        this.update();
                    }
                    else {
                        this.content.top -= this.content.worldScreenHeight;
                        this.update();
                    }
                }
                if (this.options.stopPropagation) {
                    e.stopPropagation();
                }
                return
            }
        }
    }

    /**
     * handle pointer move on scrollbar
     * @param {PIXI.interaction.InteractionEvent} e
     * @private
     */
    scrollbarMove(e) {
        if (this.pointerDown) {
            if (this.pointerDown.type === 'horizontal') {
                const local = this.toLocal(e.data.global);
                const width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
                this.scrollbarLeft += local.x - this.pointerDown.last.x;
                this.content.left = this.scrollbarLeft / this.boxWidth * width;
                this.pointerDown.last = local;
                this.update();
            }
            else if (this.pointerDown.type === 'vertical') {
                const local = this.toLocal(e.data.global);
                const height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
                this.scrollbarTop += local.y - this.pointerDown.last.y;
                this.content.top = this.scrollbarTop / this.boxHeight * height;
                this.pointerDown.last = local;
                this.update();
            }
            if (this.options.stopPropagation) {
                e.stopPropagation();
            }
        }
    }

    /**
     * handle pointer down on scrollbar
     * @private
     */
    scrollbarUp() {
        this.pointerDown = null;
    }

    /**
     * resize the mask for the container
     * @param {object} options
     * @param {number} [options.boxWidth] width of scrollbox including scrollbar (in pixels)
     * @param {number} [options.boxHeight] height of scrollbox including scrollbar (in pixels)
     * @param {number} [options.scrollWidth] set the width of the inside of the scrollbox (leave null to use content.width)
     * @param {number} [options.scrollHeight] set the height of the inside of the scrollbox (leave null to use content.height)
     */
    resize(options) {
        this.options.boxWidth = typeof options.boxWidth !== 'undefined' ? options.boxWidth : this.options.boxWidth;
        this.options.boxHeight = typeof options.boxHeight !== 'undefined' ? options.boxHeight : this.options.boxHeight;
        if (options.scrollWidth) {
            this.scrollWidth = options.scrollWidth;
        }
        if (options.scrollHeight) {
            this.scrollHeight = options.scrollHeight;
        }
        this.content.resize(this.options.boxWidth, this.options.boxHeight, this.scrollWidth, this.scrollHeight);
        this.update();
    }

    /**
     * ensure that the bounding box is visible
     * @param {number} x - relative to content's coordinate system
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    ensureVisible(x, y, width, height) {
        this.content.ensureVisible(x, y, width, height);
        this._drawScrollbars();
    }
}

export { Scrollbox };
//# sourceMappingURL=scrollbox.es.js.map
