import { ReactComponent as AnonymousIcon } from '@assets/icons/anonymous.svg';
import { ReactComponent as UserIcon } from '@assets/icons/user.svg';
import { useAppContext, useAuthContext } from '@hooks';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './user-options.module.scss';

export const UserOptions = () => {
	const { appState } = useAppContext();
	const { isLoggedIn, setShowAuthModal, logOut, hasAccess } = useAuthContext();
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
								Log In / Sign Up
							</button>
						)}
						{hasAccess('user') && (
							<>
								<Link to={'/me'}>Profile</Link>
								<button onClick={logOut}>Log out</button>
							</>
						)}
						{hasAccess('admin') && <Link to={'/admin'}>Admin Panel</Link>}
					</div>
				</div>
			</div>
		</>
	);
};
