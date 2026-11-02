import { resolve } from 'path'
import { defineConfig } from 'vite'

const globals = {
    'pixi.js': 'PIXI',
    'pixi-viewport': 'pixi_viewport',
}

export default defineConfig({
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/scrollbox.js'),
            name: 'Scrollbox',
            formats: ['es', 'umd'],
            fileName: (format) => format === 'es' ? 'scrollbox.mjs' : 'scrollbox.js',
        },
        sourcemap: true,
        rollupOptions: {
            external: Object.keys(globals),
            output: { globals },
        },
    },
    test: {
        environment: 'jsdom',
        include: ['test/**/*.test.js'],
        setupFiles: ['test/setup.js'],
        // pixi-viewport has no "exports" map, so Node would load its CJS build (and a second, CJS copy of pixi.js)
        alias: { 'pixi-viewport': resolve(import.meta.dirname, 'node_modules/pixi-viewport/dist/pixi_viewport.js') },
    },
})
