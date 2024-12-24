import { readFileSync } from 'fs'
import { inInstall } from 'in-publish'
import prettyBytes from 'pretty-bytes'
import { sync } from 'gzip-size'
import { pipe } from 'ramda'
import { exec } from '../utils.js'

if (inInstall()) {
  process.exit(0)
}

const nodeEnv = Object.assign({}, process.env, {
  NODE_ENV: 'production',
})

exec('npx rollup -c rollup-min.config.js', nodeEnv)
exec('npx rollup -c rollup.config.js', nodeEnv)

function fileGZipSize(path) {
  return pipe(readFileSync, sync, prettyBytes)(path)
}

console.log(
  `\ngzipped, the build is ${fileGZipSize(`dist/react-sizeme.min.js`)}`,
)
