import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { titleCase } from 'title-case'

const _name = 'react-sizeme'

process.env.BABEL_ENV = 'production'

const external = [
  'element-resize-detector',
  'invariant',
  'throttle-debounce',
  'prop-types',
  'react-dom',
  'shallowequal',
]

const input = 'src/index.js'
const output = {
  file: `dist/${_name}.js`,
  format: 'cjs',
  sourcemap: true,
  name: titleCase(_name.replace(/-/g, ' ')).replace(/ /g, ''),
  exports: 'auto',
}
const plugins = [
  resolve(),
  commonjs(),
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: [
      ['@babel/preset-env', { modules: false }],
      '@babel/preset-react',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
  }),
]

export default {
  external,
  input,
  output,
  plugins,
};
