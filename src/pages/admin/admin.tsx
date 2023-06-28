import { useAuthContext } from '@hooks';
import { api } from '@utils';
import { useQuery } from 'react-query';

import styles from './admin.module.scss';

export const AdminPage = () => {
	const { isLoggedIn } = useAuthContext();

	const { data } = useQuery(['users'], api.getUsers, {
		refetchInterval: 5000,
		enabled: isLoggedIn,
	});

	return (
		<div className={styles.adminPage}>
			{data && (
				<table>
					<thead>
						<tr>
							<td>Id</td>
							<td>Email</td>
							<td>Role</td>
							<td>Username</td>
							<td>Is Banned</td>
						</tr>
					</thead>
					<tbody>
						{data.map((val) => {
							return (
								<tr key={val.id}>
									<td>{val.id}</td>
									<td>{val.email}</td>
									<td>{val.role}</td>
									<td>{val.username}</td>
									<td>{String(val.is_banned)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};
