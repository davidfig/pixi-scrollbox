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
                        this.content.drag({ clampWheel: true, direction: direction }).clamp({ direction: direction, underflow: 'none' });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJwYXNzaXZlV2hlZWwiLCJzdG9wUHJvcGFnYXRpb24iLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwidXBkYXRlIiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsImluZGV4T2YiLCJ3aWR0aCIsIl9pc1Njcm9sbGJhclZlcnRpY2FsIiwib3ZlcmZsb3dZIiwiaGVpZ2h0IiwiY2xlYXIiLCJsZWZ0IiwicmlnaHQiLCJzY3JvbGxiYXJTaXplIiwidG9wIiwiYm90dG9tIiwiaXNTY3JvbGxiYXJIb3Jpem9udGFsIiwiaXNTY3JvbGxiYXJWZXJ0aWNhbCIsInNjcm9sbGJhclRvcCIsInNjcm9sbGJhckhlaWdodCIsInNjcm9sbGJhckxlZnQiLCJzY3JvbGxiYXJXaWR0aCIsImJlZ2luRmlsbCIsInNjcm9sbGJhckJhY2tncm91bmQiLCJkcmF3UmVjdCIsInNjcm9sbGJhck9mZnNldFZlcnRpY2FsIiwiZW5kRmlsbCIsInNjcm9sbGJhck9mZnNldEhvcml6b250YWwiLCJzY3JvbGxiYXJGb3JlZ3JvdW5kIiwiZm9yY2VIaXRBcmVhIiwiUmVjdGFuZ2xlIiwibWFzayIsIl9kaXNhYmxlZCIsIl9kcmF3TWFzayIsImRyYWdTY3JvbGwiLCJkaXJlY3Rpb24iLCJkcmFnIiwiY2xhbXBXaGVlbCIsImNsYW1wIiwidW5kZXJmbG93IiwiZSIsImxvY2FsIiwidG9Mb2NhbCIsImRhdGEiLCJnbG9iYWwiLCJ5IiwieCIsInBvaW50ZXJEb3duIiwidHlwZSIsImxhc3QiLCJ3b3JsZFNjcmVlbldpZHRoIiwid29ybGRTY3JlZW5IZWlnaHQiLCJyZXNpemUiLCJlbnN1cmVWaXNpYmxlIiwidmFsdWUiLCJyZW1vdmVQbHVnaW4iLCJvdmVyZmxvdyIsIkNvbnRhaW5lciIsImV4dHJhcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxXQUFXQyxRQUFRLGVBQVIsQ0FBakI7O0FBRUEsSUFBTUMsV0FBV0QsUUFBUSxZQUFSLENBQWpCO0FBQ0EsSUFBTUUsV0FBV0YsUUFBUSxpQkFBUixDQUFqQjs7QUFFQTs7OztJQUdNRyxTOzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSx1QkFBWUMsT0FBWixFQUNBO0FBQUE7O0FBQUE7O0FBRUksY0FBS0EsT0FBTCxHQUFlSCxTQUFTRyxPQUFULEVBQWtCRixRQUFsQixDQUFmOztBQUVBOzs7OztBQUtBLGNBQUtHLE9BQUwsR0FBZSxNQUFLQyxRQUFMLENBQWMsSUFBSVAsUUFBSixDQUFhLEVBQUVRLGNBQWMsTUFBS0gsT0FBTCxDQUFhSSxlQUE3QixFQUE4Q0EsaUJBQWlCLE1BQUtKLE9BQUwsQ0FBYUksZUFBNUUsRUFBNkZDLGFBQWEsTUFBS0wsT0FBTCxDQUFhTSxRQUF2SCxFQUFpSUMsY0FBYyxNQUFLUCxPQUFMLENBQWFRLFNBQTVKLEVBQWIsQ0FBZCxDQUFmO0FBQ0EsY0FBS1AsT0FBTCxDQUNLUSxVQURMLEdBRUtDLEVBRkwsQ0FFUSxPQUZSLEVBRWlCO0FBQUEsbUJBQU0sTUFBS0MsZUFBTCxFQUFOO0FBQUEsU0FGakI7O0FBSUE7Ozs7QUFJQSxjQUFLQyxTQUFMLEdBQWlCLE1BQUtWLFFBQUwsQ0FBYyxJQUFJVyxLQUFLQyxRQUFULEVBQWQsQ0FBakI7QUFDQSxjQUFLRixTQUFMLENBQWVHLFdBQWYsR0FBNkIsSUFBN0I7QUFDQSxjQUFLSCxTQUFMLENB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QUFwQjtBQUNILFM7MEJBQ2lCeUMsSyxFQUNsQjtBQUNJLGlCQUFLeEUsT0FBTCxDQUFhK0IsYUFBYixHQUE2QnlDLEtBQTdCO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS3hFLE9BQUwsQ0FBYU0sUUFBYixJQUF5QixLQUFLNkIsbUJBQUwsR0FBMkIsS0FBS25DLE9BQUwsQ0FBYStCLGFBQXhDLEdBQXdELENBQWpGLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7NEJBTUE7QUFDSSxtQkFBTyxLQUFLL0IsT0FBTCxDQUFhUSxTQUFiLElBQTBCLEtBQUswQixxQkFBTCxHQUE2QixLQUFLbEMsT0FBTCxDQUFhK0IsYUFBMUMsR0FBMEQsQ0FBcEYsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs0QkFNQTtBQUNJLG1CQUFPLEtBQUtOLG9CQUFaO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRCQU1BO0FBQ0ksbUJBQU8sS0FBS0osc0JBQVo7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBS3BCLE9BQUwsQ0FBYStCLEdBQXBCO0FBQ0g7O0FBRUQ7Ozs7Ozs0QkFJQTtBQUNJLG1CQUFPLEtBQUsvQixPQUFMLENBQWE0QixJQUFwQjtBQUNIOztBQUVEOzs7Ozs7NEJBSUE7QUFDSSxtQkFBTyxLQUFLNUIsT0FBTCxDQUFhdUIsS0FBcEI7QUFDSDs7QUFFRDs7Ozs7OzRCQUlBO0FBQ0ksbUJBQU8sS0FBS3ZCLE9BQUwsQ0FBYTBCLE1BQXBCO0FBQ0g7Ozs7RUFyU21CZCxLQUFLOEQsUzs7QUF3Z0I3QjlELEtBQUsrRCxNQUFMLENBQVk3RSxTQUFaLEdBQXdCQSxTQUF4Qjs7QUFFQThFLE9BQU9DLE9BQVAsR0FBaUIvRSxTQUFqQiIsImZpbGUiOiJzY3JvbGxib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBWaWV3cG9ydCA9IHJlcXVpcmUoJ3BpeGktdmlld3BvcnQnKVxyXG5cclxuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJylcclxuY29uc3QgREVGQVVMVFMgPSByZXF1aXJlKCcuL2RlZmF1bHRzLmpzb24nKVxyXG5cclxuLyoqXHJcbiAqIHBpeGkuanMgc2Nyb2xsYm94OiBhIG1hc2tlZCBjb250ZW50IGJveCB0aGF0IGNhbiBzY3JvbGwgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgd2l0aCBzY3JvbGxiYXJzXHJcbiAqL1xyXG5jbGFzcyBTY3JvbGxib3ggZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZHJhZ1Njcm9sbD10cnVlXSB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1g9YXV0b10gKG5vbmUsIHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dZPWF1dG9dIChub25lLCBzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93XSAobm9uZSwgc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoPTEwMF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHQ9MTAwXSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJTaXplPTEwXSBzaXplIG9mIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWw9MF0gb2Zmc2V0IG9mIGhvcml6b250YWwgc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0VmVydGljYWw9MF0gb2Zmc2V0IG9mIHZlcnRpY2FsIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zdG9wUHJvcGFnYXRpb249dHJ1ZV0gY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJCYWNrZ3JvdW5kPTB4ZGRkZGRkXSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQ9MHg4ODg4ODhdIGZvcmVncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMsIERFRkFVTFRTKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb250ZW50IGluIHBsYWNlZCBpbiBoZXJlXHJcbiAgICAgICAgICogeW91IGNhbiB1c2UgYW55IGZ1bmN0aW9uIGZyb20gcGl4aS12aWV3cG9ydCBvbiBjb250ZW50IHRvIG1hbnVhbGx5IG1vdmUgdGhlIGNvbnRlbnQgKHNlZSBodHRwczovL2RhdmlkZmlnLmdpdGh1Yi5pby9waXhpLXZpZXdwb3J0L2pzZG9jLylcclxuICAgICAgICAgKiBAdHlwZSB7UElYSS5leHRyYXMuVmlld3BvcnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5hZGRDaGlsZChuZXcgVmlld3BvcnQoeyBwYXNzaXZlV2hlZWw6IHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24sIHN0b3BQcm9wYWdhdGlvbjogdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbiwgc2NyZWVuV2lkdGg6IHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgc2NyZWVuSGVpZ2h0OiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0IH0pKVxyXG4gICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAuZGVjZWxlcmF0ZSgpXHJcbiAgICAgICAgICAgIC5vbignbW92ZWQnLCAoKSA9PiB0aGlzLl9kcmF3U2Nyb2xsYmFycygpKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBncmFwaGljcyBlbGVtZW50IGZvciBkcmF3aW5nIHRoZSBzY3JvbGxiYXJzXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuR3JhcGhpY3N9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIub24oJ3BvaW50ZXJkb3duJywgdGhpcy5zY3JvbGxiYXJEb3duLCB0aGlzKVxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCB0aGlzLnNjcm9sbGJhck1vdmUsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVyY2FuY2VsJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVydXBvdXRzaWRlJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuR3JhcGhpY3MoKSlcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBvZmZzZXQgb2YgaG9yaXpvbnRhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhck9mZnNldEhvcml6b250YWxcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRIb3Jpem9udGFsID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG9mZnNldCBvZiB2ZXJ0aWNhbCBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbFxyXG4gICAgfVxyXG4gICAgc2V0IHNjcm9sbGJhck9mZnNldFZlcnRpY2FsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkaXNhYmxlIHRoZSBzY3JvbGxib3ggKGlmIHNldCB0byB0cnVlIHRoaXMgd2lsbCBhbHNvIHJlbW92ZSB0aGUgbWFzaylcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZGlzYWJsZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkXHJcbiAgICB9XHJcbiAgICBzZXQgZGlzYWJsZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbCBzdG9wUHJvcGFnYXRpb24gb24gYW55IGV2ZW50cyB0aGF0IGltcGFjdCBzY3JvbGxib3hcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvblxyXG4gICAgfVxyXG4gICAgc2V0IHN0b3BQcm9wYWdhdGlvbih2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBkcmFnU2Nyb2xsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRyYWdTY3JvbGxcclxuICAgIH1cclxuICAgIHNldCBkcmFnU2Nyb2xsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsID0gdmFsdWVcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZHJhZygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVQbHVnaW4oJ2RyYWcnKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICB9XHJcbiAgICBzZXQgYm94V2lkdGgodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveFdpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuV2lkdGggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93XHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3codmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93ID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dYKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WFxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WSB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dZKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WVxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKSAtIHRoaXMgY2hhbmdlcyB0aGUgc2l6ZSBhbmQgbm90IHRoZSBzY2FsZSBvZiB0aGUgYm94XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgYm94SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgfVxyXG4gICAgc2V0IGJveEhlaWdodCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuSGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzY3JvbGxiYXIgc2l6ZSBpbiBwaXhlbHNcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJTaXplKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemVcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJTaXplKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50V2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94V2lkdGggLSAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodCAtICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZSB2ZXJ0aWNhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFyVmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFySG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdG9wIGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxUb3AoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQudG9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBsZWZ0IGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxMZWZ0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmxlZnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsV2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQud2lkdGhcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5oZWlnaHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXdzIHNjcm9sbGJhcnNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJIb3Jpem9udGFsID0gdGhpcy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnID8gdHJ1ZSA6IFsnaGlkZGVuJywgJ25vbmUnXS5pbmRleE9mKHRoaXMub3ZlcmZsb3dYKSAhPT0gLTEgPyBmYWxzZSA6IHRoaXMuY29udGVudC53aWR0aCA+IHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPSB0aGlzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgPyB0cnVlIDogWydoaWRkZW4nLCAnbm9uZSddLmluZGV4T2YodGhpcy5vdmVyZmxvd1kpICE9PSAtMSA/IGZhbHNlIDogdGhpcy5jb250ZW50LmhlaWdodCA+IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhci5jbGVhcigpXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7fVxyXG4gICAgICAgIG9wdGlvbnMubGVmdCA9IDBcclxuICAgICAgICBvcHRpb25zLnJpZ2h0ID0gdGhpcy5jb250ZW50LndpZHRoICsgKHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgb3B0aW9ucy50b3AgPSAwXHJcbiAgICAgICAgb3B0aW9ucy5ib3R0b20gPSB0aGlzLmNvbnRlbnQuaGVpZ2h0ICsgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jb250ZW50LndpZHRoICsgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNvbnRlbnQuaGVpZ2h0ICsgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyVG9wID0gKHRoaXMuY29udGVudC50b3AgLyBoZWlnaHQpICogdGhpcy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9IHRoaXMuc2Nyb2xsYmFyVG9wIDwgMCA/IDAgOiB0aGlzLnNjcm9sbGJhclRvcFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gKHRoaXMuYm94SGVpZ2h0IC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID4gdGhpcy5ib3hIZWlnaHQgPyB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyVG9wIDogdGhpcy5zY3JvbGxiYXJIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckxlZnQgPSAodGhpcy5jb250ZW50LmxlZnQgLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gdGhpcy5zY3JvbGxiYXJMZWZ0IDwgMCA/IDAgOiB0aGlzLnNjcm9sbGJhckxlZnRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gKHRoaXMuYm94V2lkdGggLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGggKyB0aGlzLnNjcm9sbGJhckxlZnQgPiB0aGlzLmJveFdpZHRoID8gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyTGVmdCA6IHRoaXMuc2Nyb2xsYmFyV2lkdGhcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCwgMCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QoMCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCwgdGhpcy5ib3hXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSArIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJPZmZzZXRWZXJ0aWNhbCwgdGhpcy5zY3JvbGxiYXJUb3AsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5zY3JvbGxiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuc2Nyb2xsYmFyTGVmdCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUgKyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyT2Zmc2V0SG9yaXpvbnRhbCwgdGhpcy5zY3JvbGxiYXJXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbnRlbnQuZm9yY2VIaXRBcmVhID0gbmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAsIG9wdGlvbnMucmlnaHQsIG9wdGlvbnMuYm90dG9tKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhd3MgbWFzayBsYXllclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYXdNYXNrKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgICAgICAgICAuYmVnaW5GaWxsKDApXHJcbiAgICAgICAgICAgIC5kcmF3UmVjdCgwLCAwLCB0aGlzLmJveFdpZHRoLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIHRoaXMuY29udGVudC5tYXNrID0gdGhpcy5fbWFza0NvbnRlbnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgd2hlbiBzY3JvbGxib3ggY29udGVudCBjaGFuZ2VzXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50Lm1hc2sgPSBudWxsXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQuY2xlYXIoKVxyXG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICAgICAgICAgIHRoaXMuX2RyYXdNYXNrKClcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCAmJiB0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyAnYWxsJyA6IHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsID8gJ3gnIDogJ3knXHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uICE9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZHJhZyh7IGNsYW1wV2hlZWw6IHRydWUsIGRpcmVjdGlvbiB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xhbXAoeyBkaXJlY3Rpb24sIHVuZGVyZmxvdzogJ25vbmUnIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhckRvd24oZSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID49IHRoaXMuc2Nyb2xsYmFyTGVmdCAmJiBsb2NhbC54IDw9IHRoaXMuc2Nyb2xsYmFyTGVmdCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ2hvcml6b250YWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLnNjcm9sbGJhckxlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0IC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnN0b3BQcm9wYWdhdGlvbilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnggPiB0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+PSB0aGlzLnNjcm9sbGJhclRvcCAmJiBsb2NhbC55IDw9IHRoaXMuc2Nyb2xsYmFyVG9wICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAndmVydGljYWwnLCBsYXN0OiBsb2NhbCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLnNjcm9sbGJhclRvcClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RvcFByb3BhZ2F0aW9uKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgbW92ZSBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJNb3ZlKGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAnaG9yaXpvbnRhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCArPSBsb2NhbC54IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnhcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wb2ludGVyRG93bi50eXBlID09PSAndmVydGljYWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSBsb2NhbC55IC0gdGhpcy5wb2ludGVyRG93bi5sYXN0LnlcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24ubGFzdCA9IGxvY2FsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJVcCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlc2l6ZSB0aGUgbWFzayBmb3IgdGhlIGNvbnRhaW5lclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hXaWR0aF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHRdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICovXHJcbiAgICByZXNpemUob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94V2lkdGggPSB0eXBlb2Ygb3B0aW9ucy5ib3hXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveFdpZHRoIDogdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHR5cGVvZiBvcHRpb25zLmJveEhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmJveEhlaWdodCA6IHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLmNvbnRlbnQucmVzaXplKHRoaXMub3B0aW9ucy5ib3hXaWR0aCwgdGhpcy5vcHRpb25zLmJveEhlaWdodCwgdGhpcy5jb250ZW50LndpZHRoLCB0aGlzLmNvbnRlbnQuaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVuc3VyZSB0aGF0IHRoZSBib3VuZGluZyBib3ggaXMgdmlzaWJsZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSByZWxhdGl2ZSB0byBjb250ZW50J3MgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqL1xyXG4gICAgZW5zdXJlVmlzaWJsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY29udGVudC5lbnN1cmVWaXNpYmxlKHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgfVxyXG59XHJcblxyXG5QSVhJLmV4dHJhcy5TY3JvbGxib3ggPSBTY3JvbGxib3hcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsYm94Il19