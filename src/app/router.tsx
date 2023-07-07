import {
	AdminPage,
	AnimePage,
	EpisodePage,
	HomePage,
	MePage,
	NotFoundPage,
	ViewAllPage,
} from '@pages';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RouteWrapper } from './route-wrapper';

export const Router = () => {
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
			path: '/anime/:animeId',
			element: <RouteWrapper page={<AnimePage />} withLayout />,
		},
		{
			path: '/anime/:animeId/episode/:episodeId',
			element: <RouteWrapper page={<EpisodePage />} withLayout />,
		},
		{
			path: '/popular',
			element: (
				<RouteWrapper page={<ViewAllPage page="popular" />} withLayout />
			),
		},
		{
			path: '/recent',
			element: <RouteWrapper page={<ViewAllPage page="recent" />} withLayout />,
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
