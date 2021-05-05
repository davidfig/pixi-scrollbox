import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

type OverflowScrollType = 'none' | 'scroll' | 'hidden' | 'auto'
type UnderflowType = 'center' | 'top' | 'left' | 'right' | 'bottom' | string
interface ResizeOptions {
    boxWidth?: number
    boxHeight?: number
    scrollWidth?: number
    scrollHeight?: number
}

interface ScrollBoxOptions {
    boxHeight?: number
    boxWidth?: number
    scrollbarSize?: number
    scrollbarBackground?: number
    scrollbarBackgroundAlpha?: number
    scrollbarForeground?: number
    scrollbarForegroundAlpha?: number
    dragScroll?: boolean
    stopPropagation?: boolean
    scrollbarOffsetHorizontal?: number
    scrollbarOffsetVertical?: number
    underflow?: UnderflowType
    fade?: boolean
    fadeScrollbar?: boolean
    fadeScrollbarTime?: number
    fadeScrollboxWait?: number
    fadeScrollboxEase?: string | Function
    passiveWheel?: boolean
    clampWheel?: boolean
    overflowX?: OverflowScrollType
    overflowY?: OverflowScrollType
    overflow?: OverflowScrollType
    noTicker?: boolean
    ticker?: PIXI.Ticker
    divWheel?: HTMLElement
}

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */
export declare class Scrollbox extends PIXI.Container {
    boxHeight: number
    boxWidth: number
    content: Viewport
    readonly contentHeight: number
    readonly contentWidth: number
    dirty: boolean
    disable: boolean
    dragScroll: boolean
    readonly isScrollbarHorizontal: boolean
    readonly isScrollbarVertical: boolean
    overflow: string
    overflowX: string
    overflowY: string
    scrollbar: PIXI.Graphics
    scrollbarOffsetHorizontal: number
    scrollbarOffsetVertical: number
    scrollbarSize: number
    scrollHeight: number
    scrollLeft: number
    scrollTop: number
    scrollWidth: number
    stopPropagation: boolean

    /**
     * create a scrollbox
     */
    constructor(options?: ScrollBoxOptions)

    /**
     * show the scrollbar and restart the timer for fade if options.fade is set
     */
    activateFade(): void

    /**
     * ensure that the bounding box is visible
     */
    ensureVisible(x: number, y: number, width: number, height: number): void

    /**
     * resize the mask for the container
     */
    resize(options?: ResizeOptions): void

    /**
     * call when scrollbox content changes
     */
    update(): void

    /**
     * called on each frame to update fade scrollbars (if enabled)
     */
    updateLoop(elapsed: number): void

    private _drawMask(): void
    private _drawScrollbars(): void

    /**
     * handle pointer down on scrollbar
     */
    private scrollbarDown(e: PIXI.InteractionEvent): void

    /**
     * handle pointer move on scrollbar
     */
    private scrollbarMove(e: PIXI.InteractionEvent): void

    /**
     * handle pointer down on scrollbar
     */
    private scrollbarUp(): void
}
