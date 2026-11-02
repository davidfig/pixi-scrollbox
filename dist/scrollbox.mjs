import { Container as e, Graphics as t, Ticker as n } from "pixi.js";
import { Viewport as r } from "pixi-viewport";
// \0rolldown/runtime.js
var i = Object.create, a = Object.defineProperty, o = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, c = Object.getPrototypeOf, l = Object.prototype.hasOwnProperty, u = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), d = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = s(t), c = 0, u = i.length, d; c < u; c++) d = i[c], !l.call(e, d) && d !== n && a(e, d, {
		get: ((e) => t[e]).bind(null, d),
		enumerable: !(r = o(t, d)) || r.enumerable
	});
	return e;
}, f = /* @__PURE__ */ ((e, t, n) => (n = e == null ? {} : i(c(e)), d(t || !e || !e.__esModule || !l.call(e, "default") ? a(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)))((/* @__PURE__ */ u(((e, t, n) => {
	(function() {
		var n = {
			linear: function(e, t, n, r) {
				return n * e / r + t;
			},
			easeInQuad: function(e, t, n, r) {
				return n * (e /= r) * e + t;
			},
			easeOutQuad: function(e, t, n, r) {
				return -n * (e /= r) * (e - 2) + t;
			},
			easeInOutQuad: function(e, t, n, r) {
				return (e /= r / 2) < 1 ? n / 2 * e * e + t : -n / 2 * (--e * (e - 2) - 1) + t;
			},
			easeInCubic: function(e, t, n, r) {
				return n * (e /= r) * e * e + t;
			},
			easeOutCubic: function(e, t, n, r) {
				return n * ((e = e / r - 1) * e * e + 1) + t;
			},
			easeInOutCubic: function(e, t, n, r) {
				return (e /= r / 2) < 1 ? n / 2 * e * e * e + t : n / 2 * ((e -= 2) * e * e + 2) + t;
			},
			easeInQuart: function(e, t, n, r) {
				return n * (e /= r) * e * e * e + t;
			},
			easeOutQuart: function(e, t, n, r) {
				return -n * ((e = e / r - 1) * e * e * e - 1) + t;
			},
			easeInOutQuart: function(e, t, n, r) {
				return (e /= r / 2) < 1 ? n / 2 * e * e * e * e + t : -n / 2 * ((e -= 2) * e * e * e - 2) + t;
			},
			easeInQuint: function(e, t, n, r) {
				return n * (e /= r) * e * e * e * e + t;
			},
			easeOutQuint: function(e, t, n, r) {
				return n * ((e = e / r - 1) * e * e * e * e + 1) + t;
			},
			easeInOutQuint: function(e, t, n, r) {
				return (e /= r / 2) < 1 ? n / 2 * e * e * e * e * e + t : n / 2 * ((e -= 2) * e * e * e * e + 2) + t;
			},
			easeInSine: function(e, t, n, r) {
				return -n * Math.cos(e / r * (Math.PI / 2)) + n + t;
			},
			easeOutSine: function(e, t, n, r) {
				return n * Math.sin(e / r * (Math.PI / 2)) + t;
			},
			easeInOutSine: function(e, t, n, r) {
				return -n / 2 * (Math.cos(Math.PI * e / r) - 1) + t;
			},
			easeInExpo: function(e, t, n, r) {
				return e === 0 ? t : n * 2 ** (10 * (e / r - 1)) + t;
			},
			easeOutExpo: function(e, t, n, r) {
				return e === r ? t + n : n * (-(2 ** (-10 * e / r)) + 1) + t;
			},
			easeInOutExpo: function(e, t, n, r) {
				return e === r && t + n, (e /= r / 2) < 1 ? n / 2 * 2 ** (10 * (e - 1)) + t : n / 2 * (-(2 ** (-10 * --e)) + 2) + t;
			},
			easeInCirc: function(e, t, n, r) {
				return -n * (Math.sqrt(1 - (e /= r) * e) - 1) + t;
			},
			easeOutCirc: function(e, t, n, r) {
				return n * Math.sqrt(1 - (e = e / r - 1) * e) + t;
			},
			easeInOutCirc: function(e, t, n, r) {
				return (e /= r / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + t : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
			},
			easeInElastic: function(e, t, n, r) {
				var i, a, o = 1.70158;
				return a = 0, i = n, e === 0 || (e /= r) === 1 && t + n, a ||= r * .3, i < Math.abs(n) ? (i = n, o = a / 4) : o = a / (2 * Math.PI) * Math.asin(n / i), -(i * 2 ** (10 * --e) * Math.sin((e * r - o) * (2 * Math.PI) / a)) + t;
			},
			easeOutElastic: function(e, t, n, r) {
				var i, a, o = 1.70158;
				return a = 0, i = n, e === 0 || (e /= r) === 1 && t + n, a ||= r * .3, i < Math.abs(n) ? (i = n, o = a / 4) : o = a / (2 * Math.PI) * Math.asin(n / i), i * 2 ** (-10 * e) * Math.sin((e * r - o) * (2 * Math.PI) / a) + n + t;
			},
			easeInOutElastic: function(e, t, n, r) {
				var i, a, o = 1.70158;
				return a = 0, i = n, e === 0 || (e /= r / 2) == 2 && t + n, a ||= .3 * 1.5 * r, i < Math.abs(n) ? (i = n, o = a / 4) : o = a / (2 * Math.PI) * Math.asin(n / i), e < 1 ? -.5 * (i * 2 ** (10 * --e) * Math.sin((e * r - o) * (2 * Math.PI) / a)) + t : i * 2 ** (-10 * --e) * Math.sin((e * r - o) * (2 * Math.PI) / a) * .5 + n + t;
			},
			easeInBack: function(e, t, n, r, i) {
				return i === void 0 && (i = 1.70158), n * (e /= r) * e * ((i + 1) * e - i) + t;
			},
			easeOutBack: function(e, t, n, r, i) {
				return i === void 0 && (i = 1.70158), n * ((e = e / r - 1) * e * ((i + 1) * e + i) + 1) + t;
			},
			easeInOutBack: function(e, t, n, r, i) {
				return i === void 0 && (i = 1.70158), (e /= r / 2) < 1 ? n / 2 * (e * e * (((i *= 1.525) + 1) * e - i)) + t : n / 2 * ((e -= 2) * e * (((i *= 1.525) + 1) * e + i) + 2) + t;
			},
			easeInBounce: function(e, t, r, i) {
				return r - n.easeOutBounce(i - e, 0, r, i) + t;
			},
			easeOutBounce: function(e, t, n, r) {
				return (e /= r) < 1 / 2.75 ? n * (7.5625 * e * e) + t : e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t : e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t;
			},
			easeInOutBounce: function(e, t, r, i) {
				var a;
				return e < i / 2 ? (a = n.easeInBounce(e * 2, 0, r, i), a * .5 + t) : (a = n.easeOutBounce(e * 2 - i, 0, r, i), a * .5 + r * .5 + t);
			}
		};
		(function(n) {
			return typeof e == "object" ? t.exports = n : typeof define == "function" && define.amd ? define([], n) : this.penner = n;
		})(n);
	}).call(n);
})))()), p = {
	boxWidth: 100,
	boxHeight: 100,
	scrollbarSize: 10,
	scrollbarBackground: 14540253,
	scrollbarBackgroundAlpha: 1,
	scrollbarForeground: 8947848,
	scrollbarForegroundAlpha: 1,
	dragScroll: !0,
	stopPropagation: !0,
	scrollbarOffsetHorizontal: 0,
	scrollbarOffsetVertical: 0,
	underflow: "top-left",
	fade: !1,
	fadeScrollbarTime: 1e3,
	fadeScrollboxWait: 3e3,
	fadeScrollboxEase: "easeInOutSine",
	passiveWheel: !1,
	clampWheel: !0,
	wheelSwapAxes: !1
}, m = class extends e {
	constructor(e = {}) {
		if (super(), this.options = Object.assign({}, p, e), !this.options.events) throw Error("pixi-scrollbox: options.events is required (e.g., new Scrollbox({ events: app.renderer.events }))");
		e.overflow && (this.options.overflowX = this.options.overflowY = e.overflow), e.fadeScrollbar && (this.options.fade = !0), this.options.ticker = e.ticker || n.shared, this.ease = typeof this.options.fadeScrollboxEase == "function" ? this.options.fadeScrollboxEase : f.default[this.options.fadeScrollboxEase], this.content = this.addChild(new r({
			passiveWheel: this.options.passiveWheel,
			stopPropagation: this.options.stopPropagation,
			screenWidth: this.options.boxWidth,
			screenHeight: this.options.boxHeight,
			events: this.options.events,
			noTicker: this.options.noTicker,
			ticker: this.options.ticker
		})), this.content.decelerate().on("moved", () => this._drawScrollbars()), this.scrollbar = this.addChild(new t()), this.scrollbar.eventMode = "static", this.scrollbar.hitArea = { contains: (e, t) => this._scrollbarContains(e, t) }, this.scrollbar.on("pointerdown", this.scrollbarDown, this), this.scrollbar.on("pointerup", this.scrollbarUp, this), this.scrollbar.on("pointerupoutside", this.scrollbarUp, this), this.scrollbar.on("pointercancel", this.scrollbarUp, this), this._maskContent = this.addChild(new t()), this._maskContent.eventMode = "none", this.update(), this.options.noTicker || (this.tickerFunction = () => this.updateLoop(Math.min(this.options.ticker.elapsedMS, 16.6667)), this.options.ticker.add(this.tickerFunction));
	}
	get scrollbarOffsetHorizontal() {
		return this.options.scrollbarOffsetHorizontal;
	}
	set scrollbarOffsetHorizontal(e) {
		this.options.scrollbarOffsetHorizontal = e;
	}
	get scrollbarOffsetVertical() {
		return this.options.scrollbarOffsetVertical;
	}
	set scrollbarOffsetVertical(e) {
		this.options.scrollbarOffsetVertical = e;
	}
	get disable() {
		return this._disabled;
	}
	set disable(e) {
		this._disabled !== e && (this._disabled = e, this.update());
	}
	get stopPropagation() {
		return this.options.stopPropagation;
	}
	set stopPropagation(e) {
		this.options.stopPropagation = e, this.content.options.stopPropagation = e;
	}
	get dragScroll() {
		return this.options.dragScroll;
	}
	set dragScroll(e) {
		this.options.dragScroll = e, e || this.content.plugins.remove("drag"), this.update();
	}
	get boxWidth() {
		return this.options.boxWidth;
	}
	set boxWidth(e) {
		this.options.boxWidth = e, this.content.screenWidth = e, this.update();
	}
	get overflow() {
		return this.options.overflow;
	}
	set overflow(e) {
		this.options.overflow = e, this.options.overflowX = e, this.options.overflowY = e, this.update();
	}
	get overflowX() {
		return this.options.overflowX;
	}
	set overflowX(e) {
		this.options.overflowX = e, this.update();
	}
	get overflowY() {
		return this.options.overflowY;
	}
	set overflowY(e) {
		this.options.overflowY = e, this.update();
	}
	get boxHeight() {
		return this.options.boxHeight;
	}
	set boxHeight(e) {
		this.options.boxHeight = e, this.content.screenHeight = e, this.update();
	}
	get scrollbarSize() {
		return this.options.scrollbarSize;
	}
	set scrollbarSize(e) {
		this.options.scrollbarSize = e;
	}
	get contentWidth() {
		return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
	}
	get contentHeight() {
		return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
	}
	get isScrollbarVertical() {
		return this._isScrollbarVertical;
	}
	get isScrollbarHorizontal() {
		return this._isScrollbarHorizontal;
	}
	get scrollTop() {
		return this.content.top;
	}
	set scrollTop(e) {
		this.content.top = e, this._clampAndDraw();
	}
	get scrollLeft() {
		return this.content.left;
	}
	set scrollLeft(e) {
		this.content.left = e, this._clampAndDraw();
	}
	get scrollWidth() {
		return this._scrollWidth || this.content.width;
	}
	set scrollWidth(e) {
		this._scrollWidth = e;
	}
	get scrollHeight() {
		return this._scrollHeight || this.content.height;
	}
	set scrollHeight(e) {
		this._scrollHeight = e;
	}
	_drawScrollbars() {
		this._isScrollbarHorizontal = this.overflowX === "scroll" || ["hidden", "none"].indexOf(this.overflowX) === -1 && this.scrollWidth > this.options.boxWidth, this._isScrollbarVertical = this.overflowY === "scroll" || ["hidden", "none"].indexOf(this.overflowY) === -1 && this.scrollHeight > this.options.boxHeight, this.scrollbar.clear();
		let e = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0), t = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
		this.scrollbarTop = this.content.top / t * this.boxHeight, this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop, this.scrollbarHeight = this.boxHeight / t * this.boxHeight, this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight, this.scrollbarLeft = this.content.left / e * this.boxWidth, this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft, this.scrollbarWidth = this.boxWidth / e * this.boxWidth, this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth;
		let n = {
			color: this.options.scrollbarBackground,
			alpha: this.options.scrollbarBackgroundAlpha
		}, r = {
			color: this.options.scrollbarForeground,
			alpha: this.options.scrollbarForegroundAlpha
		};
		this.isScrollbarVertical && this.scrollbar.rect(this._scrollbarVerticalX, 0, this.scrollbarSize, this.boxHeight).fill(n), this.isScrollbarHorizontal && this.scrollbar.rect(0, this._scrollbarHorizontalY, this.boxWidth, this.scrollbarSize).fill(n), this.isScrollbarVertical && this.scrollbar.rect(this._scrollbarVerticalX, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight).fill(r), this.isScrollbarHorizontal && this.scrollbar.rect(this.scrollbarLeft, this._scrollbarHorizontalY, this.scrollbarWidth, this.scrollbarSize).fill(r), this.activateFade();
	}
	get _scrollbarVerticalX() {
		return this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical;
	}
	get _scrollbarHorizontalY() {
		return this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal;
	}
	_scrollbarContains(e, t) {
		return this._disabled ? !1 : this.isScrollbarHorizontal && this._overHorizontal(e, t) ? !0 : this.isScrollbarVertical && this._overVertical(e, t);
	}
	_overHorizontal(e, t) {
		return e >= 0 && e <= this.boxWidth && t >= this._scrollbarHorizontalY && t <= this._scrollbarHorizontalY + this.scrollbarSize;
	}
	_overVertical(e, t) {
		return t >= 0 && t <= this.boxHeight && e >= this._scrollbarVerticalX && e <= this._scrollbarVerticalX + this.scrollbarSize;
	}
	_clampAndDraw() {
		let e = this.content.plugins.get("clamp", !0);
		e && e.update(), this._drawScrollbars();
	}
	_drawMask() {
		this._maskContent.rect(0, 0, this.boxWidth, this.boxHeight).fill(0), this.content.mask = this._maskContent;
	}
	update() {
		if (this.content.mask = null, this._maskContent.clear(), this._disabled) this.scrollbar.clear();
		else {
			this._drawScrollbars(), this._drawMask();
			let e = this.isScrollbarHorizontal && this.isScrollbarVertical ? "all" : this.isScrollbarHorizontal ? "x" : "y";
			this.options.dragScroll && this.content.drag({
				clampWheel: this.options.clampWheel,
				direction: e,
				wheelSwapAxes: this.options.wheelSwapAxes
			}), this.content.clamp({
				direction: e,
				underflow: this.options.underflow
			});
		}
	}
	updateLoop(e) {
		if (this.options.noTicker && this.content.update(e), this.fade) {
			if (this.fade.wait > 0) {
				if (this.fade.wait -= e, this.fade.wait <= 0) e = -this.fade.wait;
				else return;
			}
			this.fade.duration += e, this.fade.duration >= this.options.fadeScrollbarTime ? (this.fade = null, this.scrollbar.alpha = 0) : this.scrollbar.alpha = this.ease(this.fade.duration, 1, -1, this.options.fadeScrollbarTime), this.content.dirty = !0;
		}
	}
	get dirty() {
		return this.content.dirty;
	}
	set dirty(e) {
		this.content.dirty = e;
	}
	activateFade() {
		this.options.fade && (this.scrollbar.alpha = 1, this.fade = {
			wait: this.options.fadeScrollboxWait,
			duration: 0
		});
	}
	scrollbarDown(e) {
		let t = this.toLocal(e.global);
		this.isScrollbarHorizontal && this._overHorizontal(t.x, t.y) ? (t.x >= this.scrollbarLeft && t.x <= this.scrollbarLeft + this.scrollbarWidth ? this._startScrollbarDrag("horizontal", t) : (t.x > this.scrollbarLeft ? this.content.left += this.content.worldScreenWidth : this.content.left -= this.content.worldScreenWidth, this._clampAndDraw()), this.options.stopPropagation && e.stopPropagation()) : this.isScrollbarVertical && this._overVertical(t.x, t.y) && (t.y >= this.scrollbarTop && t.y <= this.scrollbarTop + this.scrollbarHeight ? this._startScrollbarDrag("vertical", t) : (t.y > this.scrollbarTop ? this.content.top += this.content.worldScreenHeight : this.content.top -= this.content.worldScreenHeight, this._clampAndDraw()), this.options.stopPropagation && e.stopPropagation());
	}
	_startScrollbarDrag(e, t) {
		this.pointerDown = {
			type: e,
			last: t
		}, this.scrollbar.on("globalpointermove", this.scrollbarMove, this);
	}
	scrollbarMove(e) {
		if (this.pointerDown) {
			let t = this.toLocal(e.global);
			if (this.pointerDown.type === "horizontal") {
				let e = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
				this.scrollbarLeft += t.x - this.pointerDown.last.x, this.content.left = this.scrollbarLeft / this.boxWidth * e;
			} else {
				let e = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
				this.scrollbarTop += t.y - this.pointerDown.last.y, this.content.top = this.scrollbarTop / this.boxHeight * e;
			}
			this.pointerDown.last = t, this._clampAndDraw(), this.options.stopPropagation && e.stopPropagation();
		}
	}
	scrollbarUp() {
		this.pointerDown = null, this.scrollbar.off("globalpointermove", this.scrollbarMove, this);
	}
	resize(e) {
		this.options.boxWidth = e.boxWidth === void 0 ? this.options.boxWidth : e.boxWidth, this.options.boxHeight = e.boxHeight === void 0 ? this.options.boxHeight : e.boxHeight, e.scrollWidth && (this.scrollWidth = e.scrollWidth), e.scrollHeight && (this.scrollHeight = e.scrollHeight), this.content.resize(this.options.boxWidth, this.options.boxHeight, this.scrollWidth, this.scrollHeight), this.update();
	}
	ensureVisible(e, t, n, r) {
		this.content.ensureVisible(e, t, n, r), this._drawScrollbars();
	}
	destroy(e) {
		this.tickerFunction &&= (this.options.ticker.remove(this.tickerFunction), null), this.scrollbarUp(), this.content.destroy(e), super.destroy(e);
	}
};
export { m as Scrollbox };

//# sourceMappingURL=scrollbox.mjs.map