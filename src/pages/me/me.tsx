import { Breadcrumbs } from '@components';
import { useAuthContext } from '@hooks';
import { api } from '@utils';
import { useQuery } from 'react-query';

import styles from './me.module.scss';

export const MePage = () => {
	const { isLoggedIn } = useAuthContext();

	const { data } = useQuery(['me'], ({ signal }) => api.getMyProfile(signal), {
		enabled: isLoggedIn,
	});

	return (
		<div className={styles.mePage}>
			<Breadcrumbs data={[{ name: 'Me', to: '.' }]} />
			{data && (
				<>
					<h1>Hi there {data?.username}!</h1>
					<p>{data?.email}</p>
					<p>{data.role}</p>
				</>
			)}
		</div>
	);
};
