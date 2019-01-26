'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Viewport = require('pixi-viewport');
var Ease = require('pixi-ease');

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
            this.content.forceHitArea = new PIXI.Rectangle(0, 0, this.boxWidth, this.boxHeight);
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
                this.content.removePlugin('drag');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiRWFzZSIsImRlZmF1bHRzIiwiREVGQVVMVFMiLCJGQURFX1NDUk9MTEJBUl9USU1FIiwiU2Nyb2xsYm94Iiwib3B0aW9ucyIsImVhc2UiLCJsaXN0IiwiY29udGVudCIsImFkZENoaWxkIiwicGFzc2l2ZVdoZWVsIiwic3RvcFByb3BhZ2F0aW9uIiwic2NyZWVuV2lkdGgiLCJib3hXaWR0aCIsInNjcmVlbkhlaWdodCIsImJveEhlaWdodCIsImRlY2VsZXJhdGUiLCJvbiIsIl9kcmF3U2Nyb2xsYmFycyIsInNjcm9sbGJhciIsIlBJWEkiLCJHcmFwaGljcyIsImludGVyYWN0aXZlIiwic2Nyb2xsYmFyRG93biIsInNjcm9sbGJhck1vdmUiLCJzY3JvbGxiYXJVcCIsIl9tYXNrQ29udGVudCIsInVwZGF0ZSIsIl9pc1Njcm9sbGJhckhvcml6b250YWwiLCJvdmVyZmxvd1giLCJpbmRleE9mIiwic2Nyb2xsV2lkdGgiLCJfaXNTY3JvbGxiYXJWZXJ0aWNhbCIsIm92ZXJmbG93WSIsInNjcm9sbEhlaWdodCIsImNsZWFyIiwibGVmdCIsInJpZ2h0Iiwic2Nyb2xsYmFyU2l6ZSIsInRvcCIsImJvdHRvbSIsImlzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIndpZHRoIiwiaXNTY3JvbGxiYXJWZXJ0aWNhbCIsImhlaWdodCIsInNjcm9sbGJhclRvcCIsInNjcm9sbGJhckhlaWdodCIsInNjcm9sbGJhckxlZnQiLCJzY3JvbGxiYXJXaWR0aCIsImJlZ2luRmlsbCIsInNjcm9sbGJhckJhY2tncm91bmQiLCJzY3JvbGxiYXJCYWNrZ3JvdW5kQWxwaGEiLCJkcmF3UmVjdCIsInNjcm9sbGJhck9mZnNldFZlcnRpY2FsIiwiZW5kRmlsbCIsInNjcm9sbGJhck9mZnNldEhvcml6b250YWwiLCJzY3JvbGxiYXJGb3JlZ3JvdW5kIiwic2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhIiwiZm9yY2VIaXRBcmVhIiwiUmVjdGFuZ2xlIiwiYWN0aXZhdGVGYWRlIiwibWFzayIsIl9kaXNhYmxlZCIsIl9kcmF3TWFzayIsImRyYWdTY3JvbGwiLCJkaXJlY3Rpb24iLCJkcmFnIiwiY2xhbXBXaGVlbCIsImNsYW1wIiwidW5kZXJmbG93IiwiZmFkZSIsInJlbW92ZSIsImFscGhhIiwidGltZSIsInRvIiwid2FpdCIsImZhZGVXYWl0IiwiZmFkZUVhc2UiLCJkaXJ0eSIsImUiLCJsb2NhbCIsInRvTG9jYWwiLCJkYXRhIiwiZ2xvYmFsIiwieSIsIngiLCJwb2ludGVyRG93biIsInR5cGUiLCJsYXN0Iiwid29ybGRTY3JlZW5XaWR0aCIsIndvcmxkU2NyZWVuSGVpZ2h0IiwicmVzaXplIiwiZW5zdXJlVmlzaWJsZSIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwib3ZlcmZsb3ciLCJfc2Nyb2xsV2lkdGgiLCJfc2Nyb2xsSGVpZ2h0IiwiQ29udGFpbmVyIiwiZXh0cmFzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLFdBQVdDLFFBQVEsZUFBUixDQUFqQjtBQUNBLElBQU1DLE9BQU9ELFFBQVEsV0FBUixDQUFiOztBQUVBLElBQU1FLFdBQVdGLFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1HLFdBQVdILFFBQVEsaUJBQVIsQ0FBakI7O0FBRUEsSUFBTUksc0JBQXNCLElBQTVCOztBQUVBOzs7O0lBR01DLFM7OztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLHVCQUFZQyxPQUFaLEVBQ0E7QUFBQTs7QUFBQTs7QUFFSSxjQUFLQSxPQUFMLEdBQWVKLFNBQVNJLE9BQVQsRUFBa0JILFFBQWxCLENBQWY7QUFDQSxjQUFLSSxJQUFMLEdBQVksSUFBSU4sS0FBS08sSUFBVCxFQUFaOztBQUVBOzs7OztBQUtBLGNBQUtDLE9BQUwsR0FBZSxNQUFLQyxRQUFMLENBQWMsSUFBSVgsUUFBSixDQUFhLEVBQUVZLGNBQWMsTUFBS0wsT0FBTCxDQUFhTSxl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QUwsR0FBb0JILEtBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs7NEJBS0E7QUFDSSxtQkFBTyxLQUFLSSxhQUFMLElBQXNCLEtBQUt6RixPQUFMLENBQWFvQyxNQUExQztBQUNILFM7MEJBQ2dCaUQsSyxFQUNqQjtBQUNJLGlCQUFLSSxhQUFMLEdBQXFCSixLQUFyQjtBQUNIOzs7O0VBdFRtQnpFLEtBQUs4RSxTOztBQXNqQjdCLElBQUk5RSxRQUFRQSxLQUFLK0UsTUFBakIsRUFDQTtBQUNJL0UsU0FBSytFLE1BQUwsQ0FBWS9GLFNBQVosR0FBd0JBLFNBQXhCO0FBQ0g7O0FBRURnRyxPQUFPQyxPQUFQLEdBQWlCakcsU0FBakIiLCJmaWxlIjoic2Nyb2xsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVmlld3BvcnQgPSByZXF1aXJlKCdwaXhpLXZpZXdwb3J0JylcclxuY29uc3QgRWFzZSA9IHJlcXVpcmUoJ3BpeGktZWFzZScpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCBERUZBVUxUUyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMuanNvbicpXHJcblxyXG5jb25zdCBGQURFX1NDUk9MTEJBUl9USU1FID0gMTAwMFxyXG5cclxuLyoqXHJcbiAqIHBpeGkuanMgc2Nyb2xsYm94OiBhIG1hc2tlZCBjb250ZW50IGJveCB0aGF0IGNhbiBzY3JvbGwgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgd2l0aCBzY3JvbGxiYXJzXHJcbiAqL1xyXG5jbGFzcyBTY3JvbGxib3ggZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZHJhZ1Njcm9sbD10cnVlXSB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1g9YXV0b10gKG5vbmUsIHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dZPWF1dG9dIChub25lLCBzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93XSAobm9uZSwgc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoPTEwMF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHQ9MTAwXSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJTaXplPTEwXSBzaXplIG9mIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWw9MF0gb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWw9MF0gb2Zmc2V0IG9mIHZlcnRpY2FsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zdG9wUHJvcGFnYXRpb249dHJ1ZV0gY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kPTB4ZGRkZGRkXSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmRBbHBoYT0xXSBhbHBoYSBvZiBiYWNrZ3JvdW5kIG9mIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQ9MHg4ODg4ODhdIGZvcmVncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhPTFdIGFscGhhIG9mIGZvcmVncm91bmQgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMudW5kZXJmbG93PXRvcC1sZWZ0XSB3aGF0IHRvIGRvIHdoZW4gY29udGVudCB1bmRlcmZsb3dzIHRoZSBzY3JvbGxib3ggc2l6ZTogbm9uZTogZG8gbm90aGluZzsgKGxlZnQvcmlnaHQvY2VudGVyIEFORCB0b3AvYm90dG9tL2NlbnRlcik7IE9SIGNlbnRlciAoZS5nLiwgJ3RvcC1sZWZ0JywgJ2NlbnRlcicsICdub25lJywgJ2JvdHRvbXJpZ2h0JylcclxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58bnVtYmVyKX0gW29wdGlvbnMuZmFkZV0gZmFkZSB0aGUgc2Nyb2xsYmFyIHdoZW4gbm90IGluIHVzZSAodHJ1ZSA9IDEwMDBtcylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5mYWRlV2FpdD0zMDAwXSB0aW1lIHRvIHdhaXQgYmVmb3JlIGZhZGluZyB0aGUgc2Nyb2xsYmFyIGlmIG9wdGlvbnMuZmFkZSBpcyBzZXRcclxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xmdW5jdGlvbil9IFtvcHRpb25zLmZhZGVFYXNlPWVhc2VJbk91dFNpbmVdIGVhc2luZyBmdW5jdGlvbiB0byB1c2UgZm9yIGZhZGluZ1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuICAgICAgICB0aGlzLmVhc2UgPSBuZXcgRWFzZS5saXN0KClcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIHlvdSBjYW4gdXNlIGFueSBmdW5jdGlvbiBmcm9tIHBpeGktdmlld3BvcnQgb24gY29udGVudCB0byBtYW51YWxseSBtb3ZlIHRoZSBjb250ZW50IChzZWUgaHR0cHM6Ly9kYXZpZGZpZy5naXRodWIuaW8vcGl4aS12aWV3cG9ydC9qc2RvYy8pXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuZXh0cmFzLlZpZXdwb3J0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFZpZXdwb3J0KHsgcGFzc2l2ZVdoZWVsOiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uLCBzdG9wUHJvcGFnYXRpb246IHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24sIHNjcmVlbldpZHRoOiB0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHNjcmVlbkhlaWdodDogdGhpcy5vcHRpb25zLmJveEhlaWdodCB9KSlcclxuICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgLmRlY2VsZXJhdGUoKVxyXG4gICAgICAgICAgICAub24oJ21vdmVkJywgKCkgPT4gdGhpcy5fZHJhd1Njcm9sbGJhcnMoKSlcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ3JhcGhpY3MgZWxlbWVudCBmb3IgZHJhd2luZyB0aGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkdyYXBoaWNzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLm9uKCdwb2ludGVyZG93bicsIHRoaXMuc2Nyb2xsYmFyRG93biwgdGhpcylcclxuICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgdGhpcy5zY3JvbGxiYXJNb3ZlLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcmNhbmNlbCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwb3V0c2lkZScsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgdmVydGljYWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZGlzYWJsZSB0aGUgc2Nyb2xsYm94IChpZiBzZXQgdG8gdHJ1ZSB0aGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hc2spXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGRpc2FibGUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZFxyXG4gICAgfVxyXG4gICAgc2V0IGRpc2FibGUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWVcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb25cclxuICAgIH1cclxuICAgIHNldCBzdG9wUHJvcGFnYXRpb24odmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZHJhZ1Njcm9sbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsXHJcbiAgICB9XHJcbiAgICBzZXQgZHJhZ1Njcm9sbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbCA9IHZhbHVlXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmRyYWcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlUGx1Z2luKCdkcmFnJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKS0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IGJveFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbldpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvdygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1xyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvdyA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1hcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1godmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1lcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1kodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSkgLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBib3hIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbkhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2Nyb2xsYmFyIHNpemUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyU2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyU2l6ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoIC0gKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgLSAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhclZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhckhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvcCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsVG9wKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnRvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbGVmdCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsTGVmdCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZWZ0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqIGlmIG5vdCBzZXQgdGhlbiBpdCB1c2VzIGNvbnRlbnQud2lkdGggdG8gY2FsY3VsYXRlIHdpZHRoXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbFdpZHRoIHx8IHRoaXMuY29udGVudC53aWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbFdpZHRoID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqIGlmIG5vdCBzZXQgdGhlbiBpdCB1c2VzIGNvbnRlbnQuaGVpZ2h0IHRvIGNhbGN1bGF0ZSBoZWlnaHRcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbEhlaWdodCB8fCB0aGlzLmNvbnRlbnQuaGVpZ2h0XHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsSGVpZ2h0KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbEhlaWdodCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBzY3JvbGxiYXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCA9IHRoaXMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyA/IHRydWUgOiBbJ2hpZGRlbicsICdub25lJ10uaW5kZXhPZih0aGlzLm92ZXJmbG93WCkgIT09IC0xID8gZmFsc2UgOiB0aGlzLnNjcm9sbFdpZHRoID4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA9IHRoaXMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyA/IHRydWUgOiBbJ2hpZGRlbicsICdub25lJ10uaW5kZXhPZih0aGlzLm92ZXJmbG93WSkgIT09IC0xID8gZmFsc2UgOiB0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5jbGVhcigpXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7fVxyXG4gICAgICAgIG9wdGlvbnMubGVmdCA9IDBcclxuICAgICAgICBvcHRpb25zLnJpZ2h0ID0gdGhpcy5zY3JvbGxXaWR0aCArICh0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIG9wdGlvbnMudG9wID0gMFxyXG4gICAgICAgIG9wdGlvbnMuYm90dG9tID0gdGhpcy5zY3JvbGxIZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLnNjcm9sbFdpZHRoICsgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnNjcm9sbEhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9ICh0aGlzLmNvbnRlbnQudG9wIC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSB0aGlzLnNjcm9sbGJhclRvcCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJUb3BcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckhlaWdodCA9ICh0aGlzLmJveEhlaWdodCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhckhlaWdodCA+IHRoaXMuYm94SGVpZ2h0ID8gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclRvcCA6IHRoaXMuc2Nyb2xsYmFySGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gKHRoaXMuY29udGVudC5sZWZ0IC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGVmdCA9IHRoaXMuc2Nyb2xsYmFyTGVmdCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJMZWZ0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9ICh0aGlzLmJveFdpZHRoIC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoICsgdGhpcy5zY3JvbGxiYXJMZWZ0ID4gdGhpcy5ib3hXaWR0aCA/IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhckxlZnQgOiB0aGlzLnNjcm9sbGJhcldpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIDAsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KDAsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuYm94V2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIHRoaXMuc2Nyb2xsYmFyVG9wLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZCwgdGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmRBbHBoYSlcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLnNjcm9sbGJhckxlZnQsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuc2Nyb2xsYmFyV2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmZvcmNlSGl0QXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwICwgdGhpcy5ib3hXaWR0aCwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZUZhZGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhd3MgbWFzayBsYXllclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYXdNYXNrKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgICAgICAgICAuYmVnaW5GaWxsKDApXHJcbiAgICAgICAgICAgIC5kcmF3UmVjdCgwLCAwLCB0aGlzLmJveFdpZHRoLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIHRoaXMuY29udGVudC5tYXNrID0gdGhpcy5fbWFza0NvbnRlbnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgd2hlbiBzY3JvbGxib3ggY29udGVudCBjaGFuZ2VzXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSBudWxsXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQuY2xlYXIoKVxyXG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdNYXNrKClcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCAmJiB0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyAnYWxsJyA6IHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gJ3gnIDogJ3knXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHJhZyh7IGNsYW1wV2hlZWw6IHRydWUsIGRpcmVjdGlvbiB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xhbXAoeyBkaXJlY3Rpb24sIHVuZGVyZmxvdzogdGhpcy5vcHRpb25zLnVuZGVyZmxvdyB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2hvdyB0aGUgc2Nyb2xsYmFyIGFuZCByZXN0YXJ0IHRoZSB0aW1lciBmb3IgZmFkZSBpZiBvcHRpb25zLmZhZGUgaXMgc2V0XHJcbiAgICAgKi9cclxuICAgIGFjdGl2YXRlRmFkZSgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5mYWRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmFkZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYXNlLnJlbW92ZSh0aGlzLmZhZGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXIuYWxwaGEgPSAxXHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSA/IEZBREVfU0NST0xMQkFSX1RJTUUgOiB0aGlzLm9wdGlvbnMuZmFkZVxyXG4gICAgICAgICAgICB0aGlzLmZhZGUgPSB0aGlzLmVhc2UudG8odGhpcy5zY3JvbGxiYXIsIHsgYWxwaGE6IDAgfSwgdGltZSwgeyB3YWl0OiB0aGlzLm9wdGlvbnMuZmFkZVdhaXQsIGVhc2U6IHRoaXMub3B0aW9ucy5mYWRlRWFzZSB9KVxyXG4gICAgICAgICAgICB0aGlzLmZhZGUub24oJ2VhY2gnLCAoKSA9PiB0aGlzLmNvbnRlbnQuZGlydHkgPSB0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyRG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPj0gdGhpcy5zY3JvbGxiYXJMZWZ0ICYmIGxvY2FsLnggPD0gdGhpcy5zY3JvbGxiYXJMZWZ0ICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAnaG9yaXpvbnRhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuc2Nyb2xsYmFyTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID49IHRoaXMuc2Nyb2xsYmFyVG9wICYmIGxvY2FsLnkgPD0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICd2ZXJ0aWNhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuc2Nyb2xsYmFyVG9wKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wIC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBtb3ZlIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhck1vdmUoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICdob3Jpem9udGFsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IGxvY2FsLnggLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IGxvY2FsLnkgLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhclVwKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVzaXplIHRoZSBtYXNrIGZvciB0aGUgY29udGFpbmVyXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoXSB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveEhlaWdodF0gaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsV2lkdGhdIHNldCB0aGUgd2lkdGggb2YgdGhlIGluc2lkZSBvZiB0aGUgc2Nyb2xsYm94IChsZWF2ZSBudWxsIHRvIHVzZSBjb250ZW50LndpZHRoKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbEhlaWdodF0gc2V0IHRoZSBoZWlnaHQgb2YgdGhlIGluc2lkZSBvZiB0aGUgc2Nyb2xsYm94IChsZWF2ZSBudWxsIHRvIHVzZSBjb250ZW50LmhlaWdodClcclxuICAgICAqL1xyXG4gICAgcmVzaXplKG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveFdpZHRoID0gdHlwZW9mIG9wdGlvbnMuYm94V2lkdGggIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5ib3hXaWR0aCA6IHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgPSB0eXBlb2Ygb3B0aW9ucy5ib3hIZWlnaHQgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5ib3hIZWlnaHQgOiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc2Nyb2xsV2lkdGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFdpZHRoID0gb3B0aW9ucy5zY3JvbGxXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5zY3JvbGxIZWlnaHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCA9IG9wdGlvbnMuc2Nyb2xsSGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5yZXNpemUodGhpcy5vcHRpb25zLmJveFdpZHRoLCB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0LCB0aGlzLnNjcm9sbFdpZHRoLCB0aGlzLnNjcm9sbEhlaWdodClcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBlbnN1cmUgdGhhdCB0aGUgYm91bmRpbmcgYm94IGlzIHZpc2libGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gcmVsYXRpdmUgdG8gY29udGVudCdzIGNvb3JkaW5hdGUgc3lzdGVtXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgKi9cclxuICAgIGVuc3VyZVZpc2libGUoeCwgeSwgd2lkdGgsIGhlaWdodClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQuZW5zdXJlVmlzaWJsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuX2RyYXdTY3JvbGxiYXJzKClcclxuICAgIH1cclxufVxyXG5cclxuaWYgKFBJWEkgJiYgUElYSS5leHRyYXMpXHJcbntcclxuICAgIFBJWEkuZXh0cmFzLlNjcm9sbGJveCA9IFNjcm9sbGJveFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbGJveCJdfQ==