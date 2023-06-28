import { Link } from 'react-router-dom';

import { Search } from '../search/search';
import { UserOptions } from '../user-options/user-options';
import styles from './nav-bar.module.scss';

export const NavBar = () => {
	return (
		<nav className={styles.navBar}>
			<Link to={'/'}>
				<img className={styles.logo} src="/animeow-fit.png" alt="Logo" />
			</Link>
			<Search />
			<UserOptions />
		</nav>
	);
};
