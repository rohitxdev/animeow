import { ReactComponent as AnonymousIcon } from '@assets/icons/anonymous.svg';
import { ReactComponent as LogInIcon } from '@assets/icons/log-in.svg';
import { ReactComponent as LogOutIcon } from '@assets/icons/log-out.svg';
import { ReactComponent as PersonIcon } from '@assets/icons/person.svg';
import { ReactComponent as ServerIcon } from '@assets/icons/server.svg';
import { ReactComponent as UserIcon } from '@assets/icons/user.svg';
import { useAuthContext } from '@hooks';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './user-options.module.scss';

export const UserOptions = () => {
	const location = useLocation();
	const { isLoggedIn, setShowAuthModal, logOut, hasAccess, user } =
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
		setShowOptions(false);
		clearHideTimer();
	}, [isLoggedIn, location]);

	return (
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
					user?.image_url ? (
						<img src={user?.image_url} alt="Profile picture" />
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
								<p>{user?.username}</p>
								<p>{user?.email}</p>
							</div>
							<span className={styles.hLine}></span>
							<Link to={'/me'}>
								<PersonIcon />
								<span>Profile</span>
							</Link>
							<button onClick={logOut}>
								<LogOutIcon />
								<span>Log Out</span>
							</button>
						</>
					)}
					{hasAccess('admin') && (
						<Link to={'/admin'}>
							<ServerIcon />
							<span>Admin Panel</span>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};
