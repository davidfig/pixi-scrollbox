# pixi-scrollbox
A configurable scrollbox designed for pixi.js.

Features:
* scrollbox uses a mask to clip to desired boxWidth/boxHeight size
* scrollbox scrolls with scrollbars (options.overflow=scroll)
* scrollbox's scrollbars may be hidden when not needed (options.overflow=auto or hidden)
* scrollbox may also be scrolled by dragging on the content window (options.dragScroll=true)

## AI-assisted development

Starting in November 2026, [Claude](https://www.anthropic.com/claude) (an AI model by Anthropic) assists with editing this code, including code review, bug fixes, and changes to documentation. A maintainer reviews every change before it is released. If you prefer not to use software developed with AI assistance, please take this into account when choosing whether to use pixi-scrollbox.

## Live Example
[davidfig.github.io/pixi-scrollbox/](https://davidfig.github.io/pixi-scrollbox/)

## Rationale
I needed a scrollbox for the UI of my game and since I had this nifty pixi-viewport, I figured it wouldn't be much work to create it. Five hours later and I realized I was a bit off on my estimates. Hopefully others will find it useful.

## v3.0.0

Tested with pixi.js v8.22 and pixi-viewport v7.0. Use pixi-scrollbox v2 for older versions of pixi.js.

Breaking changes:

- Requires pixi.js v8 and pixi-viewport v7 (`peerDependencies` are now `pixi.js ^8` and `pixi-viewport ^7`).
- `options.events` is required: pass your renderer's EventSystem (`app.renderer.events`). pixi-viewport v7 uses it for wheel events and pointer positions.
- `options.interaction` and `options.divWheel` are removed. The wheel listener goes on `options.events.domElement` (normally the canvas).
- The ES module build is now `dist/scrollbox.mjs` (`dist/scrollbox.js` is still the UMD/CommonJS build).
- `options.passiveWheel` is now passed to the viewport (it was ignored before), so the page doesn't scroll when the wheel scrolls the scrollbox unless you set it to `true`.

Fixes and new options:

- Content inside the scrollbox gets pointer events (click, hover, pointerout) wherever it shows, including when scrolled to the end, and the mask never blocks them.
- The wheel scrolls the scrollbox at its current position after it moves or the canvas is resized or offset.
- Dragging the scrollbar keeps working when the pointer leaves the scrollbar, and clicking the vertical track below the thumb pages down instead of grabbing the thumb.
- The scrollbar stays clickable when its background is transparent or faded out.
- `options.fade` restarts its timer whenever the scrollbox scrolls.
- `options.wheelSwapAxes` lets a mouse wheel scroll a horizontal scrollbox.
- `scrollbox.destroy()` removes the ticker and the viewport's wheel listener.
- With `options.noTicker`, `updateLoop(elapsed)` also updates the viewport.

## Simple Example
```js
import { Application, Sprite, Texture } from 'pixi.js'
import { Scrollbox } from 'pixi-scrollbox'

const app = new Application()
await app.init()
document.body.appendChild(app.canvas)

// create the scrollbox
const scrollbox = app.stage.addChild(new Scrollbox({ boxWidth: 200, boxHeight: 200, events: app.renderer.events }))

// add a sprite to the scrollbox's content
const sprite = scrollbox.content.addChild(new Sprite(Texture.WHITE))
sprite.width = sprite.height = 500
sprite.tint = 0xff0000

// force an update of the scrollbox's calculations after updating the children
scrollbox.update()
```

`scrollbox.content` is a [pixi-viewport](https://github.com/pixijs-userland/pixi-viewport), so you can use any of its functions to move the content, e.g., `scrollbox.content.moveCorner(0, 0)`. To scroll a horizontal scrollbox with a mouse wheel, use `new Scrollbox({ overflowY: 'hidden', wheelSwapAxes: true, ... })`.

## Installation
```
npm i pixi-scrollbox pixi-viewport pixi.js
```
or
```
pnpm add pixi-scrollbox pixi-viewport pixi.js
```

Note: pixi-viewport and pixi.js are listed as peerDependency, which means you will need to manually install them if they're not already installed (this is to ensure you don't have two versions of these libraries).

or [download the latest build from github](https://github.com/davidfig/pixi-scrollbox/releases)
```html
<script src="/external-directory/pixi.js"></script>
<script src="/external-directory/pixi_viewport.umd.cjs"></script>
<script src="/external-directory/scrollbox.js"></script>
<script>
    const scrollbox = new Scrollbox.Scrollbox({ events: app.renderer.events })
</script>
```

The UMD build expects pixi.js and pixi-viewport to be loaded first as the globals `PIXI` and `pixi_viewport`.

## Migration from v2 to v3
Pass the renderer's EventSystem and remove `interaction` and `divWheel`:

```js
// v2
const scrollbox = new Scrollbox({ boxWidth: 200, boxHeight: 200, interaction: app.renderer.plugins.interaction, divWheel: app.view })

// v3
const scrollbox = new Scrollbox({ boxWidth: 200, boxHeight: 200, events: app.renderer.events })
```

## Migration from v1 to v2
Scrollbox no longer exports a default object. Instead you need to use:

```js
const Scrollbox = require('pixi-scrollbox').Scrollbox
```
or
```js
import { Scrollbox } from 'pixi-scrollbox'
```
There were some minor name changes to the fade options. See documentation.

## API Documentation
[https://davidfig.github.io/pixi-scrollbox/jsdoc/](https://davidfig.github.io/pixi-scrollbox/jsdoc/)

## Development Recipe

This project uses [pnpm](https://pnpm.io/) (the version is pinned in `package.json`'s `packageManager` field).

1. clone repository
2. pnpm install
3. pnpm dev
4. open browser to http://localhost:5173
5. pnpm test (tests use [Vitest](https://vitest.dev/) with jsdom)
6. pnpm run build-demo and pnpm run docs (build the demo and API docs into docs/)

## license
MIT License  
(c) 2019 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
