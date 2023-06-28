import { ReactComponent as AnonymousIcon } from '@assets/icons/anonymous.svg';
import { ReactComponent as LogInIcon } from '@assets/icons/log-in.svg';
import { ReactComponent as LogOutIcon } from '@assets/icons/log-out.svg';
import { ReactComponent as PersonIcon } from '@assets/icons/person.svg';
import { ReactComponent as ServerIcon } from '@assets/icons/server.svg';
import { ReactComponent as UserIcon } from '@assets/icons/user.svg';
import { useAppContext, useAuthContext } from '@hooks';
import { axiosInstance } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './user-options.module.scss';

export const UserOptions = () => {
	const { appState, appDispatch } = useAppContext();
	const { isLoggedIn, setShowAuthModal, logOut, hasAccess, accessToken } =
		useAuthContext();
	const [showOptions, setShowOptions] = useState(false);
	const timerIdRef = useRef<number | null>(null);

	const clearHideTimer = () => {
		if (timerIdRef.current) {
			clearTimeout(timerIdRef.current);
		}
	};

	const setHideTimer = () => {
		clearHideTimer();
		timerIdRef.current = setTimeout(() => setShowOptions(false), 4000);
	};

	useEffect(() => {
		if (showOptions) {
			setShowOptions(false);
		}
		clearHideTimer();
	}, [isLoggedIn]);

	useEffect(() => {
		if (isLoggedIn && accessToken && !Object.keys(appState.user).length) {
			setTimeout(() => {
				axiosInstance
					.get('/users/me')
					.then(({ data }) =>
						appDispatch({ type: 'UPDATE_USER_DATA', payload: data }),
					);
			}, 100);
		}
	}, [isLoggedIn, accessToken]);

	console.log(appState);

	return (
		<>
			<div className={styles.options}>
				<button
					className={styles.profilePicture}
					key={String(isLoggedIn)}
					onClick={() => {
						setShowOptions(!showOptions);
						setHideTimer();
					}}
					onBlur={() => setShowOptions(false)}
				>
					{isLoggedIn ? (
						appState.user.image_url ? (
							<img src={appState.user.image_url} alt="Profile picture" />
						) : (
							<UserIcon aria-label="User placeholder picture" />
						)
					) : (
						<AnonymousIcon aria-label="Anonymous placeholder picture" />
					)}
				</button>
				<div
					className={[
						styles.dropDown,
						showOptions ? styles.show : styles.hide,
					].join(' ')}
					onMouseDown={(e) => e.preventDefault()}
					onClick={() => {
						setHideTimer();
					}}
				>
					<div>
						{!isLoggedIn && (
							<button onClick={() => setShowAuthModal(true)}>
								<LogInIcon />
								Log In
							</button>
						)}
						{hasAccess('user') && (
							<>
								<div className={styles.user}>
									<p>{appState.user.username}</p>
									<p>{appState.user.email}</p>
								</div>
								<span className={styles.hLine}></span>
								<Link to={'/me'}>
									<PersonIcon />
									Profile
								</Link>
								<button onClick={logOut}>
									<LogOutIcon />
									Log Out
								</button>
							</>
						)}
						{hasAccess('admin') && (
							<Link to={'/admin'}>
								<ServerIcon />
								Admin Panel
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
