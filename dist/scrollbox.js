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
        _this.content = _this.addChild(new Viewport({ screenWidth: _this.boxWidth, screenHeight: _this.boxHeight }));
        _this.content.decelerate().on('moved', function () {
            return _this._drawScrollbars();
        });
        if (_this.options.dragScroll) {
            _this.content.drag({ clampWheel: true });
        }

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
        return _this;
    }

    /**
     * user may drag the content area to scroll content
     * @type {boolean}
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
            this.scrollbarHeight = this.boxHeight / height * this.boxHeight;
            this.scrollbarLeft = this.content.left / width * this.boxWidth;
            this.scrollbarWidth = this.boxWidth / width * this.boxWidth;
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarBackground).drawRect(this.boxWidth - this.scrollbarSize, 0, this.scrollbarSize, this.boxHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarBackground).drawRect(0, this.boxHeight - this.scrollbarSize, this.boxWidth, this.scrollbarSize).endFill();
            }
            if (this.isScrollbarVertical) {
                this.scrollbar.beginFill(this.options.scrollbarForeground).drawRect(this.boxWidth - this.scrollbarSize, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight).endFill();
            }
            if (this.isScrollbarHorizontal) {
                this.scrollbar.beginFill(this.options.scrollbarForeground).drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize, this.scrollbarWidth, this.scrollbarSize).endFill();
            }
            this.content.clamp(options);
        }

        /**
         * draws mask layer
         * @private
         */

    }, {
        key: '_drawMask',
        value: function _drawMask() {
            this._maskContent.beginFill(0).drawRect(0, 0, this.boxWidth, this.boxHeight).endFill();
            this.mask = this._maskContent;
        }

        /**
         * call when scrollbox content changes
         */

    }, {
        key: 'update',
        value: function update() {
            this.mask = null;
            this._maskContent.clear();
            this._drawScrollbars();
            this._drawMask();
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
                    e.stopPropagation();
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
                    e.stopPropagation();
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
                e.stopPropagation();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiVmlld3BvcnQiLCJyZXF1aXJlIiwiZGVmYXVsdHMiLCJERUZBVUxUUyIsIlNjcm9sbGJveCIsIm9wdGlvbnMiLCJjb250ZW50IiwiYWRkQ2hpbGQiLCJzY3JlZW5XaWR0aCIsImJveFdpZHRoIiwic2NyZWVuSGVpZ2h0IiwiYm94SGVpZ2h0IiwiZGVjZWxlcmF0ZSIsIm9uIiwiX2RyYXdTY3JvbGxiYXJzIiwiZHJhZ1Njcm9sbCIsImRyYWciLCJjbGFtcFdoZWVsIiwic2Nyb2xsYmFyIiwiUElYSSIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsIndpZHRoIiwiX2lzU2Nyb2xsYmFyVmVydGljYWwiLCJvdmVyZmxvd1kiLCJoZWlnaHQiLCJjbGVhciIsImxlZnQiLCJyaWdodCIsInNjcm9sbGJhclNpemUiLCJ0b3AiLCJib3R0b20iLCJpc1Njcm9sbGJhckhvcml6b250YWwiLCJpc1Njcm9sbGJhclZlcnRpY2FsIiwic2Nyb2xsYmFyVG9wIiwic2Nyb2xsYmFySGVpZ2h0Iiwic2Nyb2xsYmFyTGVmdCIsInNjcm9sbGJhcldpZHRoIiwiYmVnaW5GaWxsIiwic2Nyb2xsYmFyQmFja2dyb3VuZCIsImRyYXdSZWN0IiwiZW5kRmlsbCIsInNjcm9sbGJhckZvcmVncm91bmQiLCJjbGFtcCIsIm1hc2siLCJfZHJhd01hc2siLCJlIiwibG9jYWwiLCJ0b0xvY2FsIiwiZGF0YSIsImdsb2JhbCIsInkiLCJ4IiwicG9pbnRlckRvd24iLCJ0eXBlIiwibGFzdCIsIndvcmxkU2NyZWVuV2lkdGgiLCJ1cGRhdGUiLCJzdG9wUHJvcGFnYXRpb24iLCJ3b3JsZFNjcmVlbkhlaWdodCIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwib3ZlcmZsb3ci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QWpCIiwiZmlsZSI6InNjcm9sbGJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFZpZXdwb3J0ID0gcmVxdWlyZSgncGl4aS12aWV3cG9ydCcpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCBERUZBVUxUUyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMuanNvbicpXHJcblxyXG4vKipcclxuICogcGl4aS5qcyBzY3JvbGxib3g6IGEgbWFza2VkIGNvbnRlbnQgYm94IHRoYXQgY2FuIHNjcm9sbCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseSB3aXRoIHNjcm9sbGJhcnNcclxuICovXHJcbmNsYXNzIFNjcm9sbGJveCBleHRlbmRzIFBJWEkuQ29udGFpbmVyXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kcmFnU2Nyb2xsPXRydWVdIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WD1hdXRvXSAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1k9YXV0b10gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3ddIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgc2V0cyBvdmVyZmxvd1ggYW5kIG92ZXJmbG93WSB0byB0aGlzIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGg9MTAwXSB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveEhlaWdodD0xMDBdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhclNpemU9MTBdIHNpemUgb2Ygc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZD0weGRkZGRkZF0gYmFja2dyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kPTB4ODg4ODg4XSBmb3JlZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkNvbnRhaW5lcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBWaWV3cG9ydCh7IHNjcmVlbldpZHRoOiB0aGlzLmJveFdpZHRoLCBzY3JlZW5IZWlnaHQ6IHRoaXMuYm94SGVpZ2h0IH0pKVxyXG4gICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAuZGVjZWxlcmF0ZSgpXHJcbiAgICAgICAgICAgIC5vbignbW92ZWQnLCAoKSA9PiB0aGlzLl9kcmF3U2Nyb2xsYmFycygpKVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5kcmFnKHsgY2xhbXBXaGVlbDogdHJ1ZSB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ3JhcGhpY3MgZWxlbWVudCBmb3IgZHJhd2luZyB0aGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkdyYXBoaWNzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLm9uKCdwb2ludGVyZG93bicsIHRoaXMuc2Nyb2xsYmFyRG93biwgdGhpcylcclxuICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgdGhpcy5zY3JvbGxiYXJNb3ZlLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcmNhbmNlbCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwb3V0c2lkZScsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZHJhZ1Njcm9sbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsXHJcbiAgICB9XHJcbiAgICBzZXQgZHJhZ1Njcm9sbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbCA9IHZhbHVlXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmRyYWcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlUGx1Z2luKCdkcmFnJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKS0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IGJveFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbldpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvdygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1xyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvdyA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1hcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1godmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1lcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1kodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSkgLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBib3hIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbkhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2Nyb2xsYmFyIHNpemUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyU2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyU2l6ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoIC0gKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgLSAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhclZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhckhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvcCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsVG9wKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnRvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbGVmdCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsTGVmdCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZWZ0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LndpZHRoXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2YgY29udGVudCBhcmVhXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBzY3JvbGxiYXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCA9IHRoaXMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyA/IHRydWUgOiB0aGlzLm92ZXJmbG93WCA9PT0gJ2hpZGRlbicgPyBmYWxzZSA6IHRoaXMuY29udGVudC53aWR0aCA+IHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPSB0aGlzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgPyB0cnVlIDogdGhpcy5vdmVyZmxvd1kgPT09ICdoaWRkZW4nID8gZmFsc2UgOiB0aGlzLmNvbnRlbnQuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmNsZWFyKClcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHt9XHJcbiAgICAgICAgb3B0aW9ucy5sZWZ0ID0gMFxyXG4gICAgICAgIG9wdGlvbnMucmlnaHQgPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBvcHRpb25zLnRvcCA9IDBcclxuICAgICAgICBvcHRpb25zLmJvdHRvbSA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSAodGhpcy5jb250ZW50LnRvcCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gKHRoaXMuYm94SGVpZ2h0IC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gKHRoaXMuY29udGVudC5sZWZ0IC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAodGhpcy5ib3hXaWR0aCAvIHdpZHRoKSAqIHRoaXMuYm94V2lkdGhcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgMCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QoMCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuYm94V2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFyVG9wLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLnNjcm9sbGJhckxlZnQsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLnNjcm9sbGJhcldpZHRoLCB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5jbGFtcChvcHRpb25zKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhd3MgbWFzayBsYXllclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYXdNYXNrKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgICAgICAgICAuYmVnaW5GaWxsKDApXHJcbiAgICAgICAgICAgIC5kcmF3UmVjdCgwLCAwLCB0aGlzLmJveFdpZHRoLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIHRoaXMubWFzayA9IHRoaXMuX21hc2tDb250ZW50XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHdoZW4gc2Nyb2xsYm94IGNvbnRlbnQgY2hhbmdlc1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgICAgIHRoaXMuX2RyYXdNYXNrKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyRG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPj0gdGhpcy5zY3JvbGxiYXJMZWZ0ICYmIGxvY2FsLnggPD0gdGhpcy5zY3JvbGxiYXJMZWZ0ICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAnaG9yaXpvbnRhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuc2Nyb2xsYmFyTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID49IHRoaXMuc2Nyb2xsYmFyVG9wICYmIGxvY2FsLnkgPD0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICd2ZXJ0aWNhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuc2Nyb2xsYmFyVG9wKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wIC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBtb3ZlIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhck1vdmUoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICdob3Jpem9udGFsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IGxvY2FsLnggLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IGxvY2FsLnkgLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhclVwKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5QSVhJLmV4dHJhcy5TY3JvbGxib3ggPSBTY3JvbGxib3hcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsYm94Il19