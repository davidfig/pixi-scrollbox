const PIXI = require('pixi.js')
const Viewport = require('pixi-viewport')

const defaults = require('./defaults')
const DEFAULTS = require('./defaults.json')

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */
class Scrollbox extends PIXI.Container
{
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
    constructor(options)
    {
        super()
        this.options = defaults(options, DEFAULTS)

        /**
         * content in placed in here
         * @type {PIXI.Container}
         */
        this.content = this.addChild(new Viewport({ screenWidth: this.boxWidth, screenHeight: this.boxHeight }))
        this.content
            .decelerate()
            .on('moved', () => this._drawScrollbars())
        if (this.options.dragScroll)
        {
            this.content.drag({ clampWheel: true })
        }

        /**
         * graphics element for drawing the scrollbars
         * @type {PIXI.Graphics}
         */
        this.scrollbar = this.addChild(new PIXI.Graphics())
        this.scrollbar.interactive = true
        this.scrollbar.on('pointerdown', this.scrollbarDown, this)
        this.interactive = true
        this.on('pointermove', this.scrollbarMove, this)
        this.on('pointerup', this.scrollbarUp, this)
        this.on('pointercancel', this.scrollbarUp, this)
        this.on('pointerupoutside', this.scrollbarUp, this)
        this._maskContent = this.addChild(new PIXI.Graphics())
    }

    /**
     * user may drag the content area to scroll content
     * @type {boolean}
     */
    get dragScroll()
    {
        return this.options.dragScroll
    }
    set dragScroll(value)
    {
        this.options.dragScroll = value
        if (value)
        {
            this.content.drag()
        }
        else
        {
            this.content.removePlugin('drag')
        }
        this.update()
    }

    /**
     * width of scrollbox including the scrollbar (if visible)- this changes the size and not the scale of the box
     * @type {number}
     */
    get boxWidth()
    {
        return this.options.boxWidth
    }
    set boxWidth(value)
    {
        this.options.boxWidth = value
        this.content.screenWidth = value
        this.update()
    }

    /**
     * sets overflowX and overflowY to (scroll, hidden, auto) changing whether the scrollbar is shown
     * scroll = always show scrollbar
     * hidden = hide overflow and do not show scrollbar
     * auto = if content is larger than box size, then show scrollbar
     * @type {string}
     */
    get overflow()
    {
        return this.options.overflow
    }
    set overflow(value)
    {
        this.options.overflow = value
        this.options.overflowX = value
        this.options.overflowY = value
        this.update()
    }

    /**
     * sets overflowX to (scroll, hidden, auto) changing whether the scrollbar is shown
     * scroll = always show scrollbar
     * hidden = hide overflow and do not show scrollbar
     * auto = if content is larger than box size, then show scrollbar
     * @type {string}
     */
    get overflowX()
    {
        return this.options.overflowX
    }
    set overflowX(value)
    {
        this.options.overflowX = value
        this.update()
    }

    /**
     * sets overflowY to (scroll, hidden, auto) changing whether the scrollbar is shown
     * scroll = always show scrollbar
     * hidden = hide overflow and do not show scrollbar
     * auto = if content is larger than box size, then show scrollbar
     * @type {string}
     */
    get overflowY()
    {
        return this.options.overflowY
    }
    set overflowY(value)
    {
        this.options.overflowY = value
        this.update()
    }

    /**
     * height of scrollbox including the scrollbar (if visible) - this changes the size and not the scale of the box
     * @type {number}
     */
    get boxHeight()
    {
        return this.options.boxHeight
    }
    set boxHeight(value)
    {
        this.options.boxHeight = value
        this.content.screenHeight = value
        this.update()
    }

    /**
     * scrollbar size in pixels
     * @type {number}
     */
    get scrollbarSize()
    {
        return this.options.scrollbarSize
    }
    set scrollbarSize(value)
    {
        this.options.scrollbarSize = value
    }

