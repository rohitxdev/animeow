import { ReactComponent as NoInternetIcon } from '@assets/icons/no-internet.svg';
import stopImgSrc from '@assets/images/stop.png';
import { useAuthContext } from '@hooks';
import { Link } from 'react-router-dom';

import styles from './error-page.module.scss';

export const UnauthorizedPage = () => {
	const { setShowAuthModal } = useAuthContext();
	return (
		<>
			<div className={styles.unauthorizedPage}>
				<img src={stopImgSrc} alt="Stop sign" />
				{/* <ForbiddenIcon /> */}

				<h1>YOU ARE NOT AUTHORIZED TO VIEW THIS PAGE</h1>
				<div>
					<button onClick={() => setShowAuthModal(true)}>Log In</button>
					<Link to={'/'}>Go to home</Link>
				</div>
			</div>
		</>
	);
};

export const NotFoundPage = () => {
	return (
		<div className={styles.notFoundPage}>
			<h1>404</h1>
			<h2>OOPS! PAGE NOT FOUND</h2>
		</div>
	);
};

export const NoInternetPage = () => {
	return (
		<div className={styles.noInternetPage}>
			<NoInternetIcon aria-label="No internet" />
			<p>Please connect to the internet.</p>
		</div>
	);
};

export const LoadingPage = () => {
	return (
		<div className={styles.loadingPage}>
			<img src="/animeow-transparent.png" alt="Logo" />
		</div>
	);
};
