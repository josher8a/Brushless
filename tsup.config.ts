import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  target: 'node18',
  splitting: false,
  clean: true,
  dts: true,
})