import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import builtins from '@joseph184/rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

export default {
    input: 'docs/code.js',
    plugins: [
        builtins(),
        resolve({
            preferBuiltins: false,
            browser: true
        }),
        commonjs({
            namedExports: {
                'resource-loader': [ 'Resource' ]
            }
        }),
        globals()
    ],
    output:
    {
        file: 'docs/index.js',
        format: 'iife',
        sourcemap: true
    }
}