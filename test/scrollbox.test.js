import { describe, expect, it, vi } from 'vitest'
import { Container, EventBoundary, Graphics, Point, Ticker } from 'pixi.js'
import { Scrollbox } from '../src/scrollbox'
import { createEvents, createScrollbox, frames, pointer, render, wheel } from './helpers'

describe('Scrollbox', () => {
    it('requires options.events', () => {
        expect(() => new Scrollbox({ boxWidth: 100 })).toThrow(/options.events/)
    })

    it('shows only the scrollbars it needs', () => {
        const { scrollbox } = createScrollbox()
        expect(scrollbox.isScrollbarVertical).toBe(true)
        expect(scrollbox.isScrollbarHorizontal).toBe(false)
        expect(scrollbox.content.plugins.get('drag').options.direction).toBe('y')
    })

    it('uses the pixi 8 Graphics API for the scrollbar and mask', () => {
        const { scrollbox } = createScrollbox()
        expect(scrollbox.content.mask).toBe(scrollbox._maskContent)
        expect(scrollbox._maskContent.eventMode).toBe('none')
        expect(scrollbox.scrollbar.context.instructions.length).toBeGreaterThan(0)
    })

    it('pages down when clicking the vertical track below the thumb (#48)', () => {
        const { scrollbox } = createScrollbox()
        // the thumb is 10px tall at the top, the track is 100px; scrollbarWidth is 100px, which the old check used
        expect(scrollbox.scrollbarHeight).toBe(10)
        scrollbox.scrollbarDown(pointer(95, 50))
        expect(scrollbox.pointerDown).toBeFalsy()
        expect(scrollbox.scrollTop).toBe(100)
    })

    it('drags the vertical thumb and keeps dragging outside the scrollbar', () => {
        const { scrollbox } = createScrollbox()
        scrollbox.scrollbarDown(pointer(95, 5))
        expect(scrollbox.pointerDown.type).toBe('vertical')
        // globalpointermove fires even when the pointer leaves the scrollbar
        scrollbox.scrollbar.emit('globalpointermove', pointer(300, 15))
        expect(scrollbox.scrollTop).toBe(100)
        scrollbox.scrollbar.emit('pointerupoutside', pointer(300, 15))
        expect(scrollbox.pointerDown).toBeNull()
        scrollbox.scrollbar.emit('globalpointermove', pointer(300, 50))
        expect(scrollbox.scrollTop).toBe(100)
    })

    it('clamps when the thumb is dragged past the end', () => {
        const { scrollbox } = createScrollbox()
        scrollbox.scrollbarDown(pointer(95, 5))
        scrollbox.scrollbarMove(pointer(95, 500))
        expect(scrollbox.scrollTop).toBe(900)
    })

    it('hit-tests the scrollbar even when its background is transparent', () => {
        const { scrollbox } = createScrollbox({ scrollbarBackgroundAlpha: 0 })
        expect(scrollbox.scrollbar.hitArea.contains(95, 90)).toBe(true)
        expect(scrollbox.scrollbar.hitArea.contains(50, 50)).toBe(false)
    })

    it('restarts the fade timer on activity (#25)', () => {
        const { scrollbox } = createScrollbox({ fade: true, fadeScrollboxWait: 100, fadeScrollbarTime: 100 })
        frames(scrollbox, 8)
        expect(scrollbox.scrollbar.alpha).toBeLessThan(1)
        scrollbox.scrollTop = 50
        expect(scrollbox.scrollbar.alpha).toBe(1)
        frames(scrollbox, 4)
        expect(scrollbox.scrollbar.alpha).toBe(1)
        frames(scrollbox, 10)
        expect(scrollbox.scrollbar.alpha).toBe(0)
    })

    it('scrolls with the wheel when the scrollbox has moved (#20, #36)', () => {
        const { scrollbox, events } = createScrollbox()
        scrollbox.position.set(300, 300)
        wheel(events.domElement, { deltaY: 50, clientX: 50, clientY: 50 })
        expect(scrollbox.scrollTop + 0).toBe(0)
        wheel(events.domElement, { deltaY: 50, clientX: 350, clientY: 350 })
        expect(scrollbox.scrollTop).toBe(50)
    })

    it('calls preventDefault on wheel events it uses unless passiveWheel is set', () => {
        const { events } = createScrollbox()
        expect(wheel(events.domElement, { deltaY: 50, clientX: 50, clientY: 50 }).defaultPrevented).toBe(true)
        const passive = createScrollbox({ passiveWheel: true })
        expect(wheel(passive.events.domElement, { deltaY: 50, clientX: 50, clientY: 50 }).defaultPrevented).toBe(false)
    })

    it('scrolls a horizontal scrollbox with a mouse wheel when wheelSwapAxes is set (#51)', () => {
        const { scrollbox, events } = createScrollbox({ overflowY: 'hidden', wheelSwapAxes: true }, { width: 1000, height: 90 })
        wheel(events.domElement, { deltaY: 50, clientX: 50, clientY: 50 })
        expect(scrollbox.scrollLeft).toBe(50)
    })

    it('lets content receive pointer events after scrolling to the end (#11, #40, #57, #58)', () => {
        const { scrollbox, stage } = createScrollbox()
        const button = scrollbox.content.addChild(new Graphics().rect(0, 950, 90, 50).fill(0x00ff00))
        button.eventMode = 'static'
        scrollbox.update()
        const boundary = new EventBoundary(stage)
        frames(scrollbox)
        render(stage)
        expect(boundary.hitTest(50, 75)).not.toBe(button)
        scrollbox.scrollTop = 900
        frames(scrollbox)
        render(stage)
        expect(boundary.hitTest(50, 75)).toBe(button)
        // the masked-out part of the content can't be hit
        scrollbox.scrollTop = 880
        frames(scrollbox)
        render(stage)
        expect(boundary.hitTest(50, 105)).not.toBe(button)
    })

    it('drags content in the right direction when it or its parent is rotated (#60)', () => {
        for (const rotated of ['parent', 'scrollbox']) {
            const { scrollbox, stage } = createScrollbox({}, { width: 1000, height: 1000 })
            const parent = stage.addChild(new Container())
            parent.addChild(scrollbox)
            parent.position.set(200, 200)
            if (rotated === 'parent') {
                parent.rotation = Math.PI / 2
            }
            else {
                scrollbox.rotation = Math.PI / 2
            }
            // drag toward the scrollbox's top-left, which scrolls the content toward its bottom-right
            const points = [[80, 80], [70, 70], [30, 50]].map(([x, y]) => scrollbox.toGlobal(new Point(x, y)))
            const event = (point) => ({ ...pointer(point.x, point.y), pointerType: 'mouse', pointerId: 1, button: 0, buttons: 1, isPrimary: true })
            scrollbox.content.input.down(event(points[0]))
            scrollbox.content.input.move(event(points[1]))
            scrollbox.content.input.move(event(points[2]))
            expect(Math.round(scrollbox.scrollLeft)).toBe(50)
            expect(Math.round(scrollbox.scrollTop)).toBe(30)
        }
    })

    it('removes its ticker and wheel listener on destroy', () => {
        const ticker = new Ticker()
        const events = createEvents()
        const remove = vi.spyOn(events.domElement, 'removeEventListener')
        const scrollbox = new Scrollbox({ events, ticker })
        expect(ticker.count).toBe(2)
        scrollbox.destroy()
        expect(ticker.count).toBe(0)
        expect(remove).toHaveBeenCalledWith('wheel', expect.any(Function))
    })
})
