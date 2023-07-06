import { Layout } from '@components';
import { useAuthContext } from '@hooks';
import { NoInternetPage, UnauthorizedPage } from '@pages';
import { AuthRole } from '@types';
import { useEffect, useState } from 'react';

interface RouteWrapperProps {
	page: React.ReactElement;
	withLayout?: boolean;
	requiredAuthRole?: AuthRole;
}

export const RouteWrapper = ({
	page,
	withLayout,
	requiredAuthRole,
}: RouteWrapperProps) => {
	const { hasAccess } = useAuthContext();
	const hasPageAccess = hasAccess(requiredAuthRole);
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	useEffect(() => {
		const onOnline = () => setIsOnline(true);
		const onOffline = () => setIsOnline(false);

		window.addEventListener('online', onOnline);
		window.addEventListener('offline', onOffline);

		return () => {
			window.removeEventListener('online', onOnline);
			window.removeEventListener('offline', onOffline);
		};
	}, []);

	if (!isOnline) {
		return <NoInternetPage />;
	}

	return (
		<>
			{!hasPageAccess ? (
				<UnauthorizedPage />
			) : withLayout ? (
				<Layout>{page}</Layout>
			) : (
				page
			)}
		</>
	);
};
