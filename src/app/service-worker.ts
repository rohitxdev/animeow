import { env } from '@constants';
import { toast } from 'react-toastify';

export const registerServiceWorker = () => {
	if (
		import.meta.env.MODE === 'development'
			? env.IS_PWA_DEV_ENABLED
			: env.IS_PWA_ENABLED
	) {
		import('virtual:pwa-register')
			.then(({ registerSW }) =>
				registerSW({
					onNeedRefresh: () => {
						toast.info('A new update is available. Reload page to update');
					},
					onOfflineReady: () => {
						toast.info('App can now be used offline');
					},
				}),
			)
			.then((updateSW) => updateSW())
			.then(() => {
				console.log('Service worker registered 🤖');
			})
			.catch(() => {
				console.error('Service worker could not be registered ❌');
			});
	}
};
