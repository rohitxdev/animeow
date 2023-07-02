import { useAuthContext } from '@hooks';
import { api } from '@utils';
import { useQuery } from 'react-query';

import { ToggleSwitch } from '../../components/toggle-switch/toggle-switch';
import styles from './admin.module.scss';

export const AdminPage = () => {
	const { isLoggedIn } = useAuthContext();

	const { data } = useQuery(['users'], ({ signal }) => api.getUsers(signal), {
		refetchInterval: 1000 * 10,
		enabled: isLoggedIn,
	});

	const { data: isStreamingEnabled } = useQuery(['is-streaming-enabled'], () =>
		api.getIsStreamingEnabled(),
	);

	return (
		<div className={styles.adminPage}>
			<div>
				<p>Enable/disable streaming</p>
				<ToggleSwitch
					initialValue={isStreamingEnabled}
					onClick={() => api.setIsStreamingEnabled(!isStreamingEnabled)}
				/>
			</div>
			{data && (
				<div style={{ overflow: 'auto' }}>
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
				</div>
			)}
		</div>
	);
};
