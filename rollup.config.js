import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

import babelrc from './babel.config'; // must import, as base babelrc is needed by jest

import pkg from './package.json';

export default [
  {
    /* CommonJS */
    input: 'lib/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'default'
    },
    plugins: [
      nodeResolve(),
      commonjs(), // ensure dependencies are commonjs *prior* to transpilation
      babel({
        exclude: 'node_modules/**',
        babelrc: false, // override browserslistrc
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: 'usage',
              targets: 'maintained node versions'
            }
          ]
        ],
        comments: false
      })
    ]
  },
  {
    /* UMD */
    input: 'lib/index.js',
    output: {
      file: pkg.browser.replace(/\.min.js$/, '.js'),
      format: 'umd',
      name: 'tenure'
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        ...babelrc,
        babelHelpers: 'runtime',
        comments: false
      })
    ]
  },
  {
    /* Minified UMD */
    input: 'lib/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'tenure'
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        ...babelrc,
        babelHelpers: 'runtime',
        comments: false
      }),
      terser()
    ]
  },
  {
    /* ESM */
    input: 'lib/index.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        ...babelrc,
        babelHelpers: 'runtime',
        comments: false
      })
    ]
  }
];
