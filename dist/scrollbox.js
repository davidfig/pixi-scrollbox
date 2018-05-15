'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = require('pixi.js');
var Viewport = require('pixi-viewport');
// const Viewport = require('../../pixi-viewport/src/viewport')

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
            _this.content.drag();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JvbGxib3guanMiXSwibmFtZXMiOlsiUElYSSIsInJlcXVpcmUiLCJWaWV3cG9ydCIsImRlZmF1bHRzIiwiREVGQVVMVFMiLCJTY3JvbGxib3giLCJvcHRpb25zIiwiY29udGVudCIsImFkZENoaWxkIiwic2NyZWVuV2lkdGgiLCJib3hXaWR0aCIsInNjcmVlbkhlaWdodCIsImJveEhlaWdodCIsImRlY2VsZXJhdGUiLCJvbiIsIl9kcmF3U2Nyb2xsYmFycyIsImRyYWdTY3JvbGwiLCJkcmFnIiwic2Nyb2xsYmFyIiwiR3JhcGhpY3MiLCJpbnRlcmFjdGl2ZSIsInNjcm9sbGJhckRvd24iLCJzY3JvbGxiYXJNb3ZlIiwic2Nyb2xsYmFyVXAiLCJfbWFza0NvbnRlbnQiLCJfaXNTY3JvbGxiYXJIb3Jpem9udGFsIiwib3ZlcmZsb3dYIiwid2lkdGgiLCJfaXNTY3JvbGxiYXJWZXJ0aWNhbCIsIm92ZXJmbG93WSIsImhlaWdodCIsImNsZWFyIiwibGVmdCIsInJpZ2h0Iiwic2Nyb2xsYmFyU2l6ZSIsInRvcCIsImJvdHRvbSIsImlzU2Nyb2xsYmFySG9yaXpvbnRhbCIsImlzU2Nyb2xsYmFyVmVydGljYWwiLCJzY3JvbGxiYXJUb3AiLCJzY3JvbGxiYXJIZWlnaHQiLCJzY3JvbGxiYXJMZWZ0Iiwic2Nyb2xsYmFyV2lkdGgiLCJiZWdpbkZpbGwiLCJzY3JvbGxiYXJCYWNrZ3JvdW5kIiwiZHJhd1JlY3QiLCJlbmRGaWxsIiwic2Nyb2xsYmFyRm9yZWdyb3VuZCIsImNsYW1wIiwibWFzayIsIl9kcmF3TWFzayIsImUiLCJsb2NhbCIsInRvTG9jYWwiLCJkYXRhIiwiZ2xvYmFsIiwieSIsIngiLCJwb2ludGVyRG93biIsInR5cGUiLCJsYXN0Iiwid29ybGRTY3JlZW5XaWR0aCIsInVwZGF0ZSIsInN0b3BQcm9wYWdhdGlvbiIsIndvcmxkU2NyZWVuSGVpZ2h0IiwidmFsdWUiLCJyZW1vdmVQbHVnaW4iLCJvdmVyZmxvdyIsIkNvbnRhaW5lciIs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ID0gcmVxdWlyZSgncGl4aS5qcycpXHJcbmNvbnN0IFZpZXdwb3J0ID0gcmVxdWlyZSgncGl4aS12aWV3cG9ydCcpXHJcbi8vIGNvbnN0IFZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vLi4vcGl4aS12aWV3cG9ydC9zcmMvdmlld3BvcnQnKVxyXG5cclxuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJylcclxuY29uc3QgREVGQVVMVFMgPSByZXF1aXJlKCcuL2RlZmF1bHRzLmpzb24nKVxyXG5cclxuLyoqXHJcbiAqIHBpeGkuanMgc2Nyb2xsYm94OiBhIG1hc2tlZCBjb250ZW50IGJveCB0aGF0IGNhbiBzY3JvbGwgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgd2l0aCBzY3JvbGxiYXJzXHJcbiAqL1xyXG5jbGFzcyBTY3JvbGxib3ggZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHNjcm9sbGJveFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZHJhZ1Njcm9sbD10cnVlXSB1c2VyIG1heSBkcmFnIHRoZSBjb250ZW50IGFyZWEgdG8gc2Nyb2xsIGNvbnRlbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vdmVyZmxvd1g9YXV0b10gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSB0aGlzIGNoYW5nZXMgd2hldGhlciB0aGUgc2Nyb2xsYmFyIGlzIHNob3duXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub3ZlcmZsb3dZPWF1dG9dIChzY3JvbGwsIGhpZGRlbiwgYXV0bykgdGhpcyBjaGFuZ2VzIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm92ZXJmbG93XSAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJveFdpZHRoPTEwMF0gd2lkdGggb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5ib3hIZWlnaHQ9MTAwXSBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyBzY3JvbGxiYXIgKGluIHBpeGVscylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5zY3JvbGxiYXJTaXplPTEwXSBzaXplIG9mIHNjcm9sbGJhciAoaW4gcGl4ZWxzKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnNjcm9sbGJhckJhY2tncm91bmQ9MHhkZGRkZGRdIGJhY2tncm91bmQgY29sb3Igb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2Nyb2xsYmFyRm9yZWdyb3VuZD0weDg4ODg4OF0gZm9yZWdyb3VuZCBjb2xvciBvZiBzY3JvbGxiYXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucywgREVGQVVMVFMpXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnRlbnQgaW4gcGxhY2VkIGluIGhlcmVcclxuICAgICAgICAgKiBAdHlwZSB7UElYSS5Db250YWluZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5hZGRDaGlsZChuZXcgVmlld3BvcnQoeyBzY3JlZW5XaWR0aDogdGhpcy5ib3hXaWR0aCwgc2NyZWVuSGVpZ2h0OiB0aGlzLmJveEhlaWdodCB9KSlcclxuICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgLmRlY2VsZXJhdGUoKVxyXG4gICAgICAgICAgICAub24oJ21vdmVkJywgKCkgPT4gdGhpcy5fZHJhd1Njcm9sbGJhcnMoKSlcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRyYWdTY3JvbGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZHJhZygpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBncmFwaGljcyBlbGVtZW50IGZvciBkcmF3aW5nIHRoZSBzY3JvbGxiYXJzXHJcbiAgICAgICAgICogQHR5cGUge1BJWEkuR3JhcGhpY3N9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLkdyYXBoaWNzKCkpXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIub24oJ3BvaW50ZXJkb3duJywgdGhpcy5zY3JvbGxiYXJEb3duLCB0aGlzKVxyXG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcm1vdmUnLCB0aGlzLnNjcm9sbGJhck1vdmUsIHRoaXMpXHJcbiAgICAgICAgdGhpcy5vbigncG9pbnRlcnVwJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVyY2FuY2VsJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLm9uKCdwb2ludGVydXBvdXRzaWRlJywgdGhpcy5zY3JvbGxiYXJVcCwgdGhpcylcclxuICAgICAgICB0aGlzLl9tYXNrQ29udGVudCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuR3JhcGhpY3MoKSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVzZXIgbWF5IGRyYWcgdGhlIGNvbnRlbnQgYXJlYSB0byBzY3JvbGwgY29udGVudFxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIGdldCBkcmFnU2Nyb2xsKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRyYWdTY3JvbGxcclxuICAgIH1cclxuICAgIHNldCBkcmFnU2Nyb2xsKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kcmFnU2Nyb2xsID0gdmFsdWVcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZHJhZygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVQbHVnaW4oJ2RyYWcnKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB3aWR0aCBvZiBzY3JvbGxib3ggaW5jbHVkaW5nIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpLSB0aGlzIGNoYW5nZXMgdGhlIHNpemUgYW5kIG5vdCB0aGUgc2NhbGUgb2YgdGhlIGJveFxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGJveFdpZHRoKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICB9XHJcbiAgICBzZXQgYm94V2lkdGgodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmJveFdpZHRoID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuV2lkdGggPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3ZlcmZsb3dYIGFuZCBvdmVyZmxvd1kgdG8gKHNjcm9sbCwgaGlkZGVuLCBhdXRvKSBjaGFuZ2luZyB3aGV0aGVyIHRoZSBzY3JvbGxiYXIgaXMgc2hvd25cclxuICAgICAqIHNjcm9sbCA9IGFsd2F5cyBzaG93IHNjcm9sbGJhclxyXG4gICAgICogaGlkZGVuID0gaGlkZSBvdmVyZmxvdyBhbmQgZG8gbm90IHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBhdXRvID0gaWYgY29udGVudCBpcyBsYXJnZXIgdGhhbiBib3ggc2l6ZSwgdGhlbiBzaG93IHNjcm9sbGJhclxyXG4gICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IG92ZXJmbG93KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93XHJcbiAgICB9XHJcbiAgICBzZXQgb3ZlcmZsb3codmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm92ZXJmbG93ID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WCB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dYKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WFxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dYID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXRzIG92ZXJmbG93WSB0byAoc2Nyb2xsLCBoaWRkZW4sIGF1dG8pIGNoYW5naW5nIHdoZXRoZXIgdGhlIHNjcm9sbGJhciBpcyBzaG93blxyXG4gICAgICogc2Nyb2xsID0gYWx3YXlzIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBoaWRkZW4gPSBoaWRlIG92ZXJmbG93IGFuZCBkbyBub3Qgc2hvdyBzY3JvbGxiYXJcclxuICAgICAqIGF1dG8gPSBpZiBjb250ZW50IGlzIGxhcmdlciB0aGFuIGJveCBzaXplLCB0aGVuIHNob3cgc2Nyb2xsYmFyXHJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXQgb3ZlcmZsb3dZKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm92ZXJmbG93WVxyXG4gICAgfVxyXG4gICAgc2V0IG92ZXJmbG93WSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMub3ZlcmZsb3dZID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoZWlnaHQgb2Ygc2Nyb2xsYm94IGluY2x1ZGluZyB0aGUgc2Nyb2xsYmFyIChpZiB2aXNpYmxlKSAtIHRoaXMgY2hhbmdlcyB0aGUgc2l6ZSBhbmQgbm90IHRoZSBzY2FsZSBvZiB0aGUgYm94XHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgYm94SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodFxyXG4gICAgfVxyXG4gICAgc2V0IGJveEhlaWdodCh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQuc2NyZWVuSGVpZ2h0ID0gdmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzY3JvbGxiYXIgc2l6ZSBpbiBwaXhlbHNcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxiYXJTaXplKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemVcclxuICAgIH1cclxuICAgIHNldCBzY3JvbGxiYXJTaXplKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50V2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYm94V2lkdGggLSAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGVpZ2h0IG9mIHNjcm9sbGJveCBsZXNzIHRoZSBzY3JvbGxiYXIgKGlmIHZpc2libGUpXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBjb250ZW50SGVpZ2h0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmJveEhlaWdodCAtICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlzIHRoZSB2ZXJ0aWNhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFyVmVydGljYWwoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpcyB0aGUgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdmlzaWJsZVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzU2Nyb2xsYmFySG9yaXpvbnRhbCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2Nyb2xsYmFySG9yaXpvbnRhbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdG9wIGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxUb3AoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQudG9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBsZWZ0IGNvb3JkaW5hdGUgb2Ygc2Nyb2xsYmFyXHJcbiAgICAgKi9cclxuICAgIGdldCBzY3JvbGxMZWZ0KClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmxlZnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHdpZHRoIG9mIGNvbnRlbnQgYXJlYVxyXG4gICAgICovXHJcbiAgICBnZXQgc2Nyb2xsV2lkdGgoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQud2lkdGhcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhlaWdodCBvZiBjb250ZW50IGFyZWFcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjcm9sbEhlaWdodCgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5oZWlnaHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXdzIHNjcm9sbGJhcnNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJIb3Jpem9udGFsID0gdGhpcy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnID8gdHJ1ZSA6IHRoaXMub3ZlcmZsb3dYID09PSAnaGlkZGVuJyA/IGZhbHNlIDogdGhpcy5jb250ZW50LndpZHRoID4gdGhpcy5vcHRpb25zLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5faXNTY3JvbGxiYXJWZXJ0aWNhbCA9IHRoaXMub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyA/IHRydWUgOiB0aGlzLm92ZXJmbG93WSA9PT0gJ2hpZGRlbicgPyBmYWxzZSA6IHRoaXMuY29udGVudC5oZWlnaHQgPiB0aGlzLm9wdGlvbnMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXIuY2xlYXIoKVxyXG4gICAgICAgIGxldCBvcHRpb25zID0ge31cclxuICAgICAgICBvcHRpb25zLmxlZnQgPSAwXHJcbiAgICAgICAgb3B0aW9ucy5yaWdodCA9IHRoaXMuY29udGVudC53aWR0aCArICh0aGlzLl9pc1Njcm9sbGJhclZlcnRpY2FsID8gdGhpcy5vcHRpb25zLnNjcm9sbGJhclNpemUgOiAwKVxyXG4gICAgICAgIG9wdGlvbnMudG9wID0gMFxyXG4gICAgICAgIG9wdGlvbnMuYm90dG9tID0gdGhpcy5jb250ZW50LmhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuY29udGVudC53aWR0aCArICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwgPyB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyU2l6ZSA6IDApXHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jb250ZW50LmhlaWdodCArICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbCA/IHRoaXMub3B0aW9ucy5zY3JvbGxiYXJTaXplIDogMClcclxuICAgICAgICB0aGlzLnNjcm9sbGJhclRvcCA9ICh0aGlzLmNvbnRlbnQudG9wIC8gaGVpZ2h0KSAqIHRoaXMuYm94SGVpZ2h0XHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJIZWlnaHQgPSAodGhpcy5ib3hIZWlnaHQgLyBoZWlnaHQpICogdGhpcy5ib3hIZWlnaHRcclxuICAgICAgICB0aGlzLnNjcm9sbGJhckxlZnQgPSAodGhpcy5jb250ZW50LmxlZnQgLyB3aWR0aCkgKiB0aGlzLmJveFdpZHRoXHJcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9ICh0aGlzLmJveFdpZHRoIC8gd2lkdGgpICogdGhpcy5ib3hXaWR0aFxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFyVmVydGljYWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCh0aGlzLmJveFdpZHRoIC0gdGhpcy5zY3JvbGxiYXJTaXplLCAwLCB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclxyXG4gICAgICAgICAgICAgICAgLmJlZ2luRmlsbCh0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyQmFja2dyb3VuZClcclxuICAgICAgICAgICAgICAgIC5kcmF3UmVjdCgwLCB0aGlzLmJveEhlaWdodCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5ib3hXaWR0aCwgdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICAgICAgLmVuZEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhclZlcnRpY2FsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJcclxuICAgICAgICAgICAgICAgIC5iZWdpbkZpbGwodGhpcy5vcHRpb25zLnNjcm9sbGJhckZvcmVncm91bmQpXHJcbiAgICAgICAgICAgICAgICAuZHJhd1JlY3QodGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5zY3JvbGxiYXJUb3AsIHRoaXMuc2Nyb2xsYmFyU2l6ZSwgdGhpcy5zY3JvbGxiYXJIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsYmFySG9yaXpvbnRhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyXHJcbiAgICAgICAgICAgICAgICAuYmVnaW5GaWxsKHRoaXMub3B0aW9ucy5zY3JvbGxiYXJGb3JlZ3JvdW5kKVxyXG4gICAgICAgICAgICAgICAgLmRyYXdSZWN0KHRoaXMuc2Nyb2xsYmFyTGVmdCwgdGhpcy5ib3hIZWlnaHQgLSB0aGlzLnNjcm9sbGJhclNpemUsIHRoaXMuc2Nyb2xsYmFyV2lkdGgsIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAgICAgIC5lbmRGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250ZW50LmNsYW1wKG9wdGlvbnMpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3cyBtYXNrIGxheWVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZHJhd01hc2soKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50XHJcbiAgICAgICAgICAgIC5iZWdpbkZpbGwoMClcclxuICAgICAgICAgICAgLmRyYXdSZWN0KDAsIDAsIHRoaXMuYm94V2lkdGgsIHRoaXMuYm94SGVpZ2h0KVxyXG4gICAgICAgICAgICAuZW5kRmlsbCgpXHJcbiAgICAgICAgdGhpcy5tYXNrID0gdGhpcy5fbWFza0NvbnRlbnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGwgd2hlbiBzY3JvbGxib3ggY29udGVudCBjaGFuZ2VzXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5tYXNrID0gbnVsbFxyXG4gICAgICAgIHRoaXMuX21hc2tDb250ZW50LmNsZWFyKClcclxuICAgICAgICB0aGlzLl9kcmF3U2Nyb2xsYmFycygpXHJcbiAgICAgICAgdGhpcy5fZHJhd01hc2soKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIHBvaW50ZXIgZG93biBvbiBzY3JvbGxiYXJcclxuICAgICAqIEBwYXJhbSB7UElYSS5pbnRlcmFjdGlvbi5JbnRlcmFjdGlvbkV2ZW50fSBlXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxiYXJEb3duKGUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICBpZiAodGhpcy5pc1Njcm9sbGJhckhvcml6b250YWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobG9jYWwueSA+IHRoaXMuYm94SGVpZ2h0IC0gdGhpcy5zY3JvbGxiYXJTaXplKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWwueCA+PSB0aGlzLnNjcm9sbGJhckxlZnQgJiYgbG9jYWwueCA8PSB0aGlzLnNjcm9sbGJhckxlZnQgKyB0aGlzLnNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlckRvd24gPSB7IHR5cGU6ICdob3Jpem9udGFsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5zY3JvbGxiYXJMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuV2lkdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQubGVmdCAtPSB0aGlzLmNvbnRlbnQud29ybGRTY3JlZW5XaWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTY3JvbGxiYXJWZXJ0aWNhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbC54ID4gdGhpcy5ib3hXaWR0aCAtIHRoaXMuc2Nyb2xsYmFyU2l6ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsLnkgPj0gdGhpcy5zY3JvbGxiYXJUb3AgJiYgbG9jYWwueSA8PSB0aGlzLnNjcm9sbGJhclRvcCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyRG93biA9IHsgdHlwZTogJ3ZlcnRpY2FsJywgbGFzdDogbG9jYWwgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbC55ID4gdGhpcy5zY3JvbGxiYXJUb3ApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudG9wICs9IHRoaXMuY29udGVudC53b3JsZFNjcmVlbkhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgLT0gdGhpcy5jb250ZW50LndvcmxkU2NyZWVuSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGhhbmRsZSBwb2ludGVyIG1vdmUgb24gc2Nyb2xsYmFyXHJcbiAgICAgKiBAcGFyYW0ge1BJWEkuaW50ZXJhY3Rpb24uSW50ZXJhY3Rpb25FdmVudH0gZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyTW92ZShlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJEb3duKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ2hvcml6b250YWwnKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChlLmRhdGEuZ2xvYmFsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmxlZnQgKz0gbG9jYWwueCAtIHRoaXMucG9pbnRlckRvd24ubGFzdC54XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucG9pbnRlckRvd24udHlwZSA9PT0gJ3ZlcnRpY2FsJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwoZS5kYXRhLmdsb2JhbClcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50b3AgKz0gbG9jYWwueSAtIHRoaXMucG9pbnRlckRvd24ubGFzdC55XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duLmxhc3QgPSBsb2NhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBoYW5kbGUgcG9pbnRlciBkb3duIG9uIHNjcm9sbGJhclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsYmFyVXAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckRvd24gPSBudWxsXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsYm94Il19