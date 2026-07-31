import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/condition.ts',
    'src/key-condition.ts',
    'src/update.ts',
    'src/projection.ts',
    'src/register.ts',
    'src/identifier.ts',
    'src/attribute-name.ts',
    'src/attribute-value.ts',
    'src/attribute-path.ts',
    'src/types.ts',
  ],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  target: 'node18',
  dts: true,
  clean: true,
  treeshake: true,
})
