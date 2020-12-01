import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [
{
    input: 'src/scrollbox.js',
    plugins: [
        peerDepsExternal(),
        resolve(
        {
            preferBuiltins: false
        }),
        commonjs(),
        terser()
    ],
    output:
    {
        file: 'dist/scrollbox.js',
        globals:
        {
            'pixi.js': 'PIXI',
            'pixi-viewport': 'Viewport'
        },
        format: 'umd',
        name: 'Scrollbox',
        sourcemap: true
    }
},
{
    input: 'src/scrollbox.js',
    plugins: [
        peerDepsExternal(),
        resolve(
        {
            preferBuiltins: false
        }),
        commonjs()
    ],
    output:
    {
        file: 'dist/scrollbox.es.js',
        format: 'esm',
        sourcemap: true
    }
}]