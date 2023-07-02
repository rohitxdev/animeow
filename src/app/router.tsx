import {
	AdminPage,
	AnimeDetailsPage,
	HomePage,
	MePage,
	NotFoundPage,
	WatchPage,
} from '@pages';
import { api } from '@utils';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RouteWrapper } from './route-wrapper';

export const Router = () => {
	useQuery(['is-streaming-enabled'], () => api.getIsStreamingEnabled());

	useEffect(() => {
		const onResize = () => {
			const root = document.getElementById('root');
			if (root) {
				root.style.setProperty('--vh', `${window.innerHeight}px`);
				root.style.setProperty('--vw', `${window.innerWidth}px`);
			}
		};

		onResize();
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	const router = createBrowserRouter([
		{ path: '*', element: <RouteWrapper page={<NotFoundPage />} /> },
		{
			path: '/',
			element: <RouteWrapper page={<HomePage />} withLayout />,
		},
		{
			path: '/details/:animeId',
			element: <RouteWrapper page={<AnimeDetailsPage />} withLayout />,
		},
		{
			path: '/details/:animeId/watch/:episodeId',
			element: <RouteWrapper page={<WatchPage />} withLayout />,
		},
		{
			path: '/me',
			element: (
				<RouteWrapper page={<MePage />} requiredAuthRole="user" withLayout />
			),
		},
		{
			path: '/admin',
			element: (
				<RouteWrapper
					page={<AdminPage />}
					requiredAuthRole="admin"
					withLayout
				/>
			),
		},
	]);

	return <RouterProvider router={router} />;
};
