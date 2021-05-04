import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import FPS from 'yy-fps'
import Random from 'yy-random'

import { Scrollbox } from '../src/scrollbox'
import highlight from './highlight.js'

let _app, _fps, g

function vertical() {
    const size = 500
    const scrollbox = _app.stage.addChild(new Scrollbox({
        boxWidth: 300,
        boxHeight: 300,
        divWheel: _app.view,
        interaction: _app.renderer.plugins.interaction,
    }))
    scrollbox.position.set(50, 75)
    const box = scrollbox.content.addChild(new PIXI.Graphics())
    box.beginFill(0xff0000, 0.25).drawRect(0, 0, 290, size).endFill()
    for (let i = 0; i < 50; i++) {
        const radius = Random.range(1, 50)
        box
            .beginFill(Random.color(), Random.get(1, true))
            .drawCircle(Random.range(radius, 300 - radius), Random.range(radius, size - radius), radius)
            .endFill()
    }
    const text = scrollbox.content.addChild(new PIXI.Text(' vertical scroll (drag anywhere)', { fill: 0xffffff, fontSize: 14 }))
    box.beginFill(0).drawRect(0, 0, text.width, text.height).endFill()
    scrollbox.update()
}

function horizontalVertical(title) {
    const scrollbox = _app.stage.addChild(new Scrollbox({
        boxWidth: 300,
        boxHeight: 300,
        passiveWheel: false,
        stopPropagation: true,
        divWheel: _app.view,
        interaction: _app.renderer.plugins.interaction,
    }))
    scrollbox.position.set(400, 75)
    const box = scrollbox.content.addChild(new PIXI.Graphics())
    const size = 500
    box.beginFill(0xff0000, 0.25).drawRect(0, 0, size, size).endFill()
    for (let i = 0; i < 50; i++) {
        const radius = Random.range(1, 50)
        box
            .beginFill(Random.color(), Random.get(1, true))
            .drawCircle(Random.range(radius, size - radius), Random.range(radius, size - radius), radius)
            .endFill()
    }
    const text = scrollbox.content.addChild(new PIXI.Text(' ' + (title ? title : 'horizontal and vertical scroll') + ' ', { fill: 0xffffff, fontSize: 14 }))
    box.beginFill(0).drawRect(0, 0, text.width, text.height).endFill()
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
        divWheel: _app.view,
        interaction: _app.renderer.plugins.interaction,
    }))
    scrollbox.position.set(50, 425)
    const box = scrollbox.content.addChild(new PIXI.Graphics())
    box.beginFill(0xff0000, 0.25).drawRect(0, 0, size, 290).endFill()
    for (let i = 0; i < 50; i++) {
        const radius = Random.range(1, 50)
        box
            .beginFill(Random.color(), Random.get(1, true))
            .drawCircle(Random.range(radius, size - radius), Random.range(radius, 290 - radius), radius)
            .endFill()
    }
    const text = scrollbox.content.addChild(new PIXI.Text(' horizontal scroll (fade=true, scrollbarOffsetHorizontal=-10, scrollbarBackgroundAlpha=0)', { fill: 0xffffff, fontSize: 14 }))
    box.beginFill(0).drawRect(0, 0, text.width, text.height).endFill()
    scrollbox.update()
}

function resize() {
    _app.renderer.resize(window.innerWidth, window.innerHeight)
}

window.onload = function () {
    _fps = new FPS({ side: 'bottom-left' })
    _app = new PIXI.Application({
        backgroundAlpha: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        antialias: true,
    })
    document.body.appendChild(_app.view)
    _app.view.style.position = 'fixed'
    _app.view.style.width = 'calc(100vw - 50px)'
    _app.view.style.height = '100vh'
    _app.view.style.left = '50px'
    _app.view.style.top = 0

    const viewport = _app.stage.addChild(new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        interaction: _app.renderer.plugins.interaction,
    }))
    const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100
    viewport.drag().pinch().decelerate()
    horizontalVertical()
    vertical()
    horizontal()
    const nodrag = horizontalVertical('dragScroll=false (drag scrollbars to move)')
    nodrag.position.set(400, 425)
    nodrag.dragScroll = false
    window.addEventListener('resize', resize)

    PIXI.Ticker.shared.add(() => {
        _fps.frame()
    })
    highlight()
}