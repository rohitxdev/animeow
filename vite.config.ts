import { resolve } from 'node:path';

import react from '@vitejs/plugin-react-swc';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
	const ENV_VARS = loadEnv(mode, './');
	console.log(
		`\n\x1b[1m\x1b[37m<<< Environment variables in \x1b[35m${mode.toLocaleUpperCase()}\x1b[37m >>>\x1b[0m`,
	);
	console.table(
		Object.entries(ENV_VARS).map(([key, value]) => ({
			KEY: key,
			VALUE: value,
		})),
	);

	return {
		plugins: [
			react(),
			svgr(),
			VitePWA({
				disable: ENV_VARS.VITE_IS_PWA_ENABLED === 'true' ? false : true,
				registerType: 'prompt',
				devOptions: { enabled: Boolean(process.env.VITE_IS_PWA_DEV_ENABLED) },
				workbox: {
					globPatterns: ['./assets/*'],
				},
			}),
		],
		css: {
			modules: {
				localsConvention: 'camelCase',
				generateScopedName:
					mode === 'development' ? '[name]__[local]' : '[hash:base64:8]',
			},
			postcss: {
				plugins: [postcssPresetEnv({ stage: 1 })],
			},
		},
		resolve: {
			alias: {
				'@assets': resolve(__dirname, './src/assets'),
				'@components': resolve(__dirname, './src/components'),
				'@constants': resolve(__dirname, './src/constants'),
				'@contexts': resolve(__dirname, './src/contexts'),
				'@hooks': resolve(__dirname, './src/hooks'),
				'@pages': resolve(__dirname, './src/pages'),
				'@types': resolve(__dirname, './src/types'),
				'@utils': resolve(__dirname, './src/utils'),
			},
		},
		server: { port: 3000, host: true },
		build: { assetsDir: './assets' },
	};
});
