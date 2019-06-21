const PIXI = require('pixi.js')
const Scrollbox = require('../dist/scrollbox.js')

function fillMenu(container)
{
    for (let i = 0; i < 10; i++)
    {

        let nestContainer = new PIXI.Container();
        let nestFrame = new PIXI.Sprite();
        nestFrame.width = 200;
        nestFrame.height = 110;

        nestContainer.addChild(nestFrame);

        var nestToken = new PIXI.Sprite(PIXI.Texture.WHITE);
        nestToken.tint = Math.floor(Math.random() * 0xffffff)
        // nestToken.name = nest.name;
        // nestToken.isNest = true;
        nestToken.anchor.set(0.5, 0.5);
        // nestToken.scale.set(token_scale);
        // nestToken.interactive = true;
        // nestToken.buttonMode = true;
        // nestToken
        //     .on('pointerdown', onDragStart)
        //     .on('pointerup', onDragEnd)
        //     .on('pointerupoutside', onDragEnd)
        //     .on('pointermove', onDragMove);

        nestContainer.addChild(nestToken);

        nestToken.position.set(0, 0);

        // nests[i].instance = nestToken;

        let textStyle = new PIXI.TextStyle({
            wordWrap: true,
            wordWrapWidth: 200,
            fontFamily: "triogrotesk-normal-v102",
            fontSize: 22
        });
        let text = new PIXI.Text('test is really long sentence', textStyle);
        nestContainer.addChild(text);

        text.position.set(40, -text.height / 2);

        let y = i * 100;
        nestContainer.position.set(20 + nestToken.width / 2, y);
        container.addChild(nestContainer);
        nestToken.ix = nestToken.x;
        nestToken.iy = nestToken.y;

    }
}

function buildMenu()
{
    var menuBar = new PIXI.Container();
    app.stage.addChild(menuBar);

    menuBar.position.set(0, 0);

    menuBarBg = new PIXI.Graphics();
    menuBar.addChild(menuBarBg);

    menuBarBg.beginFill(0xF6F6F6);
    menuBarBg.drawRoundedRect(0, 0, 300, app.screen.height);
    menuBarBg.drawRect(0, 0, 50, app.screen.height);
    menuBarBg.endFill();

    menuScrollbox = new Scrollbox({
        overflowX: "none",
        overflowY: "hidden",
        underflow: "top-left",
        boxWidth: 300,
        boxHeight: app.screen.height,
        stopPropagation: false
    });
    menuScrollbox.position.set(0, 0);
    menuBar.addChild(menuScrollbox);

    let nests = new PIXI.Container();
    nests.position.set(0, 0);

    fillMenu(nests);
    menuScrollbox.content.addChild(nests);
    menuScrollbox.update();
}

var app, menuBarBg, menuScrollbox

window.onload = () => {
    app = new PIXI.Application()
    document.body.appendChild(app.view)
    buildMenu()
}