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
                        this.content.drag({ clampWheel: true, direction: direction }).clamp({ direction: direction, underflow: 'top-left' });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJwYXNzaXZlV2hlZWwiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwidXBkYXRlIiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsImluZGV4T2YiLCJ3aWR0aCIsIl9pc1Njcm9sbGJhclZlcnRpY2FsIiwib3ZlcmZsb3dZIiwiaGVpZ2h0IiwiY2xlYXIiLCJsZWZ0IiwicmlnaHQiLCJzY3JvbGxiYXJTaXplIiwidG9wIiwiYm90dG9tIiwiaXNTY3JvbGxiYXJIb3Jpem9udGFsIiwiaXNTY3JvbGxiYXJWZXJ0aWNhbCIsInNjcm9sbGJhclRvcCIsInNjcm9sbGJhckhlaWdodCIsInNjcm9sbGJhckxlZnQiLCJzY3JvbGxiYXJXaWR0aCIsImJlZ2luRmlsbCIsInNjcm9sbGJhckJhY2tncm91bmQiLCJkcmF3UmVjdCIsInNjcm9sbGJhck9mZnNldFZlcnRpY2FsIiwiZW5kRmlsbCIsInNjcm9sbGJhck9mZnNldEhvcml6b250YWwiLCJzY3JvbGxiYXJGb3JlZ3JvdW5kIiwiZm9yY2VIaXRBcmVhIiwiUmVjdGFuZ2xlIiwibWFzayIsIl9kaXNhYmxlZCIsIl9kcmF3TWFzayIsImRyYWdTY3JvbGwiLCJkaXJlY3Rpb24iLCJkcmFnIiwiY2xhbXBXaGVlbCIsImNsYW1wIiwidW5kZXJmbG93IiwiZSIsImxvY2FsIiwidG9Mb2NhbCIsImRhdGEiLCJnbG9iYWwiLCJ5IiwieCIsInBvaW50ZXJEb3duIiwidHlwZSIsImxhc3QiLCJ3b3JsZFNjcmVlbldpZHRoIiwid29ybGRTY3JlZW5IZWlnaHQiLCJyZXNpemUiLCJlbnN1cmVWaXNpYmxlIiwidmFsdWUiLCJyZW1vdmVQbHVnaW4iLCJvdmVyZmxvdyIsIkNvbnRhaW5lciIsImV4dHJhcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxXQUFXQyxRQUFRLGVBQVIsQ0FBakI7O0FBRUEsSUFBTUMsV0FBV0QsUUFBUSxZQUFSLENBQWpCO0FBQ0EsSUFBTUUsV0FBV0YsUUFBUSxpQkFBUixDQUFqQjs7QUFFQTs7OztJQUdNRyxTOzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSx1QkFBWUMsT0FBWixFQUNBO0FBQUE7O0FBQUE7O0FBRUksY0FBS0EsT0FBTCxHQUFlSCxTQUFTRyxPQUFULEVBQWtCRixRQUFsQixDQUFmOztBQUVBOzs7O0FBSUEsY0FBS0csT0FBTCxHQUFlLE1BQUtDLFFBQUwsQ0FBYyxJQUFJUCxRQUFKLENBQWEsRUFBRVEsY0FBYyxNQUFLSCxPQUFMLENBQWFJLGVBQTdCLEVBQThDQSxpQkFBaUIsTUFBS0osT0FBTCxDQUFhSSxlQUE1RSxFQUE2RkMsYUFBYSxNQUFLTCxPQUFMLENBQWFNLFFBQXZILEVBQWlJQyxjQUFjLE1BQUtQLE9BQUwsQ0FBYVEsU0FBNUosRUFBYixDQUFkLENBQWY7QUFDQSxjQUFLUCxPQUFMLENBQ0tRLFVBREwsR0FFS0MsRUFGTCxDQUVRLE9BRlIsRUFFaUI7QUFBQSxtQkFBTSxNQUFLQyxlQUFMLEVBQU47QUFBQSxTQUZqQjs7QUFJQTs7OztBQUlBLGNBQUtDLFNBQUwsR0FBaUIsTUFBS1YsUUFBTCxDQUFjLElBQUlXLEtBQUtDLFFBQVQsRUFBZCxDQUFqQjtBQUNBLGNBQUtGLFNBQUwsQ0FBZUcsV0FBZixHQUE2QixJQUE3QjtBQUNBLGNBQUtILFNBQUwsQ0FB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QUNpQnlDLEssRUFDbEI7QUFDSSxpQkFBS3hFLE9BQUwsQ0FBYStCLGFBQWIsR0FBNkJ5QyxLQUE3QjtBQUNIOztBQUVEOzs7Ozs7Ozs0QkFNQTtBQUNJLG1CQUFPLEtBQUt4RSxPQUFMLENBQWFNLFFBQWIsSUFBeUIsS0FBSzZCLG1CQUFMLEdBQTJCLEtBQUtuQyxPQUFMLENBQWErQixhQUF4QyxHQUF3RCxDQUFqRixDQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBSy9CLE9BQUwsQ0FBYVEsU0FBYixJQUEwQixLQUFLMEIscUJBQUwsR0FBNkIsS0FBS2xDLE9BQUwsQ0FBYStCLGFBQTFDLEdBQTBELENBQXBGLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLTixvQkFBWjtBQUNIOztBQUVEOzs7Ozs7Ozs0QkFNQTtBQUNJLG1CQUFPLEtBQUtKLHNCQUFaO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUtwQixPQUFMLENBQWErQixHQUFwQjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLL0IsT0FBTCxDQUFhNEIsSUFBcEI7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBSzVCLE9BQUwsQ0FBYXVCLEtBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUt2QixPQUFMLENBQWEwQixNQUFwQjtBQUNIOzs7O0VBcFNtQmQsS0FBSzhELFM7O0FBZ2dCN0I5RCxLQUFLK0QsTUFBTCxDQUFZN0UsU0FBWixHQUF3QkEsU0FBeEI7O0FBRUE4RSxPQUFPQyxPQUFQLEdBQWlCL0UsU0FBakIiLCJmaWxlIjoic2Nyb2xsYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVmlld3BvcnQgPSByZXF1aXJlKCdwaXhpLXZpZXdwb3J0JylcclxuXHJcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpXHJcbmNvbnN0IERFRkFVTFRTID0gcmVxdWlyZSgnLi9kZWZhdWx0cy5qc29uJylcclxuXHJcbi8qKlxyXG4gKiBwaXhpLmpzIHNjcm9sbGJveDogYSBtYXNrZWQgY29udGVudCBib3ggdGhhdCBjYW4gc2Nyb2xsIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5IHdpdGggc2Nyb2xsYmFyc1xyXG4gKi9cclxuY2xhc3MgU2Nyb2xsYm94IGV4dGVuZHMgUElYSS5Db250YWluZXJcclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgYSBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmRyYWdTY3JvbGw9dHJ1ZV0gdXNlciBtYXkgZHJhZyB0aGUgY29udGVudCBhcmVhIHRvIHNjcm9sbCBjb250ZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dYPWF1dG9dIChub25lLCBzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WT1hdXRvXSAobm9uZSwgc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd10gKG5vbmUsIHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIHRoaXMgdmFsdWVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aD0xMDBdIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94SGVpZ2h0PTEwMF0gaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyU2l6ZT0xMF0gc2l6ZSBvZiBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsPTBdIG9mZnNldCBvZiBob3Jpem9udGFsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsPTBdIG9mZnNldCBvZiB2ZXJ0aWNhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc3RvcFByb3BhZ2F0aW9uPXRydWVdIGNhbGwgc3RvcFByb3BhZ2F0aW9uIG9uIGFueSBldmVudHMgdGhhdCBpbXBhY3Qgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZD0weGRkZGRkZF0gYmFja2dyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kPTB4ODg4ODg4XSBmb3JlZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkNvbnRhaW5lcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBWaWV3cG9ydCh7IHBhc3NpdmVXaGVlbDogdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiwgc3RvcFByb3BhZ2F0aW9uOiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uLCBzY3JlZW5XaWR0aDogdGhpcy5vcHRpb25zLmJveFdpZHRoLCBzY3JlZW5IZWlnaHQ6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgfSkpXHJcbiAgICAgICAgdGhpcy5jb250ZW50XHJcbiAgICAgICAgICAgIC5kZWNlbGVyYXRlKClcclxuICAgICAgICAgICAgLm9uKCdtb3ZlZCcsICgpID0+IHRoaXMuX2RyYXdTY3JvbGxiYXJzKCkpXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdyYXBoaWNzIGVsZW1lbnQgZm9yIGRyYXdpbmcgdGhlIHNjcm9sbGJhcnNcclxuICAgICAgICAgKiBAdHlwZSB7UElYSS5HcmFwaGljc31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNjcm9sbGJhciA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuR3JhcGhpY3MoKSlcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5pbnRlcmFjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5vbigncG9pbnRlcmRvd24nLCB0aGlzLnNjcm9sbGJhckRvd24sIHRoaXMpXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVybW92ZScsIHRoaXMuc2Nyb2xsYmFyTW92ZSwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVydXAnLCB0aGlzLnNjcm9sbGJhclVwLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLnNjcm9sbGJhclVwLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cG91dHNpZGUnLCB0aGlzLnNjcm9sbGJhclVwLCB0aGlzKVxyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50ID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG9mZnNldCBvZiBob3Jpem9udGFsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbGJhck9mZnNldEhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhck9mZnNldEhvcml6b250YWwodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWwgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIHZlcnRpY2FsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbGJhck9mZnNldFZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWwodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRpc2FibGUgdGhlIHNjcm9sbGJveCAoaWYgc2V0IHRvIHRydWUgdGhpcyB3aWxsIGFsc28gcmVtb3ZlIHRoZSBtYXNrKVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBkaXNhYmxlKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWRcclxuICAgIH1cclxuICAgIHNldCBkaXNhYmxlKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZCAhPT0gdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHN0b3BQcm9wYWdhdGlvbiBvbiBhbnkgZXZlbnRzIHRoYXQgaW1wYWN0IHNjcm9sbGJveFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBzdG9wUHJvcGFnYXRpb24oKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uXHJcbiAgICB9XHJcbiAgICBzZXQgc3RvcFByb3BhZ2F0aW9uKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24gPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdXNlciBtYXkgZHJhZyB0aGUgY29udGVudCBhcmVhIHRvIHNjcm9sbCBjb250ZW50XHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGRyYWdTY3JvbGwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbFxyXG4gICAgfVxyXG4gICAgc2V0IGRyYWdTY3JvbGwodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmRyYWdTY3JvbGwgPSB2YWx1ZVxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5kcmFnKClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnJlbW92ZVBsdWdpbignZHJhZycpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSktIHRoaXMgY2hhbmdlcyB0aGUgc2l6ZSBhbmQgbm90IHRoZSBzY2FsZSBvZiB0aGUgYm94XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgYm94V2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94V2lkdGhcclxuICAgIH1cclxuICAgIHNldCBib3hXaWR0aCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuY29udGVudC5zY3JlZW5XaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggYW5kIG92ZXJmbG93WSB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3coKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvdyh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3cgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dYIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvd1goKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYXHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3dYKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1ggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvd1koKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZXHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3dZKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvd1kgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpIC0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICB9XHJcbiAgICBzZXQgYm94SGVpZ2h0KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuY29udGVudC5zY3JlZW5IZWlnaHQgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNjcm9sbGJhciBzaXplIGluIHBpeGVsc1xyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbGJhclNpemUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZVxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhclNpemUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGxlc3MgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRlbnRXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aCAtICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2Ygc2Nyb2xsYm94IGxlc3MgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbnRlbnRIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0IC0gKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIHZlcnRpY2FsIHNjcm9sbGJhciB2aXNpYmxlXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgaXNTY3JvbGxiYXJWZXJ0aWNhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZSBob3Jpem9udGFsIHNjcm9sbGJhciB2aXNpYmxlXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgaXNTY3JvbGxiYXJIb3Jpem9udGFsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJIb3Jpem9udGFsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0b3AgY29vcmRpbmF0ZSBvZiBzY3JvbGxiYXJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFRvcCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC50b3BcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGxlZnQgY29vcmRpbmF0ZSBvZiBzY3JvbGxiYXJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbExlZnQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQubGVmdFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2YgY29udGVudCBhcmVhXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC53aWR0aFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsSGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmhlaWdodFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhd3Mgc2Nyb2xsYmFyc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYXdTY3JvbGxiYXJzKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWwgPSB0aGlzLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgPyB0cnVlIDogWydoaWRkZW4nLCAnbm9uZSddLmluZGV4T2YodGhpcy5vdmVyZmxvd1gpICE9PSAtMSA/IGZhbHNlIDogdGhpcy5jb250ZW50LndpZHRoID4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA9IHRoaXMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyA/IHRydWUgOiBbJ2hpZGRlbicsICdub25lJ10uaW5kZXhPZih0aGlzLm92ZXJmbG93WSkgIT09IC0xID8gZmFsc2UgOiB0aGlzLmNvbnRlbnQuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmNsZWFyKClcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHt9XHJcbiAgICAgICAgb3B0aW9ucy5sZWZ0ID0gMFxyXG4gICAgICAgIG9wdGlvbnMucmlnaHQgPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBvcHRpb25zLnRvcCA9IDBcclxuICAgICAgICBvcHRpb25zLmJvdHRvbSA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSAodGhpcy5jb250ZW50LnRvcCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyVG9wID0gdGhpcy5zY3JvbGxiYXJUb3AgPCAwID8gMCA6IHRoaXMuc2Nyb2xsYmFyVG9wXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPSAodGhpcy5ib3hIZWlnaHQgLyBoZWlnaHQpICogdGhpcy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckhlaWdodCA9IHRoaXMuc2Nyb2xsYmFyVG9wICsgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPiB0aGlzLmJveEhlaWdodCA/IHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJUb3AgOiB0aGlzLnNjcm9sbGJhckhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGVmdCA9ICh0aGlzLmNvbnRlbnQubGVmdCAvIHdpZHRoKSAqIHRoaXMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckxlZnQgPSB0aGlzLnNjcm9sbGJhckxlZnQgPCAwID8gMCA6IHRoaXMuc2Nyb2xsYmFyTGVmdFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAodGhpcy5ib3hXaWR0aCAvIHdpZHRoKSAqIHRoaXMuYm94V2lkdGhcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5zY3JvbGxiYXJXaWR0aCArIHRoaXMuc2Nyb2xsYmFyTGVmdCA+IHRoaXMuYm94V2lkdGggPyB0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJMZWZ0IDogdGhpcy5zY3JvbGxiYXJXaWR0aFxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsLCAwLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCgwLCB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsLCB0aGlzLmJveFdpZHRoLCB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplICsgdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldFZlcnRpY2FsLCB0aGlzLnNjcm9sbGJhclRvcCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLnNjcm9sbGJhckhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5zY3JvbGxiYXJMZWZ0LCB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsLCB0aGlzLnNjcm9sbGJhcldpZHRoLCB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5mb3JjZUhpdEFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgb3B0aW9ucy5yaWdodCwgb3B0aW9ucy5ib3R0b20pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBtYXNrIGxheWVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd01hc2soKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50XHJcbiAgICAgICAgICAgIC5iZWdpbkZpbGwoMClcclxuICAgICAgICAgICAgLmRyYXdSZWN0KDAsIDAsIHRoaXMuYm94V2lkdGgsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCB3aGVuIHNjcm9sbGJveCBjb250ZW50IGNoYW5nZXNcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdTY3JvbGxiYXJzKClcclxuICAgICAgICAgICAgdGhpcy5fZHJhd01hc2soKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRyYWdTY3JvbGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsICYmIHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/ICdhbGwnIDogdGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyAneCcgOiAneSdcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gIT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kcmFnKHsgY2xhbXBXaGVlbDogdHJ1ZSwgZGlyZWN0aW9uIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbGFtcCh7IGRpcmVjdGlvbiwgdW5kZXJmbG93OiAndG9wLWxlZnQnIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhckRvd24oZSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID49IHRoaXMuc2Nyb2xsYmFyTGVmdCAmJiBsb2NhbC54IDw9IHRoaXMuc2Nyb2xsYmFyTGVmdCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ2hvcml6b250YWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLnNjcm9sbGJhckxlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0IC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+PSB0aGlzLnNjcm9sbGJhclRvcCAmJiBsb2NhbC55IDw9IHRoaXMuc2Nyb2xsYmFyVG9wICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAndmVydGljYWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLnNjcm9sbGJhclRvcClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgbW92ZSBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJNb3ZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAnaG9yaXpvbnRhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSBsb2NhbC54IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnhcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAndmVydGljYWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSBsb2NhbC55IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnlcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJVcCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlc2l6ZSB0aGUgbWFzayBmb3IgdGhlIGNvbnRhaW5lclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHRdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICovXHJcbiAgICByZXNpemUob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB0eXBlb2Ygb3B0aW9ucy5ib3hXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveFdpZHRoIDogdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHR5cGVvZiBvcHRpb25zLmJveEhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveEhlaWdodCA6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLmNvbnRlbnQucmVzaXplKHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgdGhpcy5vcHRpb25zLmJveEhlaWdodCwgdGhpcy5jb250ZW50LndpZHRoLCB0aGlzLmNvbnRlbnQuaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICBlbnN1cmVWaXNpYmxlKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmVuc3VyZVZpc2libGUoeCwgeSwgd2lkdGgsIGhlaWdodClcclxuICAgICAgICB0aGlzLl9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB9XHJcbn1cclxuXHJcblBJWEkuZXh0cmFzLlNjcm9sbGJveCA9IFNjcm9sbGJveFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxib3giXX0=