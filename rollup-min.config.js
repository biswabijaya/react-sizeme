import terser from '@rollup/plugin-terser'
import baseConfig from './rollup.config.js'

baseConfig.plugins.push(terser())
baseConfig.output.file = `dist/react-sizeme.min.js`

export default baseConfig