import { Container, DestroyOptions, EventSystem, FederatedPointerEvent, Graphics, Ticker } from 'pixi.js'
import type { Viewport } from 'pixi-viewport'

export type OverflowScrollType = 'none' | 'scroll' | 'hidden' | 'auto'
export type UnderflowType = 'center' | 'top' | 'left' | 'right' | 'bottom' | string
export interface ResizeOptions {
    boxWidth?: number
    boxHeight?: number
    scrollWidth?: number
    scrollHeight?: number
}

export interface ScrollboxOptions {
    /** the renderer's EventSystem (app.renderer.events) */
    events: EventSystem
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
    wheelSwapAxes?: boolean
    overflowX?: OverflowScrollType
    overflowY?: OverflowScrollType
    overflow?: OverflowScrollType
    noTicker?: boolean
    ticker?: Ticker
}

/**
 * pixi.js scrollbox: a masked content box that can scroll vertically or horizontally with scrollbars
 */
export declare class Scrollbox extends Container {
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
    overflow: OverflowScrollType
    overflowX: OverflowScrollType
    overflowY: OverflowScrollType
    scrollbar: Graphics
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
    constructor(options: ScrollboxOptions)

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

    /**
     * removes the ticker and the viewport's wheel listener, then destroys the scrollbox
     */
    destroy(options?: DestroyOptions): void

    private _drawMask(): void
    private _drawScrollbars(): void
    private _clampAndDraw(): void

    /**
     * handle pointer down on scrollbar
     */
    private scrollbarDown(e: FederatedPointerEvent): void

    /**
     * handle pointer move on scrollbar
     */
    private scrollbarMove(e: FederatedPointerEvent): void

    /**
     * handle pointer up on scrollbar
     */
    private scrollbarUp(): void
}
