'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Viewport = require('pixi-viewport');

var defaults = require('./defaults');
var DEFAULTS = require('./defaults.json');

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */

var Scrollbox = function (_PIXI$Container) {
    _inherits(Scrollbox, _PIXI$Container);

    /**
     * create a scrollbox
     * @param {object} options
     * @param {boolean} [options.dragScroll=true] user may drag the content area to scroll content
     * @param {string} [options.overflowX=auto] (scroll, hidden, auto) this changes whether the scrollbar is shown
     * @param {string} [options.overflowY=auto] (scroll, hidden, auto) this changes whether the scrollbar is shown
     * @param {string} [options.overflow] (scroll, hidden, auto) sets overflowX and overflowY to this value
     * @param {number} [options.boxWidth=100] width of scrollbox including scrollbar (in pixels)
     * @param {number} [options.boxHeight=100] height of scrollbox including scrollbar (in pixels)
     * @param {number} [options.scrollbarSize=10] size of scrollbar (in pixels)
     * @param {number} [options.scrollbarOffsetHorizontal=0] offset of horizontal scrollbar (in pixels)
     * @param {number} [options.scrollbarOffsetVertical=0] offset of vertical scrollbar (in pixels)
     * @param {boolean} [options.stopPropagation=true] call stopPropagation on any events that impact scrollbox
     * @param {number} [options.scrollbarBackground=0xdddddd] background color of scrollbar
     * @param {number} [options.scrollbarForeground=0x888888] foreground color of scrollbar
     */
    function Scrollbox(options) {
        _classCallCheck(this, Scrollbox);

        var _this = _possibleConstructorReturn(this, (Scrollbox.__proto__ || Object.getPrototypeOf(Scrollbox)).call(this));

        _this.options = defaults(options, DEFAULTS);

        /**
         * content in placed in here
         * @type {PIXI.Container}
         */
        _this.content = _this.addChild(new Viewport({ stopPropagation: _this.options.stopPropagation, screenWidth: _this.options.boxWidth, screenHeight: _this.options.boxHeight }));
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
            this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : this.overflowX === 'hidden' ? false : this.content.width > this.options.boxWidth;
            this._isScrollbarVertical = this.overflowY === 'scroll' ? true : this.overflowY === 'hidden' ? false : this.content.height > this.options.boxHeight;
            this.scrollbar.clear();
            var options = {};
            options.left = 0;
            options.right = this.content.width + (this._isScrollbarVertical ? this.options.scrollbarSize : 0);
            options.top = 0;
            options.bottom = this.content.height + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
            var width = this.content.width + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
            var height = this.content.height + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
            this.scrollbarTop = this.content.top / height * this.boxHeight;
            this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop;
            this.scrollbarHeight = this.boxHeight / height * this.boxHeight;
            this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight;
            this.scrollbarLeft = this.content.left / width * this.boxWidth;
            this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft;
            this.scrollbarWidth = this.boxWidth / width * this.boxWidth;
            this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth;
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarBackground).drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, 0, this.scrollbarSize, this.boxHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarBackground).drawRect(0, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.boxWidth, this.scrollbarSize).endFill();
            }
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarForeground).drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarForeground).drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.scrollbarWidth, this.scrollbarSize).endFill();
            }
            this.content.clamp({ direction: 'all' });
            this.content.forceHitArea = new PIXI.Rectangle(0, 0, options.right, options.bottom);
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
                    var direction = this.options.overflowX !== 'hidden' && this.options.overflowY !== 'hidden' ? 'all' : this.options.overflowX !== 'hidden' ? 'x' : this.options.overflowY !== 'hidden' ? 'y' : null;
                    if (direction !== null) {
                        this.content.drag({ clampWheel: true, direction: direction });
                    }
                }
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
         */

    }, {
        key: 'resize',
        value: function resize(options) {
            this.options.boxWidth = typeof options.boxWidth !== 'undefined' ? options.boxWidth : this.options.boxWidth;
            this.options.boxHeight = typeof options.boxHeight !== 'undefined' ? options.boxHeight : this.options.boxHeight;
            this.content.resize(this.options.boxWidth, this.options.boxHeight);
            this.update();
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
         */

    }, {
        key: 'scrollWidth',
        get: function get() {
            return this.content.width;
        }

        /**
         * height of content area
         */

    }, {
        key: 'scrollHeight',
        get: function get() {
            return this.content.height;
        }
    }]);

    return Scrollbox;
}(PIXI.Container);

PIXI.extras.Scrollbox = Scrollbox;

