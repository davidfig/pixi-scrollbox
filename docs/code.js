const PIXI = require('pixi.js')
const FPS = require('yy-fps')
const Random = require('yy-random')

const Scrollbox = require('../src/scrollbox')

let _renderer, _fps, g

function vertical()
{
    const size = 500
    const scrollbox = _renderer.stage.addChild(new Scrollbox({ boxWidth: 300, boxHeight: 300 }))
    scrollbox.position.set(50, 75)
    const box = scrollbox.content.addChild(new PIXI.Graphics())
    box.beginFill(0xff0000, 0.25).drawRect(0, 0, 290, size).endFill()
    for (let i = 0; i < 50; i++)
    {
        const radius = Random.range(1, 50)
        box
            .beginFill(Random.color(), Random.get(1, true))
            .drawCircle(Random.range(radius, 290 - radius), Random.range(radius, size - radius), radius)
            .endFill()
    }
    const text = scrollbox.content.addChild(new PIXI.Text(' vertical scroll ', { fill: 0xffffff, fontSize: 14 }))
    box.beginFill(0).drawRect(0, 0, text.width, text.height).endFill()
    scrollbox.update()
}

function horizontalVertical(title)
{
    const scrollbox = _renderer.stage.addChild(new Scrollbox({ boxWidth: 300, boxHeight: 300 }))
    scrollbox.position.set(400, 75)
    const box = scrollbox.content.addChild(new PIXI.Graphics())
    const size = 500
    box.beginFill(0xff0000, 0.25).drawRect(0, 0, size, size).endFill()
    for (let i = 0; i < 50; i++)
    {
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

function horizontal()
{
    const size = 500
    const scrollbox = _renderer.stage.addChild(new Scrollbox({ boxWidth: 300, boxHeight: 300 }))
    scrollbox.position.set(50, 425)
    const box = scrollbox.content.addChild(new PIXI.Graphics())
    box.beginFill(0xff0000, 0.25).drawRect(0, 0, size, 290).endFill()
    for (let i = 0; i < 50; i++)
    {
        const radius = Random.range(1, 50)
        box
            .beginFill(Random.color(), Random.get(1, true))
            .drawCircle(Random.range(radius, size - radius), Random.range(radius, 290 - radius), radius)
            .endFill()
    }
    const text = scrollbox.content.addChild(new PIXI.Text(' horizontal scroll ', { fill: 0xffffff, fontSize: 14 }))
    box.beginFill(0).drawRect(0, 0, text.width, text.height).endFill()
    scrollbox.update()
}

function resize()
{
    _renderer.renderer.resize(window.innerWidth, window.innerHeight)
}

window.onload = function ()
{
    _fps = new FPS({ side: 'bottom-left' })
    _renderer = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio })
    document.body.appendChild(_renderer.view)
    _renderer.view.style.position = 'fixed'
    _renderer.view.style.width = '100vw'
    _renderer.view.style.height = '100vh'
    _renderer.view.style.left = 0
    _renderer.view.style.top = 0

    horizontalVertical()
    vertical()
    horizontal()
    const nodrag = horizontalVertical('dragScroll=false')
    nodrag.position.set(400, 425)
    nodrag.dragScroll = false
    window.addEventListener('resize', resize)

    PIXI.ticker.shared.add(() =>
    {
        _fps.frame()
    })
    require('./highlight')()
}