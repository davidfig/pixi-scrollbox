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
            this.content.resize(this.options.boxWidth, this.options.boxHeight, this.content.width, this.content.height);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJwYXNzaXZlV2hlZWwiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwidXBkYXRlIiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsIndpZHRoIiwiX2lzU2Nyb2xsYmFyVmVydGljYWwiLCJvdmVyZmxvd1kiLCJoZWlnaHQiLCJjbGVhciIsImxlZnQiLCJyaWdodCIsInNjcm9sbGJhclNpemUiLCJ0b3AiLCJib3R0b20iLCJpc1Njcm9sbGJhckhvcml6b250YWwiLCJpc1Njcm9sbGJhclZlcnRpY2FsIiwic2Nyb2xsYmFyVG9wIiwic2Nyb2xsYmFySGVpZ2h0Iiwic2Nyb2xsYmFyTGVmdCIsInNjcm9sbGJhcldpZHRoIiwiYmVnaW5GaWxsIiwic2Nyb2xsYmFyQmFja2dyb3VuZCIsImRyYXdSZWN0Iiwic2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwiLCJlbmRGaWxsIiwic2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCIsInNjcm9sbGJhckZvcmVncm91bmQiLCJjbGFtcCIsImRpcmVjdGlvbiIsImZvcmNlSGl0QXJlYSIsIlJlY3RhbmdsZSIsIm1hc2siLCJfZGlzYWJsZWQiLCJfZHJhd01hc2siLCJkcmFnU2Nyb2xsIiwiZHJhZyIsImNsYW1wV2hlZWwiLCJlIiwibG9jYWwiLCJ0b0xvY2FsIiwiZGF0YSIsImdsb2JhbCIsInkiLCJ4IiwicG9pbnRlckRvd24iLCJ0eXBlIiwibGFzdCIsIndvcmxkU2NyZWVuV2lkdGgiLCJ3b3JsZFNjcmVlbkhlaWdodCIsInJlc2l6ZSIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwib3ZlcmZsb3ciLCJDb250YWluZXIiLCJleHRyYXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTUEsV0FBV0MsUUFBUSxlQUFSLENBQWpCOztBQUVBLElBQU1DLFdBQVdELFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU1FLFdBQVdGLFFBQVEsaUJBQVIsQ0FBakI7O0FBRUE7Ozs7SUFHTUcsUzs7O0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsdUJBQVlDLE9BQVosRUFDQTtBQUFBOztBQUFBOztBQUVJLGNBQUtBLE9BQUwsR0FBZUgsU0FBU0csT0FBVCxFQUFrQkYsUUFBbEIsQ0FBZjs7QUFFQTs7OztBQUlBLGNBQUtHLE9BQUwsR0FBZSxNQUFLQyxRQUFMLENBQWMsSUFBSVAsUUFBSixDQUFhLEVBQUVRLGNBQWMsTUFBS0gsT0FBTCxDQUFhSSxlQUE3QixFQUE4Q0EsaUJBQWlCLE1BQUtKLE9BQUwsQ0FBYUksZUFBNUUsRUFBNkZDLGFBQWEsTUFBS0wsT0FBTCxDQUFhTSxRQUF2SCxFQUFpSUMsY0FBYyxNQUFLUCxPQUFMLENBQWFRLFNBQTVKLEVBQWIsQ0FBZCxDQUFmO0FBQ0EsY0FBS1AsT0FBTCxDQUNLUSxVQURMLEdBRUtDLEVBRkwsQ0FFUSxPQUZSLEVBRWlCO0FBQUEsbUJBQU0sTUFBS0MsZUFBTCxFQUFOO0FBQUEsU0FGakI7O0FBSUE7Ozs7QUFJQSxjQUFLQyxTQUFMLEdBQWlCLE1BQUtWLFFBQUwsQ0FBYyxJQUFJVyxLQUFLQyxRQUFULEVBQWQsQ0FBakI7QUFDQSxjQUFLRixTQUFMLENBQWVHLFdBQWYsR0FBNkIsSUFBN0I7QUFDQSxjQUFLSCxTQUFMLENBQWVGLEVBQWYsQ0FBa0IsYUFBbEIsRUFBaUMsTUFBS00sYUFBdEM7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QUFLbEMsT0FBTCxDQUFhOEIsYUFBeEMsR0FBd0QsQ0FBakYsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs0QkFNQTtBQUNJLG1CQUFPLEtBQUs5QixPQUFMLENBQWFRLFNBQWIsSUFBMEIsS0FBS3lCLHFCQUFMLEdBQTZCLEtBQUtqQyxPQUFMLENBQWE4QixhQUExQyxHQUEwRCxDQUFwRixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS04sb0JBQVo7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLSCxzQkFBWjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLcEIsT0FBTCxDQUFhOEIsR0FBcEI7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBSzlCLE9BQUwsQ0FBYTJCLElBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUszQixPQUFMLENBQWFzQixLQUFwQjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLdEIsT0FBTCxDQUFheUIsTUFBcEI7QUFDSDs7OztFQXBTbUJiLEtBQUsyRCxTOztBQXlmN0IzRCxLQUFLNEQsTUFBTCxDQUFZMUUsU0FBWixHQUF3QkEsU0FBeEI7O0FBRUEyRSxPQUFPQyxPQUFQLEdBQWlCNUUsU0FBakIiLCJmaWxlIjoic2Nyb2xsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVmlld3BvcnQgPSByZXF1aXJlKCdwaXhpLXZpZXdwb3J0JylcclxuXHJcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpXHJcbmNvbnN0IERFRkFVTFRTID0gcmVxdWlyZSgnLi9kZWZhdWx0cy5qc29uJylcclxuXHJcbi8qKlxyXG4gKiBwaXhpLmpzIHNjcm9sbGJveDogYSBtYXNrZWQgY29udGVudCBib3ggdGhhdCBjYW4gc2Nyb2xsIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5IHdpdGggc2Nyb2xsYmFyc1xyXG4gKi9cclxuY2xhc3MgU2Nyb2xsYm94IGV4dGVuZHMgUElYSS5Db250YWluZXJcclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgYSBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmRyYWdTY3JvbGw9dHJ1ZV0gdXNlciBtYXkgZHJhZyB0aGUgY29udGVudCBhcmVhIHRvIHNjcm9sbCBjb250ZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dYPWF1dG9dIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WT1hdXRvXSAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd10gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIHRoaXMgdmFsdWVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aD0xMDBdIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94SGVpZ2h0PTEwMF0gaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyU2l6ZT0xMF0gc2l6ZSBvZiBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsPTBdIG9mZnNldCBvZiBob3Jpem9udGFsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsPTBdIG9mZnNldCBvZiB2ZXJ0aWNhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc3RvcFByb3BhZ2F0aW9uPXRydWVdIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZD0weGRkZGRkZF0gYmFja2dyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kPTB4ODg4ODg4XSBmb3JlZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkNvbnRhaW5lcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBWaWV3cG9ydCh7IHBhc3NpdmVXaGVlbDogdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiwgc3RvcFByb3BhZ2F0aW9uOiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uLCBzY3JlZW5XaWR0aDogdGhpcy5vcHRpb25zLmJveFdpZHRoLCBzY3JlZW5IZWlnaHQ6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgfSkpXHJcbiAgICAgICAgdGhpcy5jb250ZW50XHJcbiAgICAgICAgICAgIC5kZWNlbGVyYXRlKClcclxuICAgICAgICAgICAgLm9uKCdtb3ZlZCcsICgpID0+IHRoaXMuX2RyYXdTY3JvbGxiYXJzKCkpXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdyYXBoaWNzIGVsZW1lbnQgZm9yIGRyYXdpbmcgdGhlIHNjcm9sbGJhcnNcclxuICAgICAgICAgKiBAdHlwZSB7UElYSS5HcmFwaGljc31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNjcm9sbGJhciA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuR3JhcGhpY3MoKSlcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5pbnRlcmFjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5vbigncG9pbnRlcmRvd24nLCB0aGlzLnNjcm9sbGJhckRvd24sIHRoaXMpXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVybW92ZScsIHRoaXMuc2Nyb2xsYmFyTW92ZSwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVydXAnLCB0aGlzLnNjcm9sbGJhclVwLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLnNjcm9sbGJhclVwLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cG91dHNpZGUnLCB0aGlzLnNjcm9sbGJhclVwLCB0aGlzKVxyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50ID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG9mZnNldCBvZiBob3Jpem9udGFsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbGJhck9mZnNldEhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhck9mZnNldEhvcml6b250YWwodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIHZlcnRpY2FsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbGJhck9mZnNldFZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRpc2FibGUgdGhlIHNjcm9sbGJveCAoaWYgc2V0IHRvIHRydWUgdGhpcyB3aWxsIGFsc28gcmVtb3ZlIHRoZSBtYXNrKVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBkaXNhYmxlKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWRcclxuICAgIH1cclxuICAgIHNldCBkaXNhYmxlKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCAhPT0gdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHN0b3BQcm9wYWdhdGlvbiBvbiBhbnkgZXZlbnRzIHRoYXQgaW1wYWN0IHNjcm9sbGJveFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBzdG9wUHJvcGFnYXRpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uXHJcbiAgICB9XHJcbiAgICBzZXQgc3RvcFByb3BhZ2F0aW9uKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24gPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdXNlciBtYXkgZHJhZyB0aGUgY29udGVudCBhcmVhIHRvIHNjcm9sbCBjb250ZW50XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGRyYWdTY3JvbGwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbFxyXG4gICAgfVxyXG4gICAgc2V0IGRyYWdTY3JvbGwodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmRyYWdTY3JvbGwgPSB2YWx1ZVxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5kcmFnKClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnJlbW92ZVBsdWdpbignZHJhZycpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSktIHRoaXMgY2hhbmdlcyB0aGUgc2l6ZSBhbmQgbm90IHRoZSBzY2FsZSBvZiB0aGUgYm94XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgYm94V2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94V2lkdGhcclxuICAgIH1cclxuICAgIHNldCBib3hXaWR0aCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuY29udGVudC5zY3JlZW5XaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggYW5kIG92ZXJmbG93WSB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3coKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvdyh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3cgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dYIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvd1goKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYXHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3dYKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvd1koKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZXHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3dZKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpIC0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICB9XHJcbiAgICBzZXQgYm94SGVpZ2h0KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuY29udGVudC5zY3JlZW5IZWlnaHQgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNjcm9sbGJhciBzaXplIGluIHBpeGVsc1xyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbGJhclNpemUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZVxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhclNpemUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGxlc3MgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRlbnRXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aCAtICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2Ygc2Nyb2xsYm94IGxlc3MgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRlbnRIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0IC0gKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIHZlcnRpY2FsIHNjcm9sbGJhciB2aXNpYmxlXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgaXNTY3JvbGxiYXJWZXJ0aWNhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZSBob3Jpem9udGFsIHNjcm9sbGJhciB2aXNpYmxlXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgaXNTY3JvbGxiYXJIb3Jpem9udGFsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJIb3Jpem9udGFsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0b3AgY29vcmRpbmF0ZSBvZiBzY3JvbGxiYXJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFRvcCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC50b3BcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGxlZnQgY29vcmRpbmF0ZSBvZiBzY3JvbGxiYXJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbExlZnQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQubGVmdFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2YgY29udGVudCBhcmVhXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC53aWR0aFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsSGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmhlaWdodFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhd3Mgc2Nyb2xsYmFyc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYXdTY3JvbGxiYXJzKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWwgPSB0aGlzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgPyB0cnVlIDogdGhpcy5vdmVyZmxvd1ggPT09ICdoaWRkZW4nID8gZmFsc2UgOiB0aGlzLmNvbnRlbnQud2lkdGggPiB0aGlzLm9wdGlvbnMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID0gdGhpcy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnID8gdHJ1ZSA6IHRoaXMub3ZlcmZsb3dZID09PSAnaGlkZGVuJyA/IGZhbHNlIDogdGhpcy5jb250ZW50LmhlaWdodCA+IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5jbGVhcigpXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7fVxyXG4gICAgICAgIG9wdGlvbnMubGVmdCA9IDBcclxuICAgICAgICBvcHRpb25zLnJpZ2h0ID0gdGhpcy5jb250ZW50LndpZHRoICsgKHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgb3B0aW9ucy50b3AgPSAwXHJcbiAgICAgICAgb3B0aW9ucy5ib3R0b20gPSB0aGlzLmNvbnRlbnQuaGVpZ2h0ICsgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jb250ZW50LndpZHRoICsgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNvbnRlbnQuaGVpZ2h0ICsgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyVG9wID0gKHRoaXMuY29udGVudC50b3AgLyBoZWlnaHQpICogdGhpcy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9IHRoaXMuc2Nyb2xsYmFyVG9wIDwgMCA/IDAgOiB0aGlzLnNjcm9sbGJhclRvcFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gKHRoaXMuYm94SGVpZ2h0IC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID4gdGhpcy5ib3hIZWlnaHQgPyB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyVG9wIDogdGhpcy5zY3JvbGxiYXJIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckxlZnQgPSAodGhpcy5jb250ZW50LmxlZnQgLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gdGhpcy5zY3JvbGxiYXJMZWZ0IDwgMCA/IDAgOiB0aGlzLnNjcm9sbGJhckxlZnRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gKHRoaXMuYm94V2lkdGggLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGggKyB0aGlzLnNjcm9sbGJhckxlZnQgPiB0aGlzLmJveFdpZHRoID8gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyTGVmdCA6IHRoaXMuc2Nyb2xsYmFyV2lkdGhcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCwgMCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QoMCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCwgdGhpcy5ib3hXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCwgdGhpcy5zY3JvbGxiYXJUb3AsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5zY3JvbGxiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuc2Nyb2xsYmFyTGVmdCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCwgdGhpcy5zY3JvbGxiYXJXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbnRlbnQuY2xhbXAoeyBkaXJlY3Rpb246ICdhbGwnIH0pXHJcbiAgICAgICAgdGhpcy5jb250ZW50LmZvcmNlSGl0QXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCBvcHRpb25zLnJpZ2h0LCBvcHRpb25zLmJvdHRvbSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXdzIG1hc2sgbGF5ZXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kcmF3TWFzaygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnRcclxuICAgICAgICAgICAgLmJlZ2luRmlsbCgwKVxyXG4gICAgICAgICAgICAuZHJhd1JlY3QoMCwgMCwgdGhpcy5ib3hXaWR0aCwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IHRoaXMuX21hc2tDb250ZW50XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHdoZW4gc2Nyb2xsYm94IGNvbnRlbnQgY2hhbmdlc1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY29udGVudC5tYXNrID0gbnVsbFxyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50LmNsZWFyKClcclxuICAgICAgICBpZiAoIXRoaXMuX2Rpc2FibGVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgICAgICAgICB0aGlzLl9kcmF3TWFzaygpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLm92ZXJmbG93WCAhPT0gJ2hpZGRlbicgJiYgdGhpcy5vcHRpb25zLm92ZXJmbG93WSAhPT0gJ2hpZGRlbicgPyAnYWxsJyA6IHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggIT09ICdoaWRkZW4nID8gJ3gnIDogdGhpcy5vcHRpb25zLm92ZXJmbG93WSAhPT0gJ2hpZGRlbicgPyAneScgOiBudWxsXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5kcmFnKHsgY2xhbXBXaGVlbDogdHJ1ZSwgZGlyZWN0aW9uIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhckRvd24oZSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID49IHRoaXMuc2Nyb2xsYmFyTGVmdCAmJiBsb2NhbC54IDw9IHRoaXMuc2Nyb2xsYmFyTGVmdCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ2hvcml6b250YWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLnNjcm9sbGJhckxlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0IC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+PSB0aGlzLnNjcm9sbGJhclRvcCAmJiBsb2NhbC55IDw9IHRoaXMuc2Nyb2xsYmFyVG9wICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAndmVydGljYWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLnNjcm9sbGJhclRvcClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgbW92ZSBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJNb3ZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAnaG9yaXpvbnRhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSBsb2NhbC54IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnhcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAndmVydGljYWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSBsb2NhbC55IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnlcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJVcCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlc2l6ZSB0aGUgbWFzayBmb3IgdGhlIGNvbnRhaW5lclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHRdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICovXHJcbiAgICByZXNpemUob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB0eXBlb2Ygb3B0aW9ucy5ib3hXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveFdpZHRoIDogdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHR5cGVvZiBvcHRpb25zLmJveEhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveEhlaWdodCA6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLmNvbnRlbnQucmVzaXplKHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgdGhpcy5vcHRpb25zLmJveEhlaWdodCwgdGhpcy5jb250ZW50LndpZHRoLCB0aGlzLmNvbnRlbnQuaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxufVxyXG5cclxuUElYSS5leHRyYXMuU2Nyb2xsYm94ID0gU2Nyb2xsYm94XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbGJveCJdfQ==