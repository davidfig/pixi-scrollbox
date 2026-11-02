import { Application, Graphics, Sprite, Text, Texture } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Scrollbox } from '../src/scrollbox'
import { highlight } from './highlight'

let _app

function range(min, max) {
    return min + Math.random() * (max - min)
}

function circles(box, width, height) {
    for (let i = 0; i < 50; i++) {
        const radius = range(1, 50)
        box
            .circle(range(radius, width - radius), range(radius, height - radius), radius)
            .fill({ color: Math.floor(Math.random() * 0xffffff), alpha: Math.random() })
    }
}

function label(scrollbox, box, title) {
    const text = scrollbox.content.addChild(new Text({ text: ` ${title} `, style: { fill: 0xffffff, fontSize: 14 } }))
    box.rect(0, 0, text.width, text.height).fill(0)
}

function vertical() {
    const size = 500
    const scrollbox = _app.stage.addChild(new Scrollbox({
        boxWidth: 300,
        boxHeight: 300,
        events: _app.renderer.events,
    }))
    scrollbox.position.set(50, 75)
    const box = scrollbox.content.addChild(new Graphics())
    box.rect(0, 0, 290, size).fill({ color: 0xff0000, alpha: 0.25 })
    circles(box, 290, size)
    label(scrollbox, box, 'vertical scroll (drag anywhere)')
    scrollbox.update()
}

function horizontalVertical(title) {
    const size = 500
    const scrollbox = _app.stage.addChild(new Scrollbox({
        boxWidth: 300,
        boxHeight: 300,
        passiveWheel: false,
        stopPropagation: true,
        events: _app.renderer.events,
    }))
    scrollbox.position.set(400, 75)
    const box = scrollbox.content.addChild(new Graphics())
    box.rect(0, 0, size, size).fill({ color: 0xff0000, alpha: 0.25 })
    circles(box, size, size)
    label(scrollbox, box, title || 'horizontal and vertical scroll')
    scrollbox.update()
    return scrollbox
}

function horizontal() {
    const size = 600
    const scrollbox = _app.stage.addChild(new Scrollbox({
        boxWidth: 300,
        boxHeight: 300,
        overflowY: 'hidden',
        fade: true,
        scrollbarBackgroundAlpha: 0,
        scrollbarOffsetHorizontal: -10,
        wheelSwapAxes: true,
        events: _app.renderer.events,
    }))
    scrollbox.position.set(50, 425)
    const box = scrollbox.content.addChild(new Graphics())
    box.rect(0, 0, size, 290).fill({ color: 0xff0000, alpha: 0.25 })
    circles(box, size, 290)
    label(scrollbox, box, 'horizontal scroll (fade, wheelSwapAxes, scrollbarOffsetHorizontal=-10, scrollbarBackgroundAlpha=0)')
    scrollbox.update()
}

function buttons() {
    const scrollbox = _app.stage.addChild(new Scrollbox({
        boxWidth: 300,
        boxHeight: 300,
        events: _app.renderer.events,
    }))
    scrollbox.position.set(750, 75)
    label(scrollbox, scrollbox.content.addChild(new Graphics()), 'clickable content (hover and click)')
    for (let i = 0; i < 20; i++) {
        const button = scrollbox.content.addChild(new Graphics())
        button.y = 25 + i * 45
        button.eventMode = 'static'
        button.cursor = 'pointer'
        let clicks = 0
        const text = button.addChild(new Text({ text: `button ${i + 1}`, style: { fontSize: 16 } }))
        text.position.set(10, 10)
        const draw = (color) => button.clear().roundRect(0, 0, 280, 40, 6).fill(color)
        draw(0xdddddd)
        button.on('pointerover', () => draw(0xaaccff))
        button.on('pointerout', () => draw(0xdddddd))
        button.on('pointertap', () => text.text = `button ${i + 1}: clicked ${++clicks}`)
    }
    scrollbox.update()
}

function resize() {
    _app.renderer.resize(window.innerWidth, window.innerHeight)
}

window.onload = async function () {
    _app = new Application()
    await _app.init({
        backgroundAlpha: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        antialias: true,
    })
    document.body.appendChild(_app.canvas)
    _app.canvas.style.position = 'fixed'
    _app.canvas.style.left = '50px'
    _app.canvas.style.top = 0

    const viewport = _app.stage.addChild(new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        events: _app.renderer.events,
    }))
    const sprite = viewport.addChild(new Sprite(Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100
    viewport.drag({ wheel: false }).pinch().decelerate()
    horizontalVertical()
    vertical()
    horizontal()
    buttons()
    const nodrag = horizontalVertical('dragScroll=false (drag scrollbars to move)')
    nodrag.position.set(400, 425)
    nodrag.dragScroll = false
    window.addEventListener('resize', resize)
    highlight()
}
