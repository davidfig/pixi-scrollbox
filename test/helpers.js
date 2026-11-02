import { Container, Graphics, Point, updateRenderGroupTransforms } from 'pixi.js'
import { Scrollbox } from '../src/scrollbox'

/**
 * a minimal stand-in for pixi's EventSystem; the canvas sits at the page's top-left, so client coordinates
 * equal screen coordinates
 */
export function createEvents() {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    return {
        domElement: canvas,
        renderer: { canvas },
        mapPositionToPoint(point, x, y) {
            point.set(x, y)
        },
    }
}

/** creates a scrollbox on a stage with a content rectangle of the given size */
export function createScrollbox(options = {}, { width = 90, height = 1000 } = {}) {
    const events = createEvents()
    const stage = new Container({ isRenderGroup: true })
    const scrollbox = stage.addChild(new Scrollbox({ events, boxWidth: 100, boxHeight: 100, noTicker: true, ...options }))
    const box = scrollbox.content.addChild(new Graphics().rect(0, 0, width, height).fill(0xff0000))
    scrollbox.update()
    return { scrollbox, stage, events, box }
}

/** creates the parts of a FederatedPointerEvent that the scrollbox reads */
export function pointer(x, y) {
    return {
        global: new Point(x, y),
        stopPropagation() { },
    }
}

/** runs the scrollbox's update loop for a number of frames */
export function frames(scrollbox, count = 1, elapsed = 16) {
    for (let i = 0; i < count; i++) {
        scrollbox.updateLoop(elapsed)
    }
}

/** updates world transforms the way a render would (pixi 8 hit-testing reads them) */
export function render(stage) {
    updateRenderGroupTransforms(stage.renderGroup, true)
}

/** dispatches a native wheel event on an element */
export function wheel(target, init) {
    const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, ...init })
    target.dispatchEvent(event)
    return event
}
