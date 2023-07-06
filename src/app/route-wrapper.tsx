import { Layout } from '@components';
import { useAuthContext } from '@hooks';
import { UnauthorizedPage } from '@pages';
import { AuthRole } from '@types';

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
