import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['./src/index.ts',],
    splitting: false,
    sourcemap: true,
    outDir: 'dist',
    clean: true,
    format: ['cjs', 'esm'],
    dts: true,

})