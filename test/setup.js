// jsdom has no canvas implementation; pixi only probes getContext, so return null instead of logging a warning
HTMLCanvasElement.prototype.getContext = () => null

// a renderer normally loads these: the federated events mixin and the mask effects
await import('pixi.js/browser')
