import {
	AdminPage,
	AnimeDetailsPage,
	HomePage,
	MePage,
	NotFoundPage,
	WatchPage,
} from '@pages';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RouteWrapper } from './route-wrapper';

export const Router = () => {
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
