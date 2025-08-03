import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import preserveDirectives from 'rollup-plugin-preserve-directives'
import pkg from 'glob'
const { glob } = pkg

// --- Utility Functions ---
const inputFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['src/types.ts'] })

const createInputObject = (files) =>
  files.reduce((acc, file) => {
    const name = file.replace(/^src\//, '').replace(/\.(ts|tsx)$/, '')
    acc[name] = file
    return acc
  }, {})

const input = createInputObject(inputFiles)

function onwarnIgnoreUseClient(warning, warn) {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
    return // Ignore the specific 'use client' warning
  }
  warn(warning) // Otherwise, use the default `onwarn` handler
}

// --- Plugins ---
const commonPlugins = [
  peerDepsExternal(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.build.json',
    outDir: undefined,
  }),
  preserveDirectives(),
]

const declarationPlugins = [
  peerDepsExternal(),
  typescript({
    tsconfig: './tsconfig.build.json',
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: './dist/types',
  }),
]

// --- Output Configurations ---
const createOutputConfig = (format, dir, fileExtension) => ({
  dir,
  format,
  sourcemap: true,
  exports: 'named',
  entryFileNames: `[name].${fileExtension}`,
  preserveModules: true,
  preserveModulesRoot: 'src',
})

const cjsConfig = {
  input,
  onwarn: onwarnIgnoreUseClient,
  plugins: commonPlugins,
  output: createOutputConfig('cjs', 'dist/cjs', 'cjs'),
}

const esmConfig = {
  input,
  onwarn: onwarnIgnoreUseClient,
  plugins: commonPlugins,
  output: createOutputConfig('esm', 'dist/esm', 'mjs'),
}

const declarationsConfig = {
  input: createInputObject(glob.sync('src/**/*.{ts,tsx}')),
  onwarn: onwarnIgnoreUseClient,
  plugins: declarationPlugins,
  output: createOutputConfig('esm', 'dist/types', 'js'),
}

export default [cjsConfig, esmConfig, declarationsConfig]
