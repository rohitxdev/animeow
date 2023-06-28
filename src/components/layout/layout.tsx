import { ReactElement } from 'react';

import { Footer } from '../footer/footer';
import { NavBar } from '../nav-bar/nav-bar';
import styles from './layout.module.scss';

export const Layout = ({ children }: { children: ReactElement }) => {
	return (
		<div className={styles.layout}>
			<NavBar />
			{children}
			<Footer />
		</div>
	);
};
