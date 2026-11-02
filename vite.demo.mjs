import { resolve } from 'path'
import { defineConfig } from 'vite'

// the demo lives in demo/ and builds into docs/ for GitHub Pages (docs/jsdoc is left alone)
export default defineConfig({
    root: resolve(import.meta.dirname, 'demo'),
    base: './',
    build: {
        outDir: resolve(import.meta.dirname, 'docs'),
        emptyOutDir: false,
    },
})
