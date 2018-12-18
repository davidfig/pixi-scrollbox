# pixi-scrollbox
A configurable scrollbox designed for pixi.js.

Features:
* scrollbox uses a mask to clip to desired boxWidth/boxHeight size
* scrollbox scrolls with scrollbars (options.overflow=scroll)
* scrollbox's scrollbars may be hidden when not needed (options.overflow=auto or hidden)
* scrollbox may also be scrolled by dragging on the content window (options.dragScroll=true)

## Live Example
[davidfig.github.io/pixi-scrollbox/](https://davidfig.github.io/pixi-scrollbox/)

## Rationale
I needed a scrollbox for the UI of my game and since I had this nifty pixi-viewport, I figured it wouldn't be much work to create it. Five hours later and I realized I was a bit off on my estimates. Hopefully others will find it useful.

## Simple Example
```js
var PIXI = require('pixi.js');
var Viewport = require('pixi-scrollbox');

// create the scrollbox
var scrollbox = new Scrollbox({ boxWidth: 200, boxHeight: 200});

// add a sprite to the scrollbox's content
var sprite = scrollbox.content.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
sprite.width = sprite.height = 500;
sprite.tint = 0xff0000;

// add the viewport to the stage
var app = new PIXI.Application();
document.body.appendChild(app.view);
app.stage.addChild(scrollbox);
```

## Usage

```
npm i pixi-scrollbox pixi-viewport
```
or
```
yarn add pixi-scrollbox pixi-viewport
```

Note: pixi-viewport and pixi.js are listed as peerDependency, which means you will need to manually install them if they're not already installed (this is to ensure you don't have two versions of these libraries). My instructions above assume you have pixi.js installed (otherwise why would you be looking at this library).

or [download the latest build from github](https://github.com/davidfig/pixi-scrollbox/releases)
```html
<script src="/external-directory/pixi.js"></script>
<script src="/external-directory/pixi-viewport.min.js"></script>
<script src="/external-directory/scrollbox.min.js"></script>
<script>
    var Scrollbox = new PIXI.extras.Scrollbox(options);
</script>
```

## API Documentation
[https://davidfig.github.io/pixi-scrollbox/jsdoc/](https://davidfig.github.io/pixi-scrollbox/jsdoc/)

## license  
MIT License  
(c) 2018 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)