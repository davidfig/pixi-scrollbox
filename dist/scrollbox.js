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
            this.content.forceHitArea = new PIXI.Rectangle(0, 0, options.right, options.bottom);
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

PIXI.extras.Scrollbox = Scrollbox;

module.exports = Scrollbox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiRWFzZSIsImRlZmF1bHRzIiwiREVGQVVMVFMiLCJGQURFX1NDUk9MTEJBUl9USU1FIiwiU2Nyb2xsYm94Iiwib3B0aW9ucyIsImVhc2UiLCJsaXN0IiwiY29udGVudCIsImFkZENoaWxkIiwicGFzc2l2ZVdoZWVsIiwic3RvcFByb3BhZ2F0aW9uIiwic2NyZWVuV2lkdGgiLCJib3hXaWR0aCIsInNjcmVlbkhlaWdodCIsImJveEhlaWdodCIsImRlY2VsZXJhdGUiLCJvbiIsIl9kcmF3U2Nyb2xsYmFycyIsInNjcm9sbGJhciIsIlBJWEkiLCJHcmFwaGljcyIsImludGVyYWN0aXZlIiwic2Nyb2xsYmFyRG93biIsInNjcm9sbGJhck1vdmUiLCJzY3JvbGxiYXJVcCIsIl9tYXNrQ29udGVudCIsInVwZGF0ZSIsIl9pc1Njcm9sbGJhckhvcml6b250YWwiLCJvdmVyZmxvd1giLCJpbmRleE9mIiwic2Nyb2xsV2lkdGgiLCJfaXNTY3JvbGxiYXJWZXJ0aWNhbCIsIm92ZXJmbG93WSIsInNjcm9sbEhlaWdodCIsImNsZWFyIiwibGVmdCIsInJpZ2h0Iiwic2Nyb2xsYmFyU2l6ZSIsInRvcCIsImJvdHRvbSIsImlzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIndpZHRoIiwiaXNTY3JvbGxiYXJWZXJ0aWNhbCIsImhlaWdodCIsInNjcm9sbGJhclRvcCIsInNjcm9sbGJhckhlaWdodCIsInNjcm9sbGJhckxlZnQiLCJzY3JvbGxiYXJXaWR0aCIsImJlZ2luRmlsbCIsInNjcm9sbGJhckJhY2tncm91bmQiLCJzY3JvbGxiYXJCYWNrZ3JvdW5kQWxwaGEiLCJkcmF3UmVjdCIsInNjcm9sbGJhck9mZnNldFZlcnRpY2FsIiwiZW5kRmlsbCIsInNjcm9sbGJhck9mZnNldEhvcml6b250YWwiLCJzY3JvbGxiYXJGb3JlZ3JvdW5kIiwic2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhIiwiZm9yY2VIaXRBcmVhIiwiUmVjdGFuZ2xlIiwiYWN0aXZhdGVGYWRlIiwibWFzayIsIl9kaXNhYmxlZCIsIl9kcmF3TWFzayIsImRyYWdTY3JvbGwiLCJkaXJlY3Rpb24iLCJkcmFnIiwiY2xhbXBXaGVlbCIsImNsYW1wIiwidW5kZXJmbG93IiwiZmFkZSIsInJlbW92ZSIsImFscGhhIiwidGltZSIsInRvIiwid2FpdCIsImZhZGVXYWl0IiwiZmFkZUVhc2UiLCJkaXJ0eSIsImUiLCJsb2NhbCIsInRvTG9jYWwiLCJkYXRhIiwiZ2xvYmFsIiwieSIsIngiLCJwb2ludGVyRG93biIsInR5cGUiLCJsYXN0Iiwid29ybGRTY3JlZW5XaWR0aCIsIndvcmxkU2NyZWVuSGVpZ2h0IiwicmVzaXplIiwiZW5zdXJlVmlzaWJsZSIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwib3ZlcmZsb3ciLCJfc2Nyb2xsV2lkdGgiLCJfc2Nyb2xsSGVpZ2h0IiwiQ29udGFpbmVyIiwiZXh0cmFzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLFdBQVdDLFFBQVEsZUFBUixDQUFqQjtBQUNBLElBQU1DLE9BQU9ELFFBQVEsV0FBUixDQUFiOztBQUVBLElBQU1FLFdBQVdGLFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1HLFdBQVdILFFBQVEsaUJBQVIsQ0FBakI7O0FBRUEsSUFBTUksc0JBQXNCLElBQTVCOztBQUVBOzs7O0lBR01DLFM7OztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLHVCQUFZQyxPQUFaLEVBQ0E7QUFBQTs7QUFBQTs7QUFFSSxjQUFLQSxPQUFMLEdBQWVKLFNBQVNJLE9BQVQsRUFBa0JILFFBQWxCLENBQWY7QUFDQSxjQUFLSSxJQUFMLEdBQVksSUFBSU4sS0FBS08sSUFBVCxFQUFaOztBQUVBOzs7OztBQUtBLGNBQUtDLE9BQUwsR0FBZSxNQUFLQyxRQUFMLENBQWMsSUFBSVgsUUFBSixDQUFhLEVBQUVZLGNBQWMsTUFBS0wsT0FBTCxDQUFhTSxl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S0csWUFBTCxHQUFvQkgsS0FBcEI7QUFDSDs7QUFFRDs7Ozs7Ozs0QkFLQTtBQUNJLG1CQUFPLEtBQUtJLGFBQUwsSUFBc0IsS0FBS3pGLE9BQUwsQ0FBYW9DLE1BQTFDO0FBQ0gsUzswQkFDZ0JpRCxLLEVBQ2pCO0FBQ0ksaUJBQUtJLGFBQUwsR0FBcUJKLEtBQXJCO0FBQ0g7Ozs7RUF0VG1CekUsS0FBSzhFLFM7O0FBc2pCN0I5RSxLQUFLK0UsTUFBTCxDQUFZL0YsU0FBWixHQUF3QkEsU0FBeEI7O0FBRUFnRyxPQUFPQyxPQUFQLEdBQWlCakcsU0FBakIiLCJmaWxlIjoic2Nyb2xsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVmlld3BvcnQgPSByZXF1aXJlKCdwaXhpLXZpZXdwb3J0JylcclxuY29uc3QgRWFzZSA9IHJlcXVpcmUoJ3BpeGktZWFzZScpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCBERUZBVUxUUyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMuanNvbicpXHJcblxyXG5jb25zdCBGQURFX1NDUk9MTEJBUl9USU1FID0gMTAwMFxyXG5cclxuLyoqXHJcbiAqIHBpeGkuanMgc2Nyb2xsYm94OiBhIG1hc2tlZCBjb250ZW50IGJveCB0aGF0IGNhbiBzY3JvbGwgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgd2l0aCBzY3JvbGxiYXJzXHJcbiAqL1xyXG5jbGFzcyBTY3JvbGxib3ggZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZHJhZ1Njcm9sbD10cnVlXSB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1g9YXV0b10gKG5vbmUsIHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dZPWF1dG9dIChub25lLCBzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93XSAobm9uZSwgc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoPTEwMF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHQ9MTAwXSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJTaXplPTEwXSBzaXplIG9mIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWw9MF0gb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWw9MF0gb2Zmc2V0IG9mIHZlcnRpY2FsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zdG9wUHJvcGFnYXRpb249dHJ1ZV0gY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kPTB4ZGRkZGRkXSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmRBbHBoYT0xXSBhbHBoYSBvZiBiYWNrZ3JvdW5kIG9mIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQ9MHg4ODg4ODhdIGZvcmVncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhPTFdIGFscGhhIG9mIGZvcmVncm91bmQgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMudW5kZXJmbG93PXRvcC1sZWZ0XSB3aGF0IHRvIGRvIHdoZW4gY29udGVudCB1bmRlcmZsb3dzIHRoZSBzY3JvbGxib3ggc2l6ZTogbm9uZTogZG8gbm90aGluZzsgKGxlZnQvcmlnaHQvY2VudGVyIEFORCB0b3AvYm90dG9tL2NlbnRlcik7IE9SIGNlbnRlciAoZS5nLiwgJ3RvcC1sZWZ0JywgJ2NlbnRlcicsICdub25lJywgJ2JvdHRvbXJpZ2h0JylcclxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58bnVtYmVyKX0gW29wdGlvbnMuZmFkZV0gZmFkZSB0aGUgc2Nyb2xsYmFyIHdoZW4gbm90IGluIHVzZSAodHJ1ZSA9IDEwMDBtcylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5mYWRlV2FpdD0zMDAwXSB0aW1lIHRvIHdhaXQgYmVmb3JlIGZhZGluZyB0aGUgc2Nyb2xsYmFyIGlmIG9wdGlvbnMuZmFkZSBpcyBzZXRcclxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xmdW5jdGlvbil9IFtvcHRpb25zLmZhZGVFYXNlPWVhc2VJbk91dFNpbmVdIGVhc2luZyBmdW5jdGlvbiB0byB1c2UgZm9yIGZhZGluZ1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuICAgICAgICB0aGlzLmVhc2UgPSBuZXcgRWFzZS5saXN0KClcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIHlvdSBjYW4gdXNlIGFueSBmdW5jdGlvbiBmcm9tIHBpeGktdmlld3BvcnQgb24gY29udGVudCB0byBtYW51YWxseSBtb3ZlIHRoZSBjb250ZW50IChzZWUgaHR0cHM6Ly9kYXZpZGZpZy5naXRodWIuaW8vcGl4aS12aWV3cG9ydC9qc2RvYy8pXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuZXh0cmFzLlZpZXdwb3J0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFZpZXdwb3J0KHsgcGFzc2l2ZVdoZWVsOiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uLCBzdG9wUHJvcGFnYXRpb246IHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24sIHNjcmVlbldpZHRoOiB0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHNjcmVlbkhlaWdodDogdGhpcy5vcHRpb25zLmJveEhlaWdodCB9KSlcclxuICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgLmRlY2VsZXJhdGUoKVxyXG4gICAgICAgICAgICAub24oJ21vdmVkJywgKCkgPT4gdGhpcy5fZHJhd1Njcm9sbGJhcnMoKSlcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ3JhcGhpY3MgZWxlbWVudCBmb3IgZHJhd2luZyB0aGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkdyYXBoaWNzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLm9uKCdwb2ludGVyZG93bicsIHRoaXMuc2Nyb2xsYmFyRG93biwgdGhpcylcclxuICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgdGhpcy5zY3JvbGxiYXJNb3ZlLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcmNhbmNlbCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwb3V0c2lkZScsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgdmVydGljYWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZGlzYWJsZSB0aGUgc2Nyb2xsYm94IChpZiBzZXQgdG8gdHJ1ZSB0aGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hc2spXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGRpc2FibGUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZFxyXG4gICAgfVxyXG4gICAgc2V0IGRpc2FibGUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWVcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb25cclxuICAgIH1cclxuICAgIHNldCBzdG9wUHJvcGFnYXRpb24odmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZHJhZ1Njcm9sbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsXHJcbiAgICB9XHJcbiAgICBzZXQgZHJhZ1Njcm9sbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbCA9IHZhbHVlXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmRyYWcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlUGx1Z2luKCdkcmFnJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKS0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IGJveFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbldpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvdygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1xyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvdyA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1hcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1godmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1lcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1kodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSkgLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBib3hIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbkhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2Nyb2xsYmFyIHNpemUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyU2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyU2l6ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoIC0gKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgLSAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhclZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhckhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvcCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsVG9wKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnRvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbGVmdCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsTGVmdCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZWZ0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqIGlmIG5vdCBzZXQgdGhlbiBpdCB1c2VzIGNvbnRlbnQud2lkdGggdG8gY2FsY3VsYXRlIHdpZHRoXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbFdpZHRoIHx8IHRoaXMuY29udGVudC53aWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbFdpZHRoID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqIGlmIG5vdCBzZXQgdGhlbiBpdCB1c2VzIGNvbnRlbnQuaGVpZ2h0IHRvIGNhbGN1bGF0ZSBoZWlnaHRcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbEhlaWdodCB8fCB0aGlzLmNvbnRlbnQuaGVpZ2h0XHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsSGVpZ2h0KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbEhlaWdodCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBzY3JvbGxiYXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCA9IHRoaXMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyA/IHRydWUgOiBbJ2hpZGRlbicsICdub25lJ10uaW5kZXhPZih0aGlzLm92ZXJmbG93WCkgIT09IC0xID8gZmFsc2UgOiB0aGlzLnNjcm9sbFdpZHRoID4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA9IHRoaXMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyA/IHRydWUgOiBbJ2hpZGRlbicsICdub25lJ10uaW5kZXhPZih0aGlzLm92ZXJmbG93WSkgIT09IC0xID8gZmFsc2UgOiB0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5jbGVhcigpXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7fVxyXG4gICAgICAgIG9wdGlvbnMubGVmdCA9IDBcclxuICAgICAgICBvcHRpb25zLnJpZ2h0ID0gdGhpcy5zY3JvbGxXaWR0aCArICh0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIG9wdGlvbnMudG9wID0gMFxyXG4gICAgICAgIG9wdGlvbnMuYm90dG9tID0gdGhpcy5zY3JvbGxIZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLnNjcm9sbFdpZHRoICsgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnNjcm9sbEhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9ICh0aGlzLmNvbnRlbnQudG9wIC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSB0aGlzLnNjcm9sbGJhclRvcCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJUb3BcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckhlaWdodCA9ICh0aGlzLmJveEhlaWdodCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhckhlaWdodCA+IHRoaXMuYm94SGVpZ2h0ID8gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclRvcCA6IHRoaXMuc2Nyb2xsYmFySGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gKHRoaXMuY29udGVudC5sZWZ0IC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGVmdCA9IHRoaXMuc2Nyb2xsYmFyTGVmdCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJMZWZ0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9ICh0aGlzLmJveFdpZHRoIC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoICsgdGhpcy5zY3JvbGxiYXJMZWZ0ID4gdGhpcy5ib3hXaWR0aCA/IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhckxlZnQgOiB0aGlzLnNjcm9sbGJhcldpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIDAsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KDAsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuYm94V2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZEFscGhhKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIHRoaXMuc2Nyb2xsYmFyVG9wLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZCwgdGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmRBbHBoYSlcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLnNjcm9sbGJhckxlZnQsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuc2Nyb2xsYmFyV2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmZvcmNlSGl0QXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCBvcHRpb25zLnJpZ2h0LCBvcHRpb25zLmJvdHRvbSlcclxuICAgICAgICB0aGlzLmFjdGl2YXRlRmFkZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBtYXNrIGxheWVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd01hc2soKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50XHJcbiAgICAgICAgICAgIC5iZWdpbkZpbGwoMClcclxuICAgICAgICAgICAgLmRyYXdSZWN0KDAsIDAsIHRoaXMuYm94V2lkdGgsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCB3aGVuIHNjcm9sbGJveCBjb250ZW50IGNoYW5nZXNcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdTY3JvbGxiYXJzKClcclxuICAgICAgICAgICAgdGhpcy5fZHJhd01hc2soKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRyYWdTY3JvbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsICYmIHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/ICdhbGwnIDogdGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyAneCcgOiAneSdcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kcmFnKHsgY2xhbXBXaGVlbDogdHJ1ZSwgZGlyZWN0aW9uIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbGFtcCh7IGRpcmVjdGlvbiwgdW5kZXJmbG93OiB0aGlzLm9wdGlvbnMudW5kZXJmbG93IH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzaG93IHRoZSBzY3JvbGxiYXIgYW5kIHJlc3RhcnQgdGhlIHRpbWVyIGZvciBmYWRlIGlmIG9wdGlvbnMuZmFkZSBpcyBzZXRcclxuICAgICAqL1xyXG4gICAgYWN0aXZhdGVGYWRlKClcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZhZGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mYWRlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVhc2UucmVtb3ZlKHRoaXMuZmFkZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhci5hbHBoYSA9IDFcclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IHRoaXMub3B0aW9ucy5mYWRlID09PSB0cnVlID8gRkFERV9TQ1JPTExCQVJfVElNRSA6IHRoaXMub3B0aW9ucy5mYWRlXHJcbiAgICAgICAgICAgIHRoaXMuZmFkZSA9IHRoaXMuZWFzZS50byh0aGlzLnNjcm9sbGJhciwgeyBhbHBoYTogMCB9LCB0aW1lLCB7IHdhaXQ6IHRoaXMub3B0aW9ucy5mYWRlV2FpdCwgZWFzZTogdGhpcy5vcHRpb25zLmZhZGVFYXNlIH0pXHJcbiAgICAgICAgICAgIHRoaXMuZmFkZS5vbignZWFjaCcsICgpID0+IHRoaXMuY29udGVudC5kaXJ0eSA9IHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJEb3duKGUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+PSB0aGlzLnNjcm9sbGJhckxlZnQgJiYgbG9jYWwueCA8PSB0aGlzLnNjcm9sbGJhckxlZnQgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICdob3Jpem9udGFsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5zY3JvbGxiYXJMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPj0gdGhpcy5zY3JvbGxiYXJUb3AgJiYgbG9jYWwueSA8PSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ3ZlcnRpY2FsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5zY3JvbGxiYXJUb3ApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIG1vdmUgb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyTW92ZShlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ2hvcml6b250YWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gbG9jYWwueCAtIHRoaXMucG9pbnRlckRvd24ubGFzdC54XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gbG9jYWwueSAtIHRoaXMucG9pbnRlckRvd24ubGFzdC55XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyVXAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckRvd24gPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZXNpemUgdGhlIG1hc2sgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGhdIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94SGVpZ2h0XSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxXaWR0aF0gc2V0IHRoZSB3aWR0aCBvZiB0aGUgaW5zaWRlIG9mIHRoZSBzY3JvbGxib3ggKGxlYXZlIG51bGwgdG8gdXNlIGNvbnRlbnQud2lkdGgpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsSGVpZ2h0XSBzZXQgdGhlIGhlaWdodCBvZiB0aGUgaW5zaWRlIG9mIHRoZSBzY3JvbGxib3ggKGxlYXZlIG51bGwgdG8gdXNlIGNvbnRlbnQuaGVpZ2h0KVxyXG4gICAgICovXHJcbiAgICByZXNpemUob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB0eXBlb2Ygb3B0aW9ucy5ib3hXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveFdpZHRoIDogdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHR5cGVvZiBvcHRpb25zLmJveEhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveEhlaWdodCA6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICBpZiAob3B0aW9ucy5zY3JvbGxXaWR0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsV2lkdGggPSBvcHRpb25zLnNjcm9sbFdpZHRoXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnNjcm9sbEhlaWdodClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gb3B0aW9ucy5zY3JvbGxIZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LnJlc2l6ZSh0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQsIHRoaXMuc2Nyb2xsV2lkdGgsIHRoaXMuc2Nyb2xsSGVpZ2h0KVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVuc3VyZSB0aGF0IHRoZSBib3VuZGluZyBib3ggaXMgdmlzaWJsZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSByZWxhdGl2ZSB0byBjb250ZW50J3MgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqL1xyXG4gICAgZW5zdXJlVmlzaWJsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY29udGVudC5lbnN1cmVWaXNpYmxlKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgfVxyXG59XHJcblxyXG5QSVhJLmV4dHJhcy5TY3JvbGxib3ggPSBTY3JvbGxib3hcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsYm94Il19