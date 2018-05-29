'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = require('pixi.js');
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

module.exports = Scrollbox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiUElYSSIsInJlcXVpcmUiLCJWaWV3cG9ydCIsImRlZmF1bHRzIiwiREVGQVVMVFMiLCJTY3JvbGxib3giLCJvcHRpb25zIiwiY29udGVudCIsImFkZENoaWxkIiwic2NyZWVuV2lkdGgiLCJib3hXaWR0aCIsInNjcmVlbkhlaWdodCIsImJveEhlaWdodCIsImRlY2VsZXJhdGUiLCJvbiIsIl9kcmF3U2Nyb2xsYmFycyIsImRyYWdTY3JvbGwiLCJkcmFnIiwiY2xhbXBXaGVlbCIsInNjcm9sbGJhciIsIkdyYXBoaWNzIiwiaW50ZXJhY3RpdmUiLCJzY3JvbGxiYXJEb3duIiwic2Nyb2xsYmFyTW92ZSIsInNjcm9sbGJhclVwIiwiX21hc2tDb250ZW50IiwiX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCIsIm92ZXJmbG93WCIsIndpZHRoIiwiX2lzU2Nyb2xsYmFyVmVydGljYWwiLCJvdmVyZmxvd1kiLCJoZWlnaHQiLCJjbGVhciIsImxlZnQiLCJyaWdodCIsInNjcm9sbGJhclNpemUiLCJ0b3AiLCJib3R0b20iLCJpc1Njcm9sbGJhckhvcml6b250YWwiLCJpc1Njcm9sbGJhclZlcnRpY2FsIiwic2Nyb2xsYmFyVG9wIiwic2Nyb2xsYmFySGVpZ2h0Iiwic2Nyb2xsYmFyTGVmdCIsInNjcm9sbGJhcldpZHRoIiwiYmVnaW5GaWxsIiwic2Nyb2xsYmFyQmFja2dyb3VuZCIsImRyYXdSZWN0IiwiZW5kRmlsbCIsInNjcm9sbGJhckZvcmVncm91bmQiLCJjbGFtcCIsIm1hc2siLCJfZHJhd01hc2siLCJlIiwibG9jYWwiLCJ0b0xvY2FsIiwiZGF0YSIsImdsb2JhbCIsInkiLCJ4IiwicG9pbnRlckRvd24iLCJ0eXBlIiwibGFzdCIsIndvcmxkU2NyZWVuV2lkdGgiLCJ1cGRhdGUiLCJzdG9wUHJvcGFnYXRpb24iLCJ3b3JsZFNjcmVlbkhlaWdodCIsInZhbHVlIiwicmVtb3ZlUGx1Z2luIiwib3ZlcmZsb3ci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b3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpXHJcbmNvbnN0IFZpZXdwb3J0ID0gcmVxdWlyZSgncGl4aS12aWV3cG9ydCcpXHJcblxyXG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKVxyXG5jb25zdCBERUZBVUxUUyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMuanNvbicpXHJcblxyXG4vKipcclxuICogcGl4aS5qcyBzY3JvbGxib3g6IGEgbWFza2VkIGNvbnRlbnQgYm94IHRoYXQgY2FuIHNjcm9sbCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseSB3aXRoIHNjcm9sbGJhcnNcclxuICovXHJcbmNsYXNzIFNjcm9sbGJveCBleHRlbmRzIFBJWEkuQ29udGFpbmVyXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgc2Nyb2xsYm94XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kcmFnU2Nyb2xsPXRydWVdIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93WD1hdXRvXSAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHRoaXMgY2hhbmdlcyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1k9YXV0b10gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3ddIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgc2V0cyBvdmVyZmxvd1ggYW5kIG92ZXJmbG93WSB0byB0aGlzIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuYm94V2lkdGg9MTAwXSB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveEhlaWdodD0xMDBdIGhlaWdodCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhclNpemU9MTBdIHNpemUgb2Ygc2Nyb2xsYmFyIChpbiBwaXhlbHMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZD0weGRkZGRkZF0gYmFja2dyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kPTB4ODg4ODg4XSBmb3JlZ3JvdW5kIGNvbG9yIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUylcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udGVudCBpbiBwbGFjZWQgaW4gaGVyZVxyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkNvbnRhaW5lcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBWaWV3cG9ydCh7IHNjcmVlbldpZHRoOiB0aGlzLmJveFdpZHRoLCBzY3JlZW5IZWlnaHQ6IHRoaXMuYm94SGVpZ2h0IH0pKVxyXG4gICAgICAgIHRoaXMuY29udGVudFxyXG4gICAgICAgICAgICAuZGVjZWxlcmF0ZSgpXHJcbiAgICAgICAgICAgIC5vbignbW92ZWQnLCAoKSA9PiB0aGlzLl9kcmF3U2Nyb2xsYmFycygpKVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5kcmFnKHsgY2xhbXBXaGVlbDogdHJ1ZSB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ3JhcGhpY3MgZWxlbWVudCBmb3IgZHJhd2luZyB0aGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAqIEB0eXBlIHtQSVhJLkdyYXBoaWNzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5HcmFwaGljcygpKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLm9uKCdwb2ludGVyZG93bicsIHRoaXMuc2Nyb2xsYmFyRG93biwgdGhpcylcclxuICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJtb3ZlJywgdGhpcy5zY3JvbGxiYXJNb3ZlLCB0aGlzKVxyXG4gICAgICAgIHRoaXMub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcmNhbmNlbCcsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwb3V0c2lkZScsIHRoaXMuc2Nyb2xsYmFyVXAsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5fbWFza0NvbnRlbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgZHJhZ1Njcm9sbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsXHJcbiAgICB9XHJcbiAgICBzZXQgZHJhZ1Njcm9sbCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1Njcm9sbCA9IHZhbHVlXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmRyYWcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlUGx1Z2luKCdkcmFnJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKS0gdGhpcyBjaGFuZ2VzIHRoZSBzaXplIGFuZCBub3QgdGhlIHNjYWxlIG9mIHRoZSBib3hcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBib3hXaWR0aCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgfVxyXG4gICAgc2V0IGJveFdpZHRoKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3hXaWR0aCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbldpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCBhbmQgb3ZlcmZsb3dZIHRvIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgY2hhbmdpbmcgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBzY3JvbGwgPSBhbHdheXMgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGhpZGRlbiA9IGhpZGUgb3ZlcmZsb3cgYW5kIGRvIG5vdCBzaG93IHNjcm9sbGJhclxyXG4gICAgICogYXV0byA9IGlmIGNvbnRlbnQgaXMgbGFyZ2VyIHRoYW4gYm94IHNpemUsIHRoZW4gc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBvdmVyZmxvdygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1xyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93KHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5vdmVyZmxvdyA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1ggdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1hcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1godmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93WSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vdmVyZmxvd1lcclxuICAgIH1cclxuICAgIHNldCBvdmVyZmxvd1kodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93WSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBpbmNsdWRpbmcgdGhlIHNjcm9sbGJhciAoaWYgdmlzaWJsZSkgLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHRcclxuICAgIH1cclxuICAgIHNldCBib3hIZWlnaHQodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveEhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5jb250ZW50LnNjcmVlbkhlaWdodCA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2Nyb2xsYmFyIHNpemUgaW4gcGl4ZWxzXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsYmFyU2l6ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplXHJcbiAgICB9XHJcbiAgICBzZXQgc2Nyb2xsYmFyU2l6ZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoIC0gKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBzY3JvbGxib3ggbGVzcyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgY29udGVudEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3hIZWlnaHQgLSAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhclZlcnRpY2FsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaXMgdGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHZpc2libGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBpc1Njcm9sbGJhckhvcml6b250YWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhckhvcml6b250YWxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvcCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsVG9wKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LnRvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbGVmdCBjb29yZGluYXRlIG9mIHNjcm9sbGJhclxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsTGVmdCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5sZWZ0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LndpZHRoXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2YgY29udGVudCBhcmVhXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxIZWlnaHQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBzY3JvbGxiYXJzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbCA9IHRoaXMub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyA/IHRydWUgOiB0aGlzLm92ZXJmbG93WCA9PT0gJ2hpZGRlbicgPyBmYWxzZSA6IHRoaXMuY29udGVudC53aWR0aCA+IHRoaXMub3B0aW9ucy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsYmFyVmVydGljYWwgPSB0aGlzLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgPyB0cnVlIDogdGhpcy5vdmVyZmxvd1kgPT09ICdoaWRkZW4nID8gZmFsc2UgOiB0aGlzLmNvbnRlbnQuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmNsZWFyKClcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHt9XHJcbiAgICAgICAgb3B0aW9ucy5sZWZ0ID0gMFxyXG4gICAgICAgIG9wdGlvbnMucmlnaHQgPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBvcHRpb25zLnRvcCA9IDBcclxuICAgICAgICBvcHRpb25zLmJvdHRvbSA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRlbnQud2lkdGggKyAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY29udGVudC5oZWlnaHQgKyAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJUb3AgPSAodGhpcy5jb250ZW50LnRvcCAvIGhlaWdodCkgKiB0aGlzLmJveEhlaWdodFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFySGVpZ2h0ID0gKHRoaXMuYm94SGVpZ2h0IC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJMZWZ0ID0gKHRoaXMuY29udGVudC5sZWZ0IC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAodGhpcy5ib3hXaWR0aCAvIHdpZHRoKSAqIHRoaXMuYm94V2lkdGhcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgMCwgdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QoMCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuYm94V2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFyVG9wLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLnNjcm9sbGJhckxlZnQsIHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplLCB0aGlzLnNjcm9sbGJhcldpZHRoLCB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5jbGFtcChvcHRpb25zKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhd3MgbWFzayBsYXllclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2RyYXdNYXNrKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudFxyXG4gICAgICAgICAgICAuYmVnaW5GaWxsKDApXHJcbiAgICAgICAgICAgIC5kcmF3UmVjdCgwLCAwLCB0aGlzLmJveFdpZHRoLCB0aGlzLmJveEhlaWdodClcclxuICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIHRoaXMubWFzayA9IHRoaXMuX21hc2tDb250ZW50XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsIHdoZW4gc2Nyb2xsYm94IGNvbnRlbnQgY2hhbmdlc1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubWFzayA9IG51bGxcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudC5jbGVhcigpXHJcbiAgICAgICAgdGhpcy5fZHJhd1Njcm9sbGJhcnMoKVxyXG4gICAgICAgIHRoaXMuX2RyYXdNYXNrKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIGRvd24gb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyRG93bihlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJIb3Jpem9udGFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGxvY2FsLnkgPiB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnggPj0gdGhpcy5zY3JvbGxiYXJMZWZ0ICYmIGxvY2FsLnggPD0gdGhpcy5zY3JvbGxiYXJMZWZ0ICsgdGhpcy5zY3JvbGxiYXJXaWR0aClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0geyB0eXBlOiAnaG9yaXpvbnRhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuc2Nyb2xsYmFyTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbldpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueCA+IHRoaXMuYm94V2lkdGggLSB0aGlzLnNjcm9sbGJhclNpemUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID49IHRoaXMuc2Nyb2xsYmFyVG9wICYmIGxvY2FsLnkgPD0gdGhpcy5zY3JvbGxiYXJUb3AgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICd2ZXJ0aWNhbCcsIGxhc3Q6IGxvY2FsIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuc2Nyb2xsYmFyVG9wKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRvcCArPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5IZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wIC09IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBtb3ZlIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHBhcmFtIHtQSVhJLmludGVyYWN0aW9uLkludGVyYWN0aW9uRXZlbnR9IGVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhck1vdmUoZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyRG93bilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICdob3Jpem9udGFsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5sZWZ0ICs9IGxvY2FsLnggLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBvaW50ZXJEb3duLnR5cGUgPT09ICd2ZXJ0aWNhbCcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy50b0xvY2FsKGUuZGF0YS5nbG9iYWwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IGxvY2FsLnkgLSB0aGlzLnBvaW50ZXJEb3duLmxhc3QueVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93bi5sYXN0ID0gbG9jYWxcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbGJhclVwKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJEb3duID0gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbGJveCJdfQ==