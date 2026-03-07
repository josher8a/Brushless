import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/Brushless.bs.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  splitting: false,
  clean: true,
  dts: true,
})