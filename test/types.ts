// compile-only check of @types/index.d.ts (run with `pnpm typecheck`)
import { Application, Graphics } from 'pixi.js'
import { Scrollbox } from '../@types/index'

const app = new Application()
const scrollbox: Scrollbox = new Scrollbox({ events: app.renderer.events, boxWidth: 200, boxHeight: 200, overflowY: 'hidden', wheelSwapAxes: true })
scrollbox.content.addChild(new Graphics().rect(0, 0, 500, 500).fill(0xff0000))
scrollbox.update()
scrollbox.scrollTop = 10
scrollbox.resize({ boxWidth: 100 })
scrollbox.content.moveCorner(0, 0)
scrollbox.destroy()

// @ts-expect-error events is required
new Scrollbox({ boxWidth: 100 })
