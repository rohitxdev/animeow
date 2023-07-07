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
				disable: ENV_VARS.VITE_IS_PWA_ENABLED !== 'true',
				includeAssets: ['*.woff2', '*.png'],
				registerType: 'autoUpdate',
				devOptions: { enabled: ENV_VARS.VITE_IS_PWA_DEV_ENABLED === 'true' },
				manifest: {
					name: 'Animeow',
					description: 'Watch HD anime for free.',
					short_name: 'Animeow',
					start_url: '/',
					theme_color: '#e31c4e',
					background_color: '#000000',
					display: 'standalone',
					orientation: 'any',
					lang: 'en',
					scope: '/',
					icons: [
						{
							src: 'favicon-32x32.png',
							sizes: '32x32',
							type: 'image/png',
						},
						{
							src: 'favicon-96x96.png',
							sizes: '96x96',
							type: 'image/png',
						},
						{
							src: 'favicon-120x120.png',
							sizes: '120x120',
							type: 'image/png',
						},
						{
							src: 'favicon-152x152.png',
							sizes: '152x152',
							type: 'image/png',
						},
						{
							src: 'favicon-180x180.png',
							sizes: '180x180',
							type: 'image/png',
						},
						{
							src: 'favicon-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: 'favicon-maskable-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable',
						},
					],
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
				'@icons': resolve(__dirname, './src/icons'),
				'@components': resolve(__dirname, './src/components'),
				'@constants': resolve(__dirname, './src/constants'),
				'@contexts': resolve(__dirname, './src/contexts'),
				'@hooks': resolve(__dirname, './src/hooks'),
				'@pages': resolve(__dirname, './src/pages'),
				'@types': resolve(__dirname, './src/types'),
				'@utils': resolve(__dirname, './src/utils'),
				'@schemas': resolve(__dirname, './src/schemas'),
			},
		},
		server: { port: 3000, host: true },
		build: { assetsDir: './assets' },
	};
});