    /**
     * width of scrollbox less the scrollbar (if visible)
     * @type {number}
     * @readonly
     */
    get contentWidth()
    {
        return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0)
    }

    /**
     * height of scrollbox less the scrollbar (if visible)
     * @type {number}
     * @readonly
     */
    get contentHeight()
    {
        return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
    }

    /**
     * is the vertical scrollbar visible
     * @type {boolean}
     * @readonly
     */
    get isScrollbarVertical()
    {
        return this._isScrollbarVertical
    }

    /**
     * is the horizontal scrollbar visible
     * @type {boolean}
     * @readonly
     */
    get isScrollbarHorizontal()
    {
        return this._isScrollbarHorizontal
    }

    /**
     * top coordinate of scrollbar
     */
    get scrollTop()
    {
        return this.content.top
    }

    /**
     * left coordinate of scrollbar
     */
    get scrollLeft()
    {
        return this.content.left
    }

    /**
     * width of content area
     */
    get scrollWidth()
    {
        return this.content.width
    }

    /**
     * height of content area
     */
    get scrollHeight()
    {
        return this.content.height
    }

    /**
     * draws scrollbars
     * @private
     */
    _drawScrollbars()
    {
        this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : this.overflowX === 'hidden' ? false : this.content.width > this.options.boxWidth
        this._isScrollbarVertical = this.overflowY === 'scroll' ? true : this.overflowY === 'hidden' ? false : this.content.height > this.options.boxHeight
        this.scrollbar.clear()
        let options = {}
        options.left = 0
        options.right = this.content.width + (this._isScrollbarVertical ? this.options.scrollbarSize : 0)
        options.top = 0
        options.bottom = this.content.height + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
        const width = this.content.width + (this.isScrollbarVertical ? this.options.scrollbarSize : 0)
        const height = this.content.height + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
        this.scrollbarTop = (this.content.top / height) * this.boxHeight
        this.scrollbarHeight = (this.boxHeight / height) * this.boxHeight
        this.scrollbarLeft = (this.content.left / width) * this.boxWidth
        this.scrollbarWidth = (this.boxWidth / width) * this.boxWidth
        if (this.isScrollbarVertical)
        {
            this.scrollbar
                .beginFill(this.options.scrollbarBackground)
                .drawRect(this.boxWidth - this.scrollbarSize, 0, this.scrollbarSize, this.boxHeight)
                .endFill()
        }
        if (this.isScrollbarHorizontal)
        {
            this.scrollbar
                .beginFill(this.options.scrollbarBackground)
                .drawRect(0, this.boxHeight - this.scrollbarSize, this.boxWidth, this.scrollbarSize)
                .endFill()
        }
        if (this.isScrollbarVertical)
        {
            this.scrollbar
                .beginFill(this.options.scrollbarForeground)
                .drawRect(this.boxWidth - this.scrollbarSize, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight)
                .endFill()
        }
        if (this.isScrollbarHorizontal)
        {
            this.scrollbar
                .beginFill(this.options.scrollbarForeground)
                .drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize, this.scrollbarWidth, this.scrollbarSize)
                .endFill()
        }
        this.content.clamp(options)
    }

    /**
     * draws mask layer
     * @private
     */
    _drawMask()
    {
        this._maskContent
            .beginFill(0)
            .drawRect(0, 0, this.boxWidth, this.boxHeight)
            .endFill()
        this.mask = this._maskContent
    }

    /**
     * call when scrollbox content changes
     */
    update()
    {
        this.mask = null
        this._maskContent.clear()
        this._drawScrollbars()
        this._drawMask()
    }

    /**
     * handle pointer down on scrollbar
     * @param {PIXI.interaction.InteractionEvent} e
     * @private
     */
    scrollbarDown(e)
    {
        const local = this.toLocal(e.data.global)
        if (this.isScrollbarHorizontal)
        {
            if (local.y > this.boxHeight - this.scrollbarSize)
            {
                if (local.x >= this.scrollbarLeft && local.x <= this.scrollbarLeft + this.scrollbarWidth)
                {
                    this.pointerDown = { type: 'horizontal', last: local }
                }
                else
                {
                    if (local.x > this.scrollbarLeft)
                    {
                        this.content.left += this.content.worldScreenWidth
                        this.update()
                    }
                    else
                    {
                        this.content.left -= this.content.worldScreenWidth
                        this.update()
                    }
                }
                e.stopPropagation()
                return
            }
        }
        if (this.isScrollbarVertical)
        {
            if (local.x > this.boxWidth - this.scrollbarSize)
            {
                if (local.y >= this.scrollbarTop && local.y <= this.scrollbarTop + this.scrollbarWidth)
                {
                    this.pointerDown = { type: 'vertical', last: local }
                }
                else
                {
                    if (local.y > this.scrollbarTop)
                    {
                        this.content.top += this.content.worldScreenHeight
                        this.update()
                    }
                    else
                    {
                        this.content.top -= this.content.worldScreenHeight
                        this.update()
                    }
                }
                e.stopPropagation()
                return
            }
        }
    }

    /**
     * handle pointer move on scrollbar
     * @param {PIXI.interaction.InteractionEvent} e
     * @private
     */
    scrollbarMove(e)
    {
        if (this.pointerDown)
        {
            if (this.pointerDown.type === 'horizontal')
            {
                const local = this.toLocal(e.data.global)
                this.content.left += local.x - this.pointerDown.last.x
                this.pointerDown.last = local
                this.update()
            }
            else if (this.pointerDown.type === 'vertical')
            {
                const local = this.toLocal(e.data.global)
                this.content.top += local.y - this.pointerDown.last.y
                this.pointerDown.last = local
                this.update()
            }
            e.stopPropagation()
        }
    }

    /**
     * handle pointer down on scrollbar
     * @private
     */
    scrollbarUp()
    {
        this.pointerDown = null
    }
}

module.exports = Scrollbox