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
                        this.content.drag({ clampWheel: true, direction: direction }).clamp({ direction: direction });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJwYXNzaXZlV2hlZWwiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwidXBkYXRlIiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsIndpZHRoIiwiX2lzU2Nyb2xsYmFyVmVydGljYWwiLCJvdmVyZmxvd1kiLCJoZWlnaHQiLCJjbGVhciIsImxlZnQiLCJyaWdodCIsInNjcm9sbGJhclNpemUiLCJ0b3AiLCJib3R0b20iLCJpc1Njcm9sbGJhckhvcml6b250YWwiLCJpc1Njcm9sbGJhclZlcnRpY2FsIiwic2Nyb2xsYmFyVG9wIiwic2Nyb2xsYmFySGVpZ2h0Iiwic2Nyb2xsYmFyTGVmdCIsInNjcm9sbGJhcldpZHRoIiwiYmVnaW5GaWxsIiwic2Nyb2xsYmFyQmFja2dyb3VuZCIsImRyYXdSZWN0Iiwic2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwiLCJlbmRGaWxsIiwic2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCIsInNjcm9sbGJhckZvcmVncm91bmQiLCJmb3JjZUhpdEFyZWEiLCJSZWN0YW5nbGUiLCJtYXNrIiwiX2Rpc2FibGVkIiwiX2RyYXdNYXNrIiwiZHJhZ1Njcm9sbCIsImRpcmVjdGlvbiIsImRyYWciLCJjbGFtcFdoZWVsIiwiY2xhbXAiLCJlIiwibG9jYWwiLCJ0b0xvY2FsIiwiZGF0YSIsImdsb2JhbCIsInkiLCJ4IiwicG9pbnRlckRvd24iLCJ0eXBlIiwibGFzdCIsIndvcmxkU2NyZWVuV2lkdGgiLCJ3b3JsZFNjcmVlbkhlaWdodCIsInJlc2l6ZSIsImVuc3VyZVZpc2libGUiLCJ2YWx1ZSIsInJlbW92ZVBsdWdpbiIsIm92ZXJmbG93IiwiQ29udGFpbmVyIiwiZXh0cmFzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU1BLFdBQVdDLFFBQVEsZUFBUixDQUFqQjs7QUFFQSxJQUFNQyxXQUFXRCxRQUFRLFlBQVIsQ0FBakI7QUFDQSxJQUFNRSxXQUFXRixRQUFRLGlCQUFSLENBQWpCOztBQUVBOzs7O0lBR01HLFM7OztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLHVCQUFZQyxPQUFaLEVBQ0E7QUFBQTs7QUFBQTs7QUFFSSxjQUFLQSxPQUFMLEdBQWVILFNBQVNHLE9BQVQsRUFBa0JGLFFBQWxCLENBQWY7O0FBRUE7Ozs7QUFJQSxjQUFLRyxPQUFMLEdBQWUsTUFBS0MsUUFBTCxDQUFjLElBQUlQLFFBQUosQ0FBYSxFQUFFUSxjQUFjLE1BQUtILE9BQUwsQ0FBYUksZUFBN0IsRUFBOENBLGlCQUFpQixNQUFLSixPQUFMLENBQWFJLGVBQTVFLEVBQTZGQyxhQUFhLE1BQUtMLE9BQUwsQ0FBYU0sUUFBdkgsRUFBaUlDLGNBQWMsTUFBS1AsT0FBTCxDQUFhUSxTQUE1SixFQUFiLENBQWQsQ0FBZjtBQUNBLGNBQUtQLE9BQUwsQ0FDS1EsVUFETCxHQUVLQyxFQUZMLENBRVEsT0FGUixFQUVpQjtBQUFBLG1CQUFNLE1BQUtDLGVBQUwsRUFBTjtBQUFBLFNBRmpCOztBQUlBOzs7O0FBSUEsY0FBS0MsU0FBTCxHQUFpQixNQUFLVixRQUFMLENBQWMsSUFBSVcsS0FBS0MsUUFBVCxFQUFkLENBQWpCO0FBQ0EsY0FBS0YsU0FBTCxDQUFlRyxXQUFmLEdBQTZCLElBQTdCO0FBQ0EsY0FBS0gsU0FBTCxDQUFlRixFQUFmLENBQWtCLGFBQWxCLEVB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SyxFQUNsQjtBQUNJLGlCQUFLdEUsT0FBTCxDQUFhOEIsYUFBYixHQUE2QndDLEtBQTdCO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS3RFLE9BQUwsQ0FBYU0sUUFBYixJQUF5QixLQUFLNEIsbUJBQUwsR0FBMkIsS0FBS2xDLE9BQUwsQ0FBYThCLGFBQXhDLEdBQXdELENBQWpGLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLOUIsT0FBTCxDQUFhUSxTQUFiLElBQTBCLEtBQUt5QixxQkFBTCxHQUE2QixLQUFLakMsT0FBTCxDQUFhOEIsYUFBMUMsR0FBMEQsQ0FBcEYsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs0QkFNQTtBQUNJLG1CQUFPLEtBQUtOLG9CQUFaO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS0gsc0JBQVo7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBS3BCLE9BQUwsQ0FBYThCLEdBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUs5QixPQUFMLENBQWEyQixJQUFwQjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLM0IsT0FBTCxDQUFhc0IsS0FBcEI7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBS3RCLE9BQUwsQ0FBYXlCLE1BQXBCO0FBQ0g7Ozs7RUFwU21CYixLQUFLNEQsUzs7QUFnZ0I3QjVELEtBQUs2RCxNQUFMLENBQVkzRSxTQUFaLEdBQXdCQSxTQUF4Qjs7QUFFQTRFLE9BQU9DLE9BQVAsR0FBaUI3RSxTQUFqQiIsImZpbGUiOiJzY3JvbGxib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBWaWV3cG9ydCA9IHJlcXVpcmUoJ3BpeGktdmlld3BvcnQnKVxyXG5cclxuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJylcclxuY29uc3QgREVGQVVMVFMgPSByZXF1aXJlKCcuL2RlZmF1bHRzLmpzb24nKVxyXG5cclxuLyoqXHJcbiAqIHBpeGkuanMgc2Nyb2xsYm94OiBhIG1hc2tlZCBjb250ZW50IGJveCB0aGF0IGNhbiBzY3JvbGwgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgd2l0aCBzY3JvbGxiYXJzXHJcbiAqL1xyXG5jbGFzcyBTY3JvbGxib3ggZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZHJhZ1Njcm9sbD10cnVlXSB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1g9YXV0b10gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dZPWF1dG9dIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93XSAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoPTEwMF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHQ9MTAwXSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJTaXplPTEwXSBzaXplIG9mIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWw9MF0gb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWw9MF0gb2Zmc2V0IG9mIHZlcnRpY2FsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zdG9wUHJvcGFnYXRpb249dHJ1ZV0gY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kPTB4ZGRkZGRkXSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQ9MHg4ODg4ODhdIGZvcmVncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMsIERFRkFVTFRTKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb250ZW50IGluIHBsYWNlZCBpbiBoZXJlXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuQ29udGFpbmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFZpZXdwb3J0KHsgcGFzc2l2ZVdoZWVsOiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uLCBzdG9wUHJvcGFnYXRpb246IHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24sIHNjcmVlbldpZHRoOiB0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHNjcmVlbkhlaWdodDogdGhpcy5vcHRpb25zLmJveEhlaWdodCB9KSlcclxuICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgLmRlY2VsZXJhdGUoKVxyXG4gICAgICAgICAgICAub24oJ21vdmVkJywgKCkgPT4gdGhpcy5fZHJhd1Njcm9sbGJhcnMoKSlcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ3JhcGhpY3MgZWxlbWVudCBmb3IgZHJhd2luZyB0aGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkdyYXBoaWNzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLm9uKCdwb2ludGVyZG93bicsIHRoaXMuc2Nyb2xsYmFyRG93biwgdGhpcylcclxuICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgdGhpcy5zY3JvbGxiYXJNb3ZlLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcmNhbmNlbCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwb3V0c2lkZScsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgdmVydGljYWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZGlzYWJsZSB0aGUgc2Nyb2xsYm94IChpZiBzZXQgdG8gdHJ1ZSB0aGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hc2spXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGRpc2FibGUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZFxyXG4gICAgfVxyXG4gICAgc2V0IGRpc2FibGUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWVcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb25cclxuICAgIH1cclxuICAgIHNldCBzdG9wUHJvcGFnYXRpb24odmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZHJhZ1Njcm9sbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsXHJcbiAgICB9XHJcbiAgICBzZXQgZHJhZ1Njcm9sbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbCA9IHZhbHVlXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmRyYWcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlUGx1Z2luKCdkcmFnJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKS0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IGJveFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbldpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvdygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1xyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvdyA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1hcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1godmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1lcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1kodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSkgLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBib3hIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbkhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2Nyb2xsYmFyIHNpemUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyU2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyU2l6ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoIC0gKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgLSAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhclZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhckhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvcCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsVG9wKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnRvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbGVmdCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsTGVmdCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZWZ0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LndpZHRoXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2YgY29udGVudCBhcmVhXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBzY3JvbGxiYXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCA9IHRoaXMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyA/IHRydWUgOiB0aGlzLm92ZXJmbG93WCA9PT0gJ2hpZGRlbicgPyBmYWxzZSA6IHRoaXMuY29udGVudC53aWR0aCA+IHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPSB0aGlzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgPyB0cnVlIDogdGhpcy5vdmVyZmxvd1kgPT09ICdoaWRkZW4nID8gZmFsc2UgOiB0aGlzLmNvbnRlbnQuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmNsZWFyKClcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHt9XHJcbiAgICAgICAgb3B0aW9ucy5sZWZ0ID0gMFxyXG4gICAgICAgIG9wdGlvbnMucmlnaHQgPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBvcHRpb25zLnRvcCA9IDBcclxuICAgICAgICBvcHRpb25zLmJvdHRvbSA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSAodGhpcy5jb250ZW50LnRvcCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyVG9wID0gdGhpcy5zY3JvbGxiYXJUb3AgPCAwID8gMCA6IHRoaXMuc2Nyb2xsYmFyVG9wXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPSAodGhpcy5ib3hIZWlnaHQgLyBoZWlnaHQpICogdGhpcy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckhlaWdodCA9IHRoaXMuc2Nyb2xsYmFyVG9wICsgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPiB0aGlzLmJveEhlaWdodCA/IHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJUb3AgOiB0aGlzLnNjcm9sbGJhckhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGVmdCA9ICh0aGlzLmNvbnRlbnQubGVmdCAvIHdpZHRoKSAqIHRoaXMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckxlZnQgPSB0aGlzLnNjcm9sbGJhckxlZnQgPCAwID8gMCA6IHRoaXMuc2Nyb2xsYmFyTGVmdFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAodGhpcy5ib3hXaWR0aCAvIHdpZHRoKSAqIHRoaXMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5zY3JvbGxiYXJXaWR0aCArIHRoaXMuc2Nyb2xsYmFyTGVmdCA+IHRoaXMuYm94V2lkdGggPyB0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJMZWZ0IDogdGhpcy5zY3JvbGxiYXJXaWR0aFxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsLCAwLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCgwLCB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsLCB0aGlzLmJveFdpZHRoLCB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsLCB0aGlzLnNjcm9sbGJhclRvcCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLnNjcm9sbGJhckhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5zY3JvbGxiYXJMZWZ0LCB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsLCB0aGlzLnNjcm9sbGJhcldpZHRoLCB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5mb3JjZUhpdEFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgb3B0aW9ucy5yaWdodCwgb3B0aW9ucy5ib3R0b20pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBtYXNrIGxheWVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd01hc2soKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50XHJcbiAgICAgICAgICAgIC5iZWdpbkZpbGwoMClcclxuICAgICAgICAgICAgLmRyYXdSZWN0KDAsIDAsIHRoaXMuYm94V2lkdGgsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCB3aGVuIHNjcm9sbGJveCBjb250ZW50IGNoYW5nZXNcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdTY3JvbGxiYXJzKClcclxuICAgICAgICAgICAgdGhpcy5fZHJhd01hc2soKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRyYWdTY3JvbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggIT09ICdoaWRkZW4nICYmIHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgIT09ICdoaWRkZW4nID8gJ2FsbCcgOiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYICE9PSAnaGlkZGVuJyA/ICd4JyA6IHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgIT09ICdoaWRkZW4nID8gJ3knIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmRyYWcoeyBjbGFtcFdoZWVsOiB0cnVlLCBkaXJlY3Rpb24gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsYW1wKHsgZGlyZWN0aW9uIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhckRvd24oZSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID49IHRoaXMuc2Nyb2xsYmFyTGVmdCAmJiBsb2NhbC54IDw9IHRoaXMuc2Nyb2xsYmFyTGVmdCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ2hvcml6b250YWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLnNjcm9sbGJhckxlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0IC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+PSB0aGlzLnNjcm9sbGJhclRvcCAmJiBsb2NhbC55IDw9IHRoaXMuc2Nyb2xsYmFyVG9wICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAndmVydGljYWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLnNjcm9sbGJhclRvcClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgbW92ZSBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJNb3ZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAnaG9yaXpvbnRhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSBsb2NhbC54IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnhcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAndmVydGljYWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSBsb2NhbC55IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnlcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJVcCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlc2l6ZSB0aGUgbWFzayBmb3IgdGhlIGNvbnRhaW5lclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHRdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICovXHJcbiAgICByZXNpemUob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB0eXBlb2Ygb3B0aW9ucy5ib3hXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveFdpZHRoIDogdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHR5cGVvZiBvcHRpb25zLmJveEhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveEhlaWdodCA6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLmNvbnRlbnQucmVzaXplKHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgdGhpcy5vcHRpb25zLmJveEhlaWdodCwgdGhpcy5jb250ZW50LndpZHRoLCB0aGlzLmNvbnRlbnQuaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICBlbnN1cmVWaXNpYmxlKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmVuc3VyZVZpc2libGUoeCwgeSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICB0aGlzLl9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB9XHJcbn1cclxuXHJcblBJWEkuZXh0cmFzLlNjcm9sbGJveCA9IFNjcm9sbGJveFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxib3giXX0=