import { swcDefaultsFactory } from '@nestjs/cli/lib/compiler/defaults/swc-defaults';

const swcDefaultConfig = swcDefaultsFactory().swcOptions;

export const module = {
  rules: [
    {
      test: /\.(tsx|ts|js|cjs|mjs)$/,
      exclude: /node_modules/,
      use: {
        loader: 'swc-loader',
        options: swcDefaultConfig,
      },
    },
  ],
};
