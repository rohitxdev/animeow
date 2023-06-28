import { useAuthContext } from '@hooks';
import { api } from '@utils';
import { useQuery } from 'react-query';

import styles from './me.module.scss';

export const MePage = () => {
	const { isLoggedIn } = useAuthContext();

	const { data } = useQuery(['me'], api.getMyProfile, {
		enabled: isLoggedIn,
	});

	return (
		<div className={styles.mePage}>
			{data && (
				<>
					<h1>Hi there {data.username}!</h1>
					<p>{data?.email}</p>
					<p>{data.role}</p>
				</>
			)}
		</div>
	);
};
