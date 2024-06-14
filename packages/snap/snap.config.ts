import type { SnapConfig } from '@metamask/snaps-cli';
import { resolve } from 'path';
// import 'dotenv/config';

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
    crypto: true,
    events: true,
    stream: true,
    string_decoder: true,
    util: true,
  },
  environment: {
    SNAP_ENV: process.env.SNAP_ENV ?? 'production',
  },
};

export default config;
