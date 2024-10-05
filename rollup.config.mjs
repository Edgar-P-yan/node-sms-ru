// @ts-check

import { readFile } from 'node:fs/promises'

import typescript2 from 'rollup-plugin-typescript2'

const packageJSON = JSON.parse(await readFile('./package.json', 'utf-8'))

/**
 * Comment with library information to be appended in the generated bundles.
 */
const banner = `/*!
 * ${packageJSON.name} v${packageJSON.version}
 * (c) ${packageJSON.author.name}
 * Released under the ${packageJSON.license} License.
 */
`

/**
 * Creates an output options object for Rollup.js.
 * @param {import('rollup').OutputOptions} options
 * @returns {import('rollup').OutputOptions}
 */
function createOutputOptions(options) {
  return {
    banner,
    name: 'node-sms-ru',
    exports: 'named',
    sourcemap: true,
    ...options
  }
}

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: `src/node-sms-ru.ts`,
  output: [
    createOutputOptions({
      file: './dist/index.mjs',
      format: 'esm'
    }),
    createOutputOptions({
      file: './dist/index.esm.js',
      format: 'esm'
    })
  ],
  plugins: [
    typescript2({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig.bundle.json'
    })
  ]
}

export default options
