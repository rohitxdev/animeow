import { Breadcrumbs } from '@components';
import { useAuthContext } from '@hooks';
import { ReactComponent as EditIcon } from '@icons/edit.svg';
import { api, axiosInstance } from '@utils';
import { useId, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import styles from './me.module.scss';

export const MePage = () => {
	const { isLoggedIn } = useAuthContext();
	const queryClient = useQueryClient();
	const id = useId();

	const { data } = useQuery(['me'], ({ signal }) => api.getMyProfile(signal), {
		enabled: isLoggedIn,
	});

	const joinedDate = useMemo(
		() =>
			data &&
			new Date(data.createdAt).toDateString().split(' ').slice(1).join(' '),
		[data],
	);

	const updateProfilePicture: React.FormEventHandler<HTMLInputElement> = async (
		e,
	) => {
		const file = e.currentTarget.files && e.currentTarget.files[0];
		try {
			await axiosInstance.putForm('/users/profile-picture', {
				file,
			});
			await queryClient.refetchQueries(['me']);
			toast.success('Profile picture has been changed successfully');
		} catch {
			toast.error('Could not change profile picture');
		}
	};

	return (
		<div className={styles.mePage}>
			<Breadcrumbs data={[{ name: 'Me', to: '.' }]} />
			{data && (
				<div>
					<div className={styles.profilePicture}>
						<img
							src={data.image_url ?? 'https://picsum.photos/100'}
							alt="Profile picture"
						/>
						<input
							type="file"
							accept="image/*"
							id={id}
							onInput={updateProfilePicture}
							hidden
						/>
						<label htmlFor={id} title="Change profile picture">
							<EditIcon />
						</label>
					</div>
					<p className={styles.username}>{data.username}</p>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<span className={styles.email}>{data.email}</span>
						<span className={styles.joinedDate}>{joinedDate}</span>
					</div>
				</div>
			)}
		</div>
	);
};
