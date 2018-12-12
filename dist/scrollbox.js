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
     * @param {number} [options.scrollbarForeground=0x888888] foreground color of scrollbar
     * @param {string} [options.underflow=top-left] what to do when content underflows the scrollbox size: none: do nothing; (left/right/center AND top/bottom/center); OR center (e.g., 'top-left', 'center', 'none', 'bottomright')
     */
    function Scrollbox(options) {
        _classCallCheck(this, Scrollbox);

        var _this = _possibleConstructorReturn(this, (Scrollbox.__proto__ || Object.getPrototypeOf(Scrollbox)).call(this));

        _this.options = defaults(options, DEFAULTS);

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
            this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowX) !== -1 ? false : this.content.width > this.options.boxWidth;
            this._isScrollbarVertical = this.overflowY === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowY) !== -1 ? false : this.content.height > this.options.boxHeight;
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
                    var direction = this.isScrollbarHorizontal && this.isScrollbarVertical ? 'all' : this.isScrollbarHorizontal ? 'x' : 'y';
                    if (direction !== null) {
                        this.content.drag({ clampWheel: true, direction: direction }).clamp({ direction: direction, underflow: this.options.underflow });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJwYXNzaXZlV2hlZWwiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwidXBkYXRlIiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsImluZGV4T2YiLCJ3aWR0aCIsIl9pc1Njcm9sbGJhclZlcnRpY2FsIiwib3ZlcmZsb3dZIiwiaGVpZ2h0IiwiY2xlYXIiLCJsZWZ0IiwicmlnaHQiLCJzY3JvbGxiYXJTaXplIiwidG9wIiwiYm90dG9tIiwiaXNTY3JvbGxiYXJIb3Jpem9udGFsIiwiaXNTY3JvbGxiYXJWZXJ0aWNhbCIsInNjcm9sbGJhclRvcCIsInNjcm9sbGJhckhlaWdodCIsInNjcm9sbGJhckxlZnQiLCJzY3JvbGxiYXJXaWR0aCIsImJlZ2luRmlsbCIsInNjcm9sbGJhckJhY2tncm91bmQiLCJkcmF3UmVjdCIsInNjcm9sbGJhck9mZnNldFZlcnRpY2FsIiwiZW5kRmlsbCIsInNjcm9sbGJhck9mZnNldEhvcml6b250YWwiLCJzY3JvbGxiYXJGb3JlZ3JvdW5kIiwiZm9yY2VIaXRBcmVhIiwiUmVjdGFuZ2xlIiwibWFzayIsIl9kaXNhYmxlZCIsIl9kcmF3TWFzayIsImRyYWdTY3JvbGwiLCJkaXJlY3Rpb24iLCJkcmFnIiwiY2xhbXBXaGVlbCIsImNsYW1wIiwidW5kZXJmbG93IiwiZSIsImxvY2FsIiwidG9Mb2NhbCIsImRhdGEiLCJnbG9iYWwiLCJ5IiwieCIsInBvaW50ZXJEb3duIiwidHlwZSIsImxhc3QiLCJ3b3JsZFNjcmVlbldpZHRoIiwid29ybGRTY3JlZW5IZWlnaHQiLCJyZXNpemUiLCJlbnN1cmVWaXNpYmxlIiwidmFsdWUiLCJyZW1vdmVQbHVnaW4iLCJvdmVyZmxvdyIsIkNvbnRhaW5lciIsImV4dHJhcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxXQUFXQyxRQUFRLGVBQVIsQ0FBakI7O0FBRUEsSUFBTUMsV0FBV0QsUUFBUSxZQUFSLENBQWpCO0FBQ0EsSUFBTUUsV0FBV0YsUUFBUSxpQkFBUixDQUFqQjs7QUFFQTs7OztJQUdNRyxTOzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsdUJBQVlDLE9BQVosRUFDQTtBQUFBOztBQUFBOztBQUVJLGNBQUtBLE9BQUwsR0FBZUgsU0FBU0csT0FBVCxFQUFrQkYsUUFBbEIsQ0FBZjs7QUFFQTs7Ozs7QUFLQSxjQUFLRyxPQUFMLEdBQWUsTUFBS0MsUUFBTCxDQUFjLElBQUlQLFFBQUosQ0FBYSxFQUFFUSxjQUFjLE1BQUtILE9BQUwsQ0FBYUksZUFBN0IsRUFBOENBLGlCQUFpQixNQUFLSixPQUFMLENBQWFJLGVBQTVFLEVBQTZGQyxhQUFhLE1BQUtMLE9BQUwsQ0FBYU0sUUFBdkgsRUFBaUlDLGNBQWMsTUFBS1AsT0FBTCxDQUFhUSxTQUE1SixFQUFiLENBQWQsQ0FBZjtBQUNBLGNBQUtQLE9BQUwsQ0FDS1EsVUFETCxHQUVLQyxFQUZMLENBRVEsT0FGUixFQUVpQjtBQUFBLG1CQUFNLE1BQUtDLGVBQUwsRUFBTjtBQUFBLFNBRmpCOztBQUlBOzs7O0FBSUEsY0FBS0MsU0FBTCxHQUFpQixNQUFLVixRQUFMLENBQWMsSUFBSVcsS0FBS0MsUUFBVCxFQUFkLENBQWpCO0FBQ0EsY0FBS0YsU0FBTCxDQUFlRyxXQUFmLEdBQTZCLElBQTdCO0FBQ0EsY0FBS0gsU0FBTCxD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S0FBS3BCLE9BQUwsQ0FBYStCLGFBQXBCO0FBQ0gsUzswQkFDaUJ5QyxLLEVBQ2xCO0FBQ0ksaUJBQUt4RSxPQUFMLENBQWErQixhQUFiLEdBQTZCeUMsS0FBN0I7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLeEUsT0FBTCxDQUFhTSxRQUFiLElBQXlCLEtBQUs2QixtQkFBTCxHQUEyQixLQUFLbkMsT0FBTCxDQUFhK0IsYUFBeEMsR0FBd0QsQ0FBakYsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs0QkFNQTtBQUNJLG1CQUFPLEtBQUsvQixPQUFMLENBQWFRLFNBQWIsSUFBMEIsS0FBSzBCLHFCQUFMLEdBQTZCLEtBQUtsQyxPQUFMLENBQWErQixhQUExQyxHQUEwRCxDQUFwRixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS04sb0JBQVo7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLSixzQkFBWjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLcEIsT0FBTCxDQUFhK0IsR0FBcEI7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBSy9CLE9BQUwsQ0FBYTRCLElBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUs1QixPQUFMLENBQWF1QixLQUFwQjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLdkIsT0FBTCxDQUFhMEIsTUFBcEI7QUFDSDs7OztFQXRTbUJkLEtBQUs4RCxTOztBQXlnQjdCOUQsS0FBSytELE1BQUwsQ0FBWTdFLFNBQVosR0FBd0JBLFNBQXhCOztBQUVBOEUsT0FBT0MsT0FBUCxHQUFpQi9FLFNBQWpCIiwiZmlsZSI6InNjcm9sbGJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFZpZXdwb3J0ID0gcmVxdWlyZSgncGl4aS12aWV3cG9ydCcpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCBERUZBVUxUUyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMuanNvbicpXHJcblxyXG4vKipcclxuICogcGl4aS5qcyBzY3JvbGxib3g6IGEgbWFza2VkIGNvbnRlbnQgYm94IHRoYXQgY2FuIHNjcm9sbCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseSB3aXRoIHNjcm9sbGJhcnNcclxuICovXHJcbmNsYXNzIFNjcm9sbGJveCBleHRlbmRzIFBJWEkuQ29udGFpbmVyXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kcmFnU2Nyb2xsPXRydWVdIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WD1hdXRvXSAobm9uZSwgc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1k9YXV0b10gKG5vbmUsIHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3ddIChub25lLCBzY3JvbGwsIGhpZGRlbiwgYXV0bykgc2V0cyBvdmVyZmxvd1ggYW5kIG92ZXJmbG93WSB0byB0aGlzIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGg9MTAwXSB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveEhlaWdodD0xMDBdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhclNpemU9MTBdIHNpemUgb2Ygc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbD0wXSBvZmZzZXQgb2YgaG9yaXpvbnRhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbD0wXSBvZmZzZXQgb2YgdmVydGljYWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnN0b3BQcm9wYWdhdGlvbj10cnVlXSBjYWxsIHN0b3BQcm9wYWdhdGlvbiBvbiBhbnkgZXZlbnRzIHRoYXQgaW1wYWN0IHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQ9MHhkZGRkZGRdIGJhY2tncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZD0weDg4ODg4OF0gZm9yZWdyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy51bmRlcmZsb3c9dG9wLWxlZnRdIHdoYXQgdG8gZG8gd2hlbiBjb250ZW50IHVuZGVyZmxvd3MgdGhlIHNjcm9sbGJveCBzaXplOiBub25lOiBkbyBub3RoaW5nOyAobGVmdC9yaWdodC9jZW50ZXIgQU5EIHRvcC9ib3R0b20vY2VudGVyKTsgT1IgY2VudGVyIChlLmcuLCAndG9wLWxlZnQnLCAnY2VudGVyJywgJ25vbmUnLCAnYm90dG9tcmlnaHQnKVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIHlvdSBjYW4gdXNlIGFueSBmdW5jdGlvbiBmcm9tIHBpeGktdmlld3BvcnQgb24gY29udGVudCB0byBtYW51YWxseSBtb3ZlIHRoZSBjb250ZW50IChzZWUgaHR0cHM6Ly9kYXZpZGZpZy5naXRodWIuaW8vcGl4aS12aWV3cG9ydC9qc2RvYy8pXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuZXh0cmFzLlZpZXdwb3J0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFZpZXdwb3J0KHsgcGFzc2l2ZVdoZWVsOiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uLCBzdG9wUHJvcGFnYXRpb246IHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24sIHNjcmVlbldpZHRoOiB0aGlzLm9wdGlvbnMuYm94V2lkdGgsIHNjcmVlbkhlaWdodDogdGhpcy5vcHRpb25zLmJveEhlaWdodCB9KSlcclxuICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgLmRlY2VsZXJhdGUoKVxyXG4gICAgICAgICAgICAub24oJ21vdmVkJywgKCkgPT4gdGhpcy5fZHJhd1Njcm9sbGJhcnMoKSlcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ3JhcGhpY3MgZWxlbWVudCBmb3IgZHJhd2luZyB0aGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkdyYXBoaWNzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLm9uKCdwb2ludGVyZG93bicsIHRoaXMuc2Nyb2xsYmFyRG93biwgdGhpcylcclxuICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgdGhpcy5zY3JvbGxiYXJNb3ZlLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcmNhbmNlbCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwb3V0c2lkZScsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgdmVydGljYWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZGlzYWJsZSB0aGUgc2Nyb2xsYm94IChpZiBzZXQgdG8gdHJ1ZSB0aGlzIHdpbGwgYWxzbyByZW1vdmUgdGhlIG1hc2spXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGRpc2FibGUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZFxyXG4gICAgfVxyXG4gICAgc2V0IGRpc2FibGUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rpc2FibGVkICE9PSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWVcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb25cclxuICAgIH1cclxuICAgIHNldCBzdG9wUHJvcGFnYXRpb24odmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZHJhZ1Njcm9sbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsXHJcbiAgICB9XHJcbiAgICBzZXQgZHJhZ1Njcm9sbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbCA9IHZhbHVlXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmRyYWcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlUGx1Z2luKCdkcmFnJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKS0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IGJveFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbldpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvdygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1xyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvdyA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1hcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1godmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1lcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1kodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSkgLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBib3hIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbkhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2Nyb2xsYmFyIHNpemUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyU2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyU2l6ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoIC0gKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgLSAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhclZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhckhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvcCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsVG9wKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnRvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbGVmdCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsTGVmdCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZWZ0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LndpZHRoXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2YgY29udGVudCBhcmVhXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBzY3JvbGxiYXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCA9IHRoaXMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyA/IHRydWUgOiBbJ2hpZGRlbicsICdub25lJ10uaW5kZXhPZih0aGlzLm92ZXJmbG93WCkgIT09IC0xID8gZmFsc2UgOiB0aGlzLmNvbnRlbnQud2lkdGggPiB0aGlzLm9wdGlvbnMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID0gdGhpcy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnID8gdHJ1ZSA6IFsnaGlkZGVuJywgJ25vbmUnXS5pbmRleE9mKHRoaXMub3ZlcmZsb3dZKSAhPT0gLTEgPyBmYWxzZSA6IHRoaXMuY29udGVudC5oZWlnaHQgPiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuY2xlYXIoKVxyXG4gICAgICAgIGxldCBvcHRpb25zID0ge31cclxuICAgICAgICBvcHRpb25zLmxlZnQgPSAwXHJcbiAgICAgICAgb3B0aW9ucy5yaWdodCA9IHRoaXMuY29udGVudC53aWR0aCArICh0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIG9wdGlvbnMudG9wID0gMFxyXG4gICAgICAgIG9wdGlvbnMuYm90dG9tID0gdGhpcy5jb250ZW50LmhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuY29udGVudC53aWR0aCArICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jb250ZW50LmhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9ICh0aGlzLmNvbnRlbnQudG9wIC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSB0aGlzLnNjcm9sbGJhclRvcCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJUb3BcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckhlaWdodCA9ICh0aGlzLmJveEhlaWdodCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhckhlaWdodCA+IHRoaXMuYm94SGVpZ2h0ID8gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclRvcCA6IHRoaXMuc2Nyb2xsYmFySGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gKHRoaXMuY29udGVudC5sZWZ0IC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGVmdCA9IHRoaXMuc2Nyb2xsYmFyTGVmdCA8IDAgPyAwIDogdGhpcy5zY3JvbGxiYXJMZWZ0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9ICh0aGlzLmJveFdpZHRoIC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoICsgdGhpcy5zY3JvbGxiYXJMZWZ0ID4gdGhpcy5ib3hXaWR0aCA/IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhckxlZnQgOiB0aGlzLnNjcm9sbGJhcldpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIDAsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KDAsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuYm94V2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwsIHRoaXMuc2Nyb2xsYmFyVG9wLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLnNjcm9sbGJhckxlZnQsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwsIHRoaXMuc2Nyb2xsYmFyV2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmZvcmNlSGl0QXJlYSA9IG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCBvcHRpb25zLnJpZ2h0LCBvcHRpb25zLmJvdHRvbSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXdzIG1hc2sgbGF5ZXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kcmF3TWFzaygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnRcclxuICAgICAgICAgICAgLmJlZ2luRmlsbCgwKVxyXG4gICAgICAgICAgICAuZHJhd1JlY3QoMCwgMCwgdGhpcy5ib3hXaWR0aCwgdGhpcy5ib3hIZWlnaHQpXHJcbiAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IHRoaXMuX21hc2tDb250ZW50XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHdoZW4gc2Nyb2xsYm94IGNvbnRlbnQgY2hhbmdlc1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY29udGVudC5tYXNrID0gbnVsbFxyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50LmNsZWFyKClcclxuICAgICAgICBpZiAoIXRoaXMuX2Rpc2FibGVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgICAgICAgICB0aGlzLl9kcmF3TWFzaygpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgJiYgdGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gJ2FsbCcgOiB0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/ICd4JyA6ICd5J1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmRyYWcoeyBjbGFtcFdoZWVsOiB0cnVlLCBkaXJlY3Rpb24gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsYW1wKHsgZGlyZWN0aW9uLCB1bmRlcmZsb3c6IHRoaXMub3B0aW9ucy51bmRlcmZsb3cgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyRG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPj0gdGhpcy5zY3JvbGxiYXJMZWZ0ICYmIGxvY2FsLnggPD0gdGhpcy5zY3JvbGxiYXJMZWZ0ICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAnaG9yaXpvbnRhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuc2Nyb2xsYmFyTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID49IHRoaXMuc2Nyb2xsYmFyVG9wICYmIGxvY2FsLnkgPD0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICd2ZXJ0aWNhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuc2Nyb2xsYmFyVG9wKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wIC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBtb3ZlIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhck1vdmUoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICdob3Jpem9udGFsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IGxvY2FsLnggLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IGxvY2FsLnkgLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhclVwKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVzaXplIHRoZSBtYXNrIGZvciB0aGUgY29udGFpbmVyXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoXSB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveEhlaWdodF0gaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKi9cclxuICAgIHJlc2l6ZShvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHR5cGVvZiBvcHRpb25zLmJveFdpZHRoICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuYm94V2lkdGggOiB0aGlzLm9wdGlvbnMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0ID0gdHlwZW9mIG9wdGlvbnMuYm94SGVpZ2h0ICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuYm94SGVpZ2h0IDogdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuY29udGVudC5yZXNpemUodGhpcy5vcHRpb25zLmJveFdpZHRoLCB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0LCB0aGlzLmNvbnRlbnQud2lkdGgsIHRoaXMuY29udGVudC5oZWlnaHQpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZW5zdXJlIHRoYXQgdGhlIGJvdW5kaW5nIGJveCBpcyB2aXNpYmxlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIHJlbGF0aXZlIHRvIGNvbnRlbnQncyBjb29yZGluYXRlIHN5c3RlbVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxyXG4gICAgICovXHJcbiAgICBlbnN1cmVWaXNpYmxlKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmVuc3VyZVZpc2libGUoeCwgeSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICB0aGlzLl9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB9XHJcbn1cclxuXHJcblBJWEkuZXh0cmFzLlNjcm9sbGJveCA9IFNjcm9sbGJveFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxib3giXX0=