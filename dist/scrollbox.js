'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = require('pixi.js');
var Viewport = require('pixi-viewport');
var Ease = require('pixi-ease');

// handle v4 pixi-viewport
Viewport = typeof Viewport.Viewport === 'undefined' ? Viewport : Viewport.Viewport;

var defaults = require('./defaults');
var DEFAULTS = require('./defaults.json');

var FADE_SCROLLBAR_TIME = 1000;

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */

var Scrollbox = function (_PIXI$Container) {
    _inherits(Scrollbox, _PIXI$Container);

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
     * @param {(boolean|number)} [options.fade] fade the scrollbar when not in use (true = 1000ms)
     * @param {number} [options.fadeWait=3000] time to wait before fading the scrollbar if options.fade is set
     * @param {(string|function)} [options.fadeEase=easeInOutSine] easing function to use for fading
     */
    function Scrollbox(options) {
        _classCallCheck(this, Scrollbox);

        var _this = _possibleConstructorReturn(this, (Scrollbox.__proto__ || Object.getPrototypeOf(Scrollbox)).call(this));

        _this.options = defaults(options, DEFAULTS);
        _this.ease = new Ease.list();

        /**
         * content in placed in here
         * you can use any function from pixi-viewport on content to manually move the content (see https://davidfig.github.io/pixi-viewport/jsdoc/)
         * @type {PIXI.extras.Viewport}
         */
        _this.content = _this.addChild(new Viewport({ passiveWheel: _this.options.stopPropagation, stopPropagation: _this.options.stopPropagation, screenWidth: _this.options.boxWidth, screenHeight: _this.options.boxHeight }));
        _this.content.decelerate().on('moved', function () {
            return _this._drawScrollbars();
        });

        /**
         * graphics element for drawing the scrollbars
         * @type {PIXI.Graphics}
         */
        _this.scrollbar = _this.addChild(new PIXI.Graphics());
        _this.scrollbar.interactive = true;
        _this.scrollbar.on('pointerdown', _this.scrollbarDown, _this);
        _this.interactive = true;
        _this.on('pointermove', _this.scrollbarMove, _this);
        _this.on('pointerup', _this.scrollbarUp, _this);
        _this.on('pointercancel', _this.scrollbarUp, _this);
        _this.on('pointerupoutside', _this.scrollbarUp, _this);
        _this._maskContent = _this.addChild(new PIXI.Graphics());
        _this.update();
        return _this;
    }

    /**
     * offset of horizontal scrollbar (in pixels)
     * @type {number}
     */


    _createClass(Scrollbox, [{
        key: '_drawScrollbars',


        /**
         * draws scrollbars
         * @private
         */
        value: function _drawScrollbars() {
            this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowX) !== -1 ? false : this.scrollWidth > this.options.boxWidth;
            this._isScrollbarVertical = this.overflowY === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowY) !== -1 ? false : this.scrollHeight > this.options.boxHeight;
            this.scrollbar.clear();
            var options = {};
            options.left = 0;
            options.right = this.scrollWidth + (this._isScrollbarVertical ? this.options.scrollbarSize : 0);
            options.top = 0;
            options.bottom = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
            var width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
            var height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
            this.scrollbarTop = this.content.top / height * this.boxHeight;
            this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop;
            this.scrollbarHeight = this.boxHeight / height * this.boxHeight;
            this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight;
            this.scrollbarLeft = this.content.left / width * this.boxWidth;
            this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft;
            this.scrollbarWidth = this.boxWidth / width * this.boxWidth;
            this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth;
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha).drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, 0, this.scrollbarSize, this.boxHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha).drawRect(0, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.boxWidth, this.scrollbarSize).endFill();
            }
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha).drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha).drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.scrollbarWidth, this.scrollbarSize).endFill();
            }
            // this.content.forceHitArea = new PIXI.Rectangle(0, 0 , this.boxWidth, this.boxHeight)
            this.activateFade();
        }

        /**
         * draws mask layer
         * @private
         */

    }, {
        key: '_drawMask',
        value: function _drawMask() {
            this._maskContent.beginFill(0).drawRect(0, 0, this.boxWidth, this.boxHeight).endFill();
            this.content.mask = this._maskContent;
        }

        /**
         * call when scrollbox content changes
         */

    }, {
        key: 'update',
        value: function update() {
            this.content.mask = null;
            this._maskContent.clear();
            if (!this._disabled) {
                this._drawScrollbars();
                this._drawMask();
                if (this.options.dragScroll) {
                    var direction = this.isScrollbarHorizontal && this.isScrollbarVertical ? 'all' : this.isScrollbarHorizontal ? 'x' : 'y';
                    if (direction !== null) {
                        this.content.drag({ clampWheel: true, direction: direction }).clamp({ direction: direction, underflow: this.options.underflow });
                    }
                }
            }
        }

        /**
         * show the scrollbar and restart the timer for fade if options.fade is set
         */

    }, {
        key: 'activateFade',
        value: function activateFade() {
            var _this2 = this;

            if (this.options.fade) {
                if (this.fade) {
                    this.ease.remove(this.fade);
                }
                this.scrollbar.alpha = 1;
                var time = this.options.fade === true ? FADE_SCROLLBAR_TIME : this.options.fade;
                this.fade = this.ease.to(this.scrollbar, { alpha: 0 }, time, { wait: this.options.fadeWait, ease: this.options.fadeEase });
                this.fade.on('each', function () {
                    return _this2.content.dirty = true;
                });
            }
        }

        /**
         * handle pointer down on scrollbar
         * @param {PIXI.interaction.InteractionEvent} e
         * @private
         */

    }, {
        key: 'scrollbarDown',
        value: function scrollbarDown(e) {
            var local = this.toLocal(e.data.global);
            if (this.isScrollbarHorizontal) {
                if (local.y > this.boxHeight - this.scrollbarSize) {
                    if (local.x >= this.scrollbarLeft && local.x <= this.scrollbarLeft + this.scrollbarWidth) {
                        this.pointerDown = { type: 'horizontal', last: local };
                    } else {
                        if (local.x > this.scrollbarLeft) {
                            this.content.left += this.content.worldScreenWidth;
                            this.update();
                        } else {
                            this.content.left -= this.content.worldScreenWidth;
                            this.update();
                        }
                    }
                    if (this.options.stopPropagation) {
                        e.stopPropagation();
                    }
                    return;
                }
            }
            if (this.isScrollbarVertical) {
                if (local.x > this.boxWidth - this.scrollbarSize) {
                    if (local.y >= this.scrollbarTop && local.y <= this.scrollbarTop + this.scrollbarWidth) {
                        this.pointerDown = { type: 'vertical', last: local };
                    } else {
                        if (local.y > this.scrollbarTop) {
                            this.content.top += this.content.worldScreenHeight;
                            this.update();
                        } else {
                            this.content.top -= this.content.worldScreenHeight;
                            this.update();
                        }
                    }
                    if (this.options.stopPropagation) {
                        e.stopPropagation();
                    }
                    return;
                }
            }
        }

        /**
         * handle pointer move on scrollbar
         * @param {PIXI.interaction.InteractionEvent} e
         * @private
         */

    }, {
        key: 'scrollbarMove',
        value: function scrollbarMove(e) {
            if (this.pointerDown) {
                if (this.pointerDown.type === 'horizontal') {
                    var local = this.toLocal(e.data.global);
                    this.content.left += local.x - this.pointerDown.last.x;
                    this.pointerDown.last = local;
                    this.update();
                } else if (this.pointerDown.type === 'vertical') {
                    var _local = this.toLocal(e.data.global);
                    this.content.top += _local.y - this.pointerDown.last.y;
                    this.pointerDown.last = _local;
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

    }, {
        key: 'scrollbarUp',
        value: function scrollbarUp() {
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

    }, {
        key: 'resize',
        value: function resize(options) {
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

    }, {
        key: 'ensureVisible',
        value: function ensureVisible(x, y, width, height) {
            this.content.ensureVisible(x, y, width, height);
            this._drawScrollbars();
        }
    }, {
        key: 'scrollbarOffsetHorizontal',
        get: function get() {
            return this.options.scrollbarOffsetHorizontal;
        },
        set: function set(value) {
            this.options.scrollbarOffsetHorizontal = value;
        }

        /**
         * offset of vertical scrollbar (in pixels)
         * @type {number}
         */

    }, {
        key: 'scrollbarOffsetVertical',
        get: function get() {
            return this.options.scrollbarOffsetVertical;
        },
        set: function set(value) {
            this.options.scrollbarOffsetVertical = value;
        }

        /**
         * disable the scrollbox (if set to true this will also remove the mask)
         * @type {boolean}
         */

    }, {
        key: 'disable',
        get: function get() {
            return this._disabled;
        },
        set: function set(value) {
            if (this._disabled !== value) {
                this._disabled = value;
                this.update();
            }
        }

        /**
         * call stopPropagation on any events that impact scrollbox
         * @type {boolean}
         */

    }, {
        key: 'stopPropagation',
        get: function get() {
            return this.options.stopPropagation;
        },
        set: function set(value) {
            this.options.stopPropagation = value;
        }

        /**
         * user may drag the content area to scroll content
         * @type {boolean}
         */

    }, {
        key: 'dragScroll',
        get: function get() {
            return this.options.dragScroll;
        },
        set: function set(value) {
            this.options.dragScroll = value;
            if (value) {
                this.content.drag();
            } else {
                if (typeof this.content.removePlugin !== 'undefined') {
                    this.content.removePlugin('drag');
                } else {
                    this.content.plugins.remove('drag');
                }
            }
            this.update();
        }

        /**
         * width of scrollbox including the scrollbar (if visible)- this changes the size and not the scale of the box
         * @type {number}
         */

    }, {
        key: 'boxWidth',
        get: function get() {
            return this.options.boxWidth;
        },
        set: function set(value) {
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

    }, {
        key: 'overflow',
        get: function get() {
            return this.options.overflow;
        },
        set: function set(value) {
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

    }, {
        key: 'overflowX',
        get: function get() {
            return this.options.overflowX;
        },
        set: function set(value) {
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

    }, {
        key: 'overflowY',
        get: function get() {
            return this.options.overflowY;
        },
        set: function set(value) {
            this.options.overflowY = value;
            this.update();
        }

        /**
         * height of scrollbox including the scrollbar (if visible) - this changes the size and not the scale of the box
         * @type {number}
         */

    }, {
        key: 'boxHeight',
        get: function get() {
            return this.options.boxHeight;
        },
        set: function set(value) {
            this.options.boxHeight = value;
            this.content.screenHeight = value;
            this.update();
        }

        /**
         * scrollbar size in pixels
         * @type {number}
         */

    }, {
        key: 'scrollbarSize',
        get: function get() {
            return this.options.scrollbarSize;
        },
        set: function set(value) {
            this.options.scrollbarSize = value;
        }

        /**
         * width of scrollbox less the scrollbar (if visible)
         * @type {number}
         * @readonly
         */

    }, {
        key: 'contentWidth',
        get: function get() {
            return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
        }

        /**
         * height of scrollbox less the scrollbar (if visible)
         * @type {number}
         * @readonly
         */

    }, {
        key: 'contentHeight',
        get: function get() {
            return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        }

        /**
         * is the vertical scrollbar visible
         * @type {boolean}
         * @readonly
         */

    }, {
        key: 'isScrollbarVertical',
        get: function get() {
            return this._isScrollbarVertical;
        }

        /**
         * is the horizontal scrollbar visible
         * @type {boolean}
         * @readonly
         */

    }, {
        key: 'isScrollbarHorizontal',
        get: function get() {
            return this._isScrollbarHorizontal;
        }

        /**
         * top coordinate of scrollbar
         */

    }, {
        key: 'scrollTop',
        get: function get() {
            return this.content.top;
        }

        /**
         * left coordinate of scrollbar
         */

    }, {
        key: 'scrollLeft',
        get: function get() {
            return this.content.left;
        }

        /**
         * width of content area
         * if not set then it uses content.width to calculate width
         */

    }, {
        key: 'scrollWidth',
        get: function get() {
            return this._scrollWidth || this.content.width;
        },
        set: function set(value) {
            this._scrollWidth = value;
        }

        /**
         * height of content area
         * if not set then it uses content.height to calculate height
         */

    }, {
        key: 'scrollHeight',
        get: function get() {
            return this._scrollHeight || this.content.height;
        },
        set: function set(value) {
            this._scrollHeight = value;
        }
    }]);

    return Scrollbox;
}(PIXI.Container);

if (PIXI && PIXI.extras) {
    PIXI.extras.Scrollbox = Scrollbox;
}

module.exports = Scrollbox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiUElYSSIsInJlcXVpcmUiLCJWaWV3cG9ydCIsIkVhc2UiLCJkZWZhdWx0cyIsIkRFRkFVTFRTIiwiRkFERV9TQ1JPTExCQVJfVElNRSIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJlYXNlIiwibGlzdCIsImNvbnRlbnQiLCJhZGRDaGlsZCIsInBhc3NpdmVXaGVlbCIsInN0b3BQcm9wYWdhdGlvbiIsInNjcmVlbldpZHRoIiwiYm94V2lkdGgiLCJzY3JlZW5IZWlnaHQiLCJib3hIZWlnaHQiLCJkZWNlbGVyYXRlIiwib24iLCJfZHJhd1Njcm9sbGJhcnMiLCJzY3JvbGxiYXIiLCJHcmFwaGljcyIsImludGVyYWN0aXZlIiwic2Nyb2xsYmFyRG93biIsInNjcm9sbGJhck1vdmUiLCJzY3JvbGxiYXJVcCIsIl9tYXNrQ29udGVudCIsInVwZGF0ZSIsIl9pc1Njcm9sbGJhckhvcml6b250YWwiLCJvdmVyZmxvd1giLCJpbmRleE9mIiwic2Nyb2xsV2lkdGgiLCJfaXNTY3JvbGxiYXJWZXJ0aWNhbCIsIm92ZXJmbG93WSIsInNjcm9sbEhlaWdodCIsImNsZWFyIiwibGVmdCIsInJpZ2h0Iiwic2Nyb2xsYmFyU2l6ZSIsInRvcCIsImJvdHRvbSIsImlzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIndpZHRoIiwiaXNTY3JvbGxiYXJWZXJ0aWNhbCIsImhlaWdodCIsInNjcm9sbGJhclRvcCIsInNjcm9sbGJhckhlaWdodCIsInNjcm9sbGJhckxlZnQiLCJzY3JvbGxiYXJXaWR0aCIsImJlZ2luRmlsbCIsInNjcm9sbGJhckJhY2tncm91bmQiLCJzY3JvbGxiYXJCYWNrZ3JvdW5kQWxwaGEiLCJkcmF3UmVjdCIsInNjcm9sbGJhck9mZnNldFZlcnRpY2FsIiwiZW5kRmlsbCIsInNjcm9sbGJhck9mZnNldEhvcml6b250YWwiLCJzY3JvbGxiYXJGb3JlZ3JvdW5kIiwic2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhIiwiYWN0aXZhdGVGYWRlIiwibWFzayIsIl9kaXNhYmxlZCIsIl9kcmF3TWFzayIsImRyYWdTY3JvbGwiLCJkaXJlY3Rpb24iLCJkcmFnIiwiY2xhbXBXaGVlbCIsImNsYW1wIiwidW5kZXJmbG93IiwiZmFkZSIsInJlbW92ZSIsImFscGhhIiwidGltZSIsInRvIiwid2FpdCIsImZhZGVXYWl0IiwiZmFkZUVhc2UiLCJkaXJ0eSIsImUiLCJsb2NhbCIsInRvTG9jYWwiLCJkYXRhIiwiZ2xvYmFsIiwieSIsIngiLCJwb2ludGVyRG93biIsInR5cGUiLCJsYXN0Iiwid29ybGRTY3JlZW5XaWR0aCIsIndvcmxkU2NyZWVuSGVpZ2h0IiwicmVzaXplIiwiZW5zdXJlVmlzaWJsZSIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwicGx1Z2lucyIsIm92ZXJmbG93IiwiX3Njcm9sbFdpZHRoIiwiX3Njcm9sbEhlaWdodCIsIkNvbnRhaW5lciIsImV4dHJhcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxPQUFPQyxRQUFRLFNBQVIsQ0FBYjtBQUNBLElBQUlDLFdBQVdELFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUUsT0FBT0YsUUFBUSxXQUFSLENBQWI7O0FBRUE7QUFDQUMsV0FBVyxPQUFPQSxTQUFTQSxRQUFoQixLQUE2QixXQUE3QixHQUEyQ0EsUUFBM0MsR0FBc0RBLFNBQVNBLFFBQTFFOztBQUVBLElBQU1FLFdBQVdILFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1JLFdBQVdKLFFBQVEsaUJBQVIsQ0FBakI7O0FBRUEsSUFBTUssc0JBQXNCLElBQTVCOztBQUVBOzs7O0lBR01DLFM7OztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLHVCQUFZQyxPQUFaLEVBQ0E7QUFBQTs7QUFBQTs7QUFFSSxjQUFLQSxPQUFMLEdBQWVKLFNBQVNJLE9BQVQsRUFBa0JILFFBQWxCLENBQWY7QUFDQSxjQUFLSSxJQUFMLEdBQVksSUFBSU4sS0FBS08sSUFBVCxFQUFa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OztBQUVEOzs7Ozs7OzRCQUtBO0FBQ0ksbUJBQU8sS0FBSzJELFlBQUwsSUFBcUIsS0FBS3RGLE9BQUwsQ0FBYWlDLEtBQXpDO0FBQ0gsUzswQkFDZWlELEssRUFDaEI7QUFDSSxpQkFBS0ksWUFBTCxHQUFvQkosS0FBcEI7QUFDSDs7QUFFRDs7Ozs7Ozs0QkFLQTtBQUNJLG1CQUFPLEtBQUtLLGFBQUwsSUFBc0IsS0FBS3ZGLE9BQUwsQ0FBYW1DLE1BQTFDO0FBQ0gsUzswQkFDZ0IrQyxLLEVBQ2pCO0FBQ0ksaUJBQUtLLGFBQUwsR0FBcUJMLEtBQXJCO0FBQ0g7Ozs7RUE3VG1CN0YsS0FBS21HLFM7O0FBNmpCN0IsSUFBSW5HLFFBQVFBLEtBQUtvRyxNQUFqQixFQUNBO0FBQ0lwRyxTQUFLb0csTUFBTCxDQUFZN0YsU0FBWixHQUF3QkEsU0FBeEI7QUFDSDs7QUFFRDhGLE9BQU9DLE9BQVAsR0FBaUIvRixTQUFqQiIsImZpbGUiOiJzY3JvbGxib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpXHJcbmxldCBWaWV3cG9ydCA9IHJlcXVpcmUoJ3BpeGktdmlld3BvcnQnKVxyXG5jb25zdCBFYXNlID0gcmVxdWlyZSgncGl4aS1lYXNlJylcclxuXHJcbi8vIGhhbmRsZSB2NCBwaXhpLXZpZXdwb3J0XHJcblZpZXdwb3J0ID0gdHlwZW9mIFZpZXdwb3J0LlZpZXdwb3J0ID09PSAndW5kZWZpbmVkJyA/IFZpZXdwb3J0IDogVmlld3BvcnQuVmlld3BvcnRcclxuXHJcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpXHJcbmNvbnN0IERFRkFVTFRTID0gcmVxdWlyZSgnLi9kZWZhdWx0cy5qc29uJylcclxuXHJcbmNvbnN0IEZBREVfU0NST0xMQkFSX1RJTUUgPSAxMDAwXHJcblxyXG4vKipcclxuICogcGl4aS5qcyBzY3JvbGxib3g6IGEgbWFza2VkIGNvbnRlbnQgYm94IHRoYXQgY2FuIHNjcm9sbCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseSB3aXRoIHNjcm9sbGJhcnNcclxuICovXHJcbmNsYXNzIFNjcm9sbGJveCBleHRlbmRzIFBJWEkuQ29udGFpbmVyXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kcmFnU2Nyb2xsPXRydWVdIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WD1hdXRvXSAobm9uZSwgc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1k9YXV0b10gKG5vbmUsIHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3ddIChub25lLCBzY3JvbGwsIGhpZGRlbiwgYXV0bykgc2V0cyBvdmVyZmxvd1ggYW5kIG92ZXJmbG93WSB0byB0aGlzIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGg9MTAwXSB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveEhlaWdodD0xMDBdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhclNpemU9MTBdIHNpemUgb2Ygc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbD0wXSBvZmZzZXQgb2YgaG9yaXpvbnRhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbD0wXSBvZmZzZXQgb2YgdmVydGljYWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnN0b3BQcm9wYWdhdGlvbj10cnVlXSBjYWxsIHN0b3BQcm9wYWdhdGlvbiBvbiBhbnkgZXZlbnRzIHRoYXQgaW1wYWN0IHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQ9MHhkZGRkZGRdIGJhY2tncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZEFscGhhPTFdIGFscGhhIG9mIGJhY2tncm91bmQgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZD0weDg4ODg4OF0gZm9yZWdyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kQWxwaGE9MV0gYWxwaGEgb2YgZm9yZWdyb3VuZCBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy51bmRlcmZsb3c9dG9wLWxlZnRdIHdoYXQgdG8gZG8gd2hlbiBjb250ZW50IHVuZGVyZmxvd3MgdGhlIHNjcm9sbGJveCBzaXplOiBub25lOiBkbyBub3RoaW5nOyAobGVmdC9yaWdodC9jZW50ZXIgQU5EIHRvcC9ib3R0b20vY2VudGVyKTsgT1IgY2VudGVyIChlLmcuLCAndG9wLWxlZnQnLCAnY2VudGVyJywgJ25vbmUnLCAnYm90dG9tcmlnaHQnKVxyXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxudW1iZXIpfSBbb3B0aW9ucy5mYWRlXSBmYWRlIHRoZSBzY3JvbGxiYXIgd2hlbiBub3QgaW4gdXNlICh0cnVlID0gMTAwMG1zKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmZhZGVXYWl0PTMwMDBdIHRpbWUgdG8gd2FpdCBiZWZvcmUgZmFkaW5nIHRoZSBzY3JvbGxiYXIgaWYgb3B0aW9ucy5mYWRlIGlzIHNldFxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfGZ1bmN0aW9uKX0gW29wdGlvbnMuZmFkZUVhc2U9ZWFzZUluT3V0U2luZV0gZWFzaW5nIGZ1bmN0aW9uIHRvIHVzZSBmb3IgZmFkaW5nXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMsIERFRkFVTFRTKVxyXG4gICAgICAgIHRoaXMuZWFzZSA9IG5ldyBFYXNlLmxpc3QoKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb250ZW50IGluIHBsYWNlZCBpbiBoZXJlXHJcbiAgICAgICAgICogeW91IGNhbiB1c2UgYW55IGZ1bmN0aW9uIGZyb20gcGl4aS12aWV3cG9ydCBvbiBjb250ZW50IHRvIG1hbnVhbGx5IG1vdmUgdGhlIGNvbnRlbnQgKHNlZSBodHRwczovL2RhdmlkZmlnLmdpdGh1Yi5pby9waXhpLXZpZXdwb3J0L2pzZG9jLylcclxuICAgICAgICAgKiBAdHlwZSB7UElYSS5leHRyYXMuVmlld3BvcnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5hZGRDaGlsZChuZXcgVmlld3BvcnQoeyBwYXNzaXZlV2hlZWw6IHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24sIHN0b3BQcm9wYWdhdGlvbjogdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiwgc2NyZWVuV2lkdGg6IHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgc2NyZWVuSGVpZ2h0OiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0IH0pKVxyXG4gICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAuZGVjZWxlcmF0ZSgpXHJcbiAgICAgICAgICAgIC5vbignbW92ZWQnLCAoKSA9PiB0aGlzLl9kcmF3U2Nyb2xsYmFycygpKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBncmFwaGljcyBlbGVtZW50IGZvciBkcmF3aW5nIHRoZSBzY3JvbGxiYXJzXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuR3JhcGhpY3N9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIub24oJ3BvaW50ZXJkb3duJywgdGhpcy5zY3JvbGxiYXJEb3duLCB0aGlzKVxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCB0aGlzLnNjcm9sbGJhck1vdmUsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVyY2FuY2VsJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVydXBvdXRzaWRlJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuR3JhcGhpY3MoKSlcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgaG9yaXpvbnRhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG9mZnNldCBvZiB2ZXJ0aWNhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhck9mZnNldFZlcnRpY2FsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkaXNhYmxlIHRoZSBzY3JvbGxib3ggKGlmIHNldCB0byB0cnVlIHRoaXMgd2lsbCBhbHNvIHJlbW92ZSB0aGUgbWFzaylcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZGlzYWJsZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkXHJcbiAgICB9XHJcbiAgICBzZXQgZGlzYWJsZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvblxyXG4gICAgfVxyXG4gICAgc2V0IHN0b3BQcm9wYWdhdGlvbih2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBkcmFnU2Nyb2xsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRyYWdTY3JvbGxcclxuICAgIH1cclxuICAgIHNldCBkcmFnU2Nyb2xsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsID0gdmFsdWVcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZHJhZygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb250ZW50LnJlbW92ZVBsdWdpbiAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVQbHVnaW4oJ2RyYWcnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnBsdWdpbnMucmVtb3ZlKCdkcmFnJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICB9XHJcbiAgICBzZXQgYm94V2lkdGgodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveFdpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuV2lkdGggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93XHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3codmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93ID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dYKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WFxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WSB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dZKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WVxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKSAtIHRoaXMgY2hhbmdlcyB0aGUgc2l6ZSBhbmQgbm90IHRoZSBzY2FsZSBvZiB0aGUgYm94XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgYm94SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgfVxyXG4gICAgc2V0IGJveEhlaWdodCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuSGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzY3JvbGxiYXIgc2l6ZSBpbiBwaXhlbHNcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJTaXplKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemVcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJTaXplKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50V2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94V2lkdGggLSAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodCAtICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZSB2ZXJ0aWNhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFyVmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFySG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdG9wIGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxUb3AoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQudG9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBsZWZ0IGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxMZWZ0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmxlZnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICogaWYgbm90IHNldCB0aGVuIGl0IHVzZXMgY29udGVudC53aWR0aCB0byBjYWxjdWxhdGUgd2lkdGhcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsV2lkdGggfHwgdGhpcy5jb250ZW50LndpZHRoXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsV2lkdGgodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsV2lkdGggPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICogaWYgbm90IHNldCB0aGVuIGl0IHVzZXMgY29udGVudC5oZWlnaHQgdG8gY2FsY3VsYXRlIGhlaWdodFxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsSGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsSGVpZ2h0IHx8IHRoaXMuY29udGVudC5oZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXdzIHNjcm9sbGJhcnNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJIb3Jpem9udGFsID0gdGhpcy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnID8gdHJ1ZSA6IFsnaGlkZGVuJywgJ25vbmUnXS5pbmRleE9mKHRoaXMub3ZlcmZsb3dYKSAhPT0gLTEgPyBmYWxzZSA6IHRoaXMuc2Nyb2xsV2lkdGggPiB0aGlzLm9wdGlvbnMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID0gdGhpcy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnID8gdHJ1ZSA6IFsnaGlkZGVuJywgJ25vbmUnXS5pbmRleE9mKHRoaXMub3ZlcmZsb3dZKSAhPT0gLTEgPyBmYWxzZSA6IHRoaXMuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmNsZWFyKClcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHt9XHJcbiAgICAgICAgb3B0aW9ucy5sZWZ0ID0gMFxyXG4gICAgICAgIG9wdGlvbnMucmlnaHQgPSB0aGlzLnNjcm9sbFdpZHRoICsgKHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgb3B0aW9ucy50b3AgPSAwXHJcbiAgICAgICAgb3B0aW9ucy5ib3R0b20gPSB0aGlzLnNjcm9sbEhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuc2Nyb2xsV2lkdGggKyAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuc2Nyb2xsSGVpZ2h0ICsgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyVG9wID0gKHRoaXMuY29udGVudC50b3AgLyBoZWlnaHQpICogdGhpcy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9IHRoaXMuc2Nyb2xsYmFyVG9wIDwgMCA/IDAgOiB0aGlzLnNjcm9sbGJhclRvcFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gKHRoaXMuYm94SGVpZ2h0IC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID4gdGhpcy5ib3hIZWlnaHQgPyB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyVG9wIDogdGhpcy5zY3JvbGxiYXJIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckxlZnQgPSAodGhpcy5jb250ZW50LmxlZnQgLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gdGhpcy5zY3JvbGxiYXJMZWZ0IDwgMCA/IDAgOiB0aGlzLnNjcm9sbGJhckxlZnRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gKHRoaXMuYm94V2lkdGggLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGggKyB0aGlzLnNjcm9sbGJhckxlZnQgPiB0aGlzLmJveFdpZHRoID8gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyTGVmdCA6IHRoaXMuc2Nyb2xsYmFyV2lkdGhcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQsIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kQWxwaGEpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCwgMCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQsIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kQWxwaGEpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QoMCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCwgdGhpcy5ib3hXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQsIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kQWxwaGEpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCwgdGhpcy5zY3JvbGxiYXJUb3AsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5zY3JvbGxiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuc2Nyb2xsYmFyTGVmdCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCwgdGhpcy5zY3JvbGxiYXJXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLmNvbnRlbnQuZm9yY2VIaXRBcmVhID0gbmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAgLCB0aGlzLmJveFdpZHRoLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICB0aGlzLmFjdGl2YXRlRmFkZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBtYXNrIGxheWVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd01hc2soKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50XHJcbiAgICAgICAgICAgIC5iZWdpbkZpbGwoMClcclxuICAgICAgICAgICAgLmRyYXdSZWN0KDAsIDAsIHRoaXMuYm94V2lkdGgsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCB3aGVuIHNjcm9sbGJveCBjb250ZW50IGNoYW5nZXNcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdTY3JvbGxiYXJzKClcclxuICAgICAgICAgICAgdGhpcy5fZHJhd01hc2soKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRyYWdTY3JvbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsICYmIHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/ICdhbGwnIDogdGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyAneCcgOiAneSdcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kcmFnKHsgY2xhbXBXaGVlbDogdHJ1ZSwgZGlyZWN0aW9uIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbGFtcCh7IGRpcmVjdGlvbiwgdW5kZXJmbG93OiB0aGlzLm9wdGlvbnMudW5kZXJmbG93IH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzaG93IHRoZSBzY3JvbGxiYXIgYW5kIHJlc3RhcnQgdGhlIHRpbWVyIGZvciBmYWRlIGlmIG9wdGlvbnMuZmFkZSBpcyBzZXRcclxuICAgICAqL1xyXG4gICAgYWN0aXZhdGVGYWRlKClcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZhZGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mYWRlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVhc2UucmVtb3ZlKHRoaXMuZmFkZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhci5hbHBoYSA9IDFcclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IHRoaXMub3B0aW9ucy5mYWRlID09PSB0cnVlID8gRkFERV9TQ1JPTExCQVJfVElNRSA6IHRoaXMub3B0aW9ucy5mYWRlXHJcbiAgICAgICAgICAgIHRoaXMuZmFkZSA9IHRoaXMuZWFzZS50byh0aGlzLnNjcm9sbGJhciwgeyBhbHBoYTogMCB9LCB0aW1lLCB7IHdhaXQ6IHRoaXMub3B0aW9ucy5mYWRlV2FpdCwgZWFzZTogdGhpcy5vcHRpb25zLmZhZGVFYXNlIH0pXHJcbiAgICAgICAgICAgIHRoaXMuZmFkZS5vbignZWFjaCcsICgpID0+IHRoaXMuY29udGVudC5kaXJ0eSA9IHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJEb3duKGUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+PSB0aGlzLnNjcm9sbGJhckxlZnQgJiYgbG9jYWwueCA8PSB0aGlzLnNjcm9sbGJhckxlZnQgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICdob3Jpem9udGFsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5zY3JvbGxiYXJMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPj0gdGhpcy5zY3JvbGxiYXJUb3AgJiYgbG9jYWwueSA8PSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ3ZlcnRpY2FsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5zY3JvbGxiYXJUb3ApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIG1vdmUgb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyTW92ZShlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ2hvcml6b250YWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gbG9jYWwueCAtIHRoaXMucG9pbnRlckRvd24ubGFzdC54XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gbG9jYWwueSAtIHRoaXMucG9pbnRlckRvd24ubGFzdC55XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyVXAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckRvd24gPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZXNpemUgdGhlIG1hc2sgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGhdIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94SGVpZ2h0XSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxXaWR0aF0gc2V0IHRoZSB3aWR0aCBvZiB0aGUgaW5zaWRlIG9mIHRoZSBzY3JvbGxib3ggKGxlYXZlIG51bGwgdG8gdXNlIGNvbnRlbnQud2lkdGgpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsSGVpZ2h0XSBzZXQgdGhlIGhlaWdodCBvZiB0aGUgaW5zaWRlIG9mIHRoZSBzY3JvbGxib3ggKGxlYXZlIG51bGwgdG8gdXNlIGNvbnRlbnQuaGVpZ2h0KVxyXG4gICAgICovXHJcbiAgICByZXNpemUob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB0eXBlb2Ygb3B0aW9ucy5ib3hXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveFdpZHRoIDogdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHR5cGVvZiBvcHRpb25zLmJveEhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveEhlaWdodCA6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICBpZiAob3B0aW9ucy5zY3JvbGxXaWR0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsV2lkdGggPSBvcHRpb25zLnNjcm9sbFdpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnNjcm9sbEhlaWdodClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gb3B0aW9ucy5zY3JvbGxIZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LnJlc2l6ZSh0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQsIHRoaXMuc2Nyb2xsV2lkdGgsIHRoaXMuc2Nyb2xsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVuc3VyZSB0aGF0IHRoZSBib3VuZGluZyBib3ggaXMgdmlzaWJsZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSByZWxhdGl2ZSB0byBjb250ZW50J3MgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqL1xyXG4gICAgZW5zdXJlVmlzaWJsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY29udGVudC5lbnN1cmVWaXNpYmxlKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoUElYSSAmJiBQSVhJLmV4dHJhcylcclxue1xyXG4gICAgUElYSS5leHRyYXMuU2Nyb2xsYm94ID0gU2Nyb2xsYm94XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsYm94Il19