module.exports = Scrollbox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwidXBkYXRlIiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsIndpZHRoIiwiX2lzU2Nyb2xsYmFyVmVydGljYWwiLCJvdmVyZmxvd1kiLCJoZWlnaHQiLCJjbGVhciIsImxlZnQiLCJyaWdodCIsInNjcm9sbGJhclNpemUiLCJ0b3AiLCJib3R0b20iLCJpc1Njcm9sbGJhckhvcml6b250YWwiLCJpc1Njcm9sbGJhclZlcnRpY2FsIiwic2Nyb2xsYmFyVG9wIiwic2Nyb2xsYmFySGVpZ2h0Iiwic2Nyb2xsYmFyTGVmdCIsInNjcm9sbGJhcldpZHRoIiwiYmVnaW5GaWxsIiwic2Nyb2xsYmFyQmFja2dyb3VuZCIsImRyYXdSZWN0Iiwic2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwiLCJlbmRGaWxsIiwic2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCIsInNjcm9sbGJhckZvcmVncm91bmQiLCJjbGFtcCIsImRpcmVjdGlvbiIsImZvcmNlSGl0QXJlYSIsIlJlY3RhbmdsZSIsIm1hc2siLCJfZGlzYWJsZWQiLCJfZHJhd01hc2siLCJkcmFnU2Nyb2xsIiwiZHJhZyIsImNsYW1wV2hlZWwiLCJlIiwibG9jYWwiLCJ0b0xvY2FsIiwiZGF0YSIsImdsb2JhbCIsInkiLCJ4IiwicG9pbnRlckRvd24iLCJ0eXBlIiwibGFzdCIsIndvcmxkU2NyZWVuV2lkdGgiLCJ3b3JsZFNjcmVlbkhlaWdodCIsInJlc2l6ZSIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwib3ZlcmZsb3ciLCJDb250YWluZXIiLCJleHRyYXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTUEsV0FBV0MsUUFBUSxlQUFSLENBQWpCOztBQUVBLElBQU1DLFdBQVdELFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1FLFdBQVdGLFFBQVEsaUJBQVIsQ0FBakI7O0FBRUE7Ozs7SUFHTUcsUzs7O0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsdUJBQVlDLE9BQVosRUFDQTtBQUFBOztBQUFBOztBQUVJLGNBQUtBLE9BQUwsR0FBZUgsU0FBU0csT0FBVCxFQUFrQkYsUUFBbEIsQ0FBZjs7QUFFQTs7OztBQUlBLGNBQUtHLE9BQUwsR0FBZSxNQUFLQyxRQUFMLENBQWMsSUFBSVAsUUFBSixDQUFhLEVBQUVRLGlCQUFpQixNQUFLSCxPQUFMLENBQWFHLGVBQWhDLEVBQWlEQyxhQUFhLE1BQUtKLE9BQUwsQ0FBYUssUUFBM0UsRUFBcUZDLGNBQWMsTUFBS04sT0FBTCxDQUFhTyxTQUFoSCxFQUFiLENBQWQsQ0FBZjtBQUNBLGNBQUtOLE9BQUwsQ0FDS08sVUFETCxHQUVLQyxFQUZMLENBRVEsT0FGUixFQUVpQjtBQUFBLG1CQUFNLE1BQUtDLGVBQUwsRUFBTjtBQUFBLFNBRmpCOztBQUlBOzs7O0FBSUEsY0FBS0MsU0FBTCxHQUFpQixNQUFLVCxRQUFMLENBQWMsSUFBSVUsS0FBS0MsUUFBVCxFQUFkLENBQWpCO0FBQ0EsY0FBS0YsU0FBTCxDQUFlRyxXQUFmLEdBQTZCLElBQTdCO0FBQ0EsY0FBS0gsU0FBTCxDQUFlRixFQUFmLENBQWtCLGFBQWxCLEVBQWlDLE1BQUtNLGFBQXRDO0FBQ0EsY0FBS0QsV0FBTCxHQUFtQixJQUFuQjtBQUNBLGNBQUtMLEVBQUwsQ0FBUSxh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LHFCQUFMLEdBQTZCLEtBQUtoQyxPQUFMLENBQWE2QixhQUExQyxHQUEwRCxDQUFwRixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS04sb0JBQVo7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLSCxzQkFBWjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLbkIsT0FBTCxDQUFhNkIsR0FBcEI7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBSzdCLE9BQUwsQ0FBYTBCLElBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUsxQixPQUFMLENBQWFxQixLQUFwQjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLckIsT0FBTCxDQUFhd0IsTUFBcEI7QUFDSDs7OztFQXBTbUJiLEtBQUsyRCxTOztBQXlmN0IzRCxLQUFLNEQsTUFBTCxDQUFZekUsU0FBWixHQUF3QkEsU0FBeEI7O0FBRUEwRSxPQUFPQyxPQUFQLEdBQWlCM0UsU0FBakIiLCJmaWxlIjoic2Nyb2xsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVmlld3BvcnQgPSByZXF1aXJlKCdwaXhpLXZpZXdwb3J0JylcclxuXHJcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpXHJcbmNvbnN0IERFRkFVTFRTID0gcmVxdWlyZSgnLi9kZWZhdWx0cy5qc29uJylcclxuXHJcbi8qKlxyXG4gKiBwaXhpLmpzIHNjcm9sbGJveDogYSBtYXNrZWQgY29udGVudCBib3ggdGhhdCBjYW4gc2Nyb2xsIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5IHdpdGggc2Nyb2xsYmFyc1xyXG4gKi9cclxuY2xhc3MgU2Nyb2xsYm94IGV4dGVuZHMgUElYSS5Db250YWluZXJcclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgYSBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmRyYWdTY3JvbGw9dHJ1ZV0gdXNlciBtYXkgZHJhZyB0aGUgY29udGVudCBhcmVhIHRvIHNjcm9sbCBjb250ZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dYPWF1dG9dIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WT1hdXRvXSAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd10gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIHRoaXMgdmFsdWVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aD0xMDBdIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94SGVpZ2h0PTEwMF0gaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyU2l6ZT0xMF0gc2l6ZSBvZiBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsPTBdIG9mZnNldCBvZiBob3Jpem9udGFsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsPTBdIG9mZnNldCBvZiB2ZXJ0aWNhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc3RvcFByb3BhZ2F0aW9uPXRydWVdIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZD0weGRkZGRkZF0gYmFja2dyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kPTB4ODg4ODg4XSBmb3JlZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkNvbnRhaW5lcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBWaWV3cG9ydCh7IHN0b3BQcm9wYWdhdGlvbjogdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiwgc2NyZWVuV2lkdGg6IHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgc2NyZWVuSGVpZ2h0OiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0IH0pKVxyXG4gICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAuZGVjZWxlcmF0ZSgpXHJcbiAgICAgICAgICAgIC5vbignbW92ZWQnLCAoKSA9PiB0aGlzLl9kcmF3U2Nyb2xsYmFycygpKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBncmFwaGljcyBlbGVtZW50IGZvciBkcmF3aW5nIHRoZSBzY3JvbGxiYXJzXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuR3JhcGhpY3N9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIub24oJ3BvaW50ZXJkb3duJywgdGhpcy5zY3JvbGxiYXJEb3duLCB0aGlzKVxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCB0aGlzLnNjcm9sbGJhck1vdmUsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVyY2FuY2VsJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVydXBvdXRzaWRlJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuR3JhcGhpY3MoKSlcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgaG9yaXpvbnRhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG9mZnNldCBvZiB2ZXJ0aWNhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhck9mZnNldFZlcnRpY2FsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkaXNhYmxlIHRoZSBzY3JvbGxib3ggKGlmIHNldCB0byB0cnVlIHRoaXMgd2lsbCBhbHNvIHJlbW92ZSB0aGUgbWFzaylcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZGlzYWJsZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkXHJcbiAgICB9XHJcbiAgICBzZXQgZGlzYWJsZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvblxyXG4gICAgfVxyXG4gICAgc2V0IHN0b3BQcm9wYWdhdGlvbih2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBkcmFnU2Nyb2xsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRyYWdTY3JvbGxcclxuICAgIH1cclxuICAgIHNldCBkcmFnU2Nyb2xsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsID0gdmFsdWVcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZHJhZygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVQbHVnaW4oJ2RyYWcnKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICB9XHJcbiAgICBzZXQgYm94V2lkdGgodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveFdpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuV2lkdGggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93XHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3codmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93ID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dYKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WFxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WSB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dZKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WVxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKSAtIHRoaXMgY2hhbmdlcyB0aGUgc2l6ZSBhbmQgbm90IHRoZSBzY2FsZSBvZiB0aGUgYm94XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgYm94SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgfVxyXG4gICAgc2V0IGJveEhlaWdodCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuSGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzY3JvbGxiYXIgc2l6ZSBpbiBwaXhlbHNcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJTaXplKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemVcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJTaXplKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50V2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94V2lkdGggLSAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodCAtICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZSB2ZXJ0aWNhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFyVmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFySG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdG9wIGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxUb3AoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQudG9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBsZWZ0IGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxMZWZ0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmxlZnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsV2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQud2lkdGhcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5oZWlnaHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXdzIHNjcm9sbGJhcnNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJIb3Jpem9udGFsID0gdGhpcy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnID8gdHJ1ZSA6IHRoaXMub3ZlcmZsb3dYID09PSAnaGlkZGVuJyA/IGZhbHNlIDogdGhpcy5jb250ZW50LndpZHRoID4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA9IHRoaXMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyA/IHRydWUgOiB0aGlzLm92ZXJmbG93WSA9PT0gJ2hpZGRlbicgPyBmYWxzZSA6IHRoaXMuY29udGVudC5oZWlnaHQgPiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuY2xlYXIoKVxyXG4gICAgICAgIGxldCBvcHRpb25zID0ge31cclxuICAgICAgICBvcHRpb25zLmxlZnQgPSAwXHJcbiAgICAgICAgb3B0aW9ucy5yaWdodCA9IHRoaXMuY29udGVudC53aWR0aCArICh0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIG9wdGlvbnMudG9wID0gMFxyXG4gICAgICAgIG9wdGlvbnMuYm90dG9tID0gdGhpcy5jb250ZW50LmhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuY29udGVudC53aWR0aCArICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jb250ZW50LmhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9ICh0aGlzLmNvbnRlbnQudG9wIC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSB0aGlzLnNjcm9sbGJhclRvcCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJUb3BcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckhlaWdodCA9ICh0aGlzLmJveEhlaWdodCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhckhlaWdodCA+IHRoaXMuYm94SGVpZ2h0ID8gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclRvcCA6IHRoaXMuc2Nyb2xsYmFySGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gKHRoaXMuY29udGVudC5sZWZ0IC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGVmdCA9IHRoaXMuc2Nyb2xsYmFyTGVmdCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJMZWZ0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9ICh0aGlzLmJveFdpZHRoIC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoICsgdGhpcy5zY3JvbGxiYXJMZWZ0ID4gdGhpcy5ib3hXaWR0aCA/IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhckxlZnQgOiB0aGlzLnNjcm9sbGJhcldpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIDAsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KDAsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuYm94V2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIHRoaXMuc2Nyb2xsYmFyVG9wLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLnNjcm9sbGJhckxlZnQsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuc2Nyb2xsYmFyV2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmNsYW1wKHsgZGlyZWN0aW9uOiAnYWxsJyB9KVxyXG4gICAgICAgIHRoaXMuY29udGVudC5mb3JjZUhpdEFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgb3B0aW9ucy5yaWdodCwgb3B0aW9ucy5ib3R0b20pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBtYXNrIGxheWVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd01hc2soKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50XHJcbiAgICAgICAgICAgIC5iZWdpbkZpbGwoMClcclxuICAgICAgICAgICAgLmRyYXdSZWN0KDAsIDAsIHRoaXMuYm94V2lkdGgsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCB3aGVuIHNjcm9sbGJveCBjb250ZW50IGNoYW5nZXNcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdTY3JvbGxiYXJzKClcclxuICAgICAgICAgICAgdGhpcy5fZHJhd01hc2soKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRyYWdTY3JvbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggIT09ICdoaWRkZW4nICYmIHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgIT09ICdoaWRkZW4nID8gJ2FsbCcgOiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYICE9PSAnaGlkZGVuJyA/ICd4JyA6IHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgIT09ICdoaWRkZW4nID8gJ3knIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQuZHJhZyh7IGNsYW1wV2hlZWw6IHRydWUsIGRpcmVjdGlvbiB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJEb3duKGUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+PSB0aGlzLnNjcm9sbGJhckxlZnQgJiYgbG9jYWwueCA8PSB0aGlzLnNjcm9sbGJhckxlZnQgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICdob3Jpem9udGFsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5zY3JvbGxiYXJMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPj0gdGhpcy5zY3JvbGxiYXJUb3AgJiYgbG9jYWwueSA8PSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ3ZlcnRpY2FsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5zY3JvbGxiYXJUb3ApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIG1vdmUgb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyTW92ZShlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ2hvcml6b250YWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gbG9jYWwueCAtIHRoaXMucG9pbnRlckRvd24ubGFzdC54XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gbG9jYWwueSAtIHRoaXMucG9pbnRlckRvd24ubGFzdC55XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyVXAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckRvd24gPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZXNpemUgdGhlIG1hc2sgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGhdIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94SGVpZ2h0XSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqL1xyXG4gICAgcmVzaXplKG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveFdpZHRoID0gdHlwZW9mIG9wdGlvbnMuYm94V2lkdGggIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5ib3hXaWR0aCA6IHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgPSB0eXBlb2Ygb3B0aW9ucy5ib3hIZWlnaHQgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5ib3hIZWlnaHQgOiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5jb250ZW50LnJlc2l6ZSh0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG5QSVhJLmV4dHJhcy5TY3JvbGxib3ggPSBTY3JvbGxib3hcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsYm94Il19