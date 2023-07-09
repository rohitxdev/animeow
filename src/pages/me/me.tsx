import { Breadcrumbs } from '@components';
import { useAuthContext } from '@hooks';
import { ReactComponent as EditIcon } from '@icons/edit.svg';
import { ReactComponent as SpinnerIcon } from '@icons/spinner.svg';
import { ReactComponent as UserIcon } from '@icons/user.svg';
import { api } from '@utils';
import imageCompression from 'browser-image-compression';
import { useId, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import styles from './me.module.scss';

export const MePage = () => {
	const id = useId();
	const { isLoggedIn } = useAuthContext();
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const { data: user } = useQuery(
		['me'],
		async ({ signal }) => await api.getMyProfile(signal),
		{
			enabled: isLoggedIn,
		},
	);

	const joinedDate = useMemo(
		() =>
			user &&
			new Date(user.createdAt).toDateString().split(' ').slice(1).join(' '),
		[user],
	);

	const deleteProfilePicture = async () => {
		try {
			setIsDeleting(true);
			await api.deleteProfilePicture();
			await queryClient.refetchQueries(['me']);
			toast.success('Deleted profile picture successfully');
		} catch (err) {
			toast.error('Could not delete profile picture');
		} finally {
			setIsDeleting(false);
		}
	};

	const updateProfilePicture: React.FormEventHandler<HTMLInputElement> = async (
		e,
	) => {
		const file = e.currentTarget.files && e.currentTarget.files[0];
		try {
			if (file) {
				setIsUploading(true);
				const compressedFile = await imageCompression(file, {
					maxSizeMB: 2,
					maxWidthOrHeight: 200,
				});
				await api.uploadProfilePicture(compressedFile);
				await queryClient.refetchQueries(['me']);
				toast.success('Profile picture has been changed successfully');
			}
		} catch {
			toast.error('Could not change profile picture');
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className={styles.mePage}>
			<Breadcrumbs data={[{ name: 'Me', to: '.' }]} />
			{user && (
				<div>
					<div className={styles.pfpContainer}>
						<div className={styles.profilePicture}>
							{user?.image_url ? (
								<img src={user.image_url} alt="Profile picture" />
							) : (
								<UserIcon aria-label="User placeholder picture" />
							)}
							<input
								type="file"
								accept="image/*"
								id={id}
								onInput={updateProfilePicture}
								required
								hidden
							/>
							{isUploading && (
								<div className={styles.uploading}>
									<SpinnerIcon />
								</div>
							)}
							<label htmlFor={id} title="Change profile picture">
								<EditIcon />
							</label>
						</div>
						{user?.image_url && (
							<button
								className={styles.deletePfp}
								onClick={deleteProfilePicture}
							>
								{isDeleting ? <SpinnerIcon /> : 'Delete'}
							</button>
						)}
					</div>
					<p className={styles.username}>{user.username}</p>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<span className={styles.email}>{user.email}</span>
						<span className={styles.joinedDate}>{joinedDate}</span>
					</div>
				</div>
			)}
		</div>
	);
};
