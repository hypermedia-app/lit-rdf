import { dts } from 'cem-plugin-dts'

export default {
  globs: ['src/components/**/*.ts'],
  litelement: true,
  plugins: [
    dts({
      path: './src/custom-elements.d.ts',
    }),
  ],
}
