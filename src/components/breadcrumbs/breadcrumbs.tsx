import { ReactComponent as ChevronIcon } from '@icons/chevron-forward-outline.svg';
import { ReactComponent as HomeIcon } from '@icons/home.svg';
import { Link } from 'react-router-dom';

import styles from './breadcrumbs.module.scss';
interface BreadcrumbsProps {
	data?: { name: string; to: string }[];
}

export const Breadcrumbs = ({ data }: BreadcrumbsProps) => {
	return (
		<ol className={styles.breadcrumbs}>
			<li>
				<Link to="/">
					<HomeIcon className={styles.homeIcon} />
				</Link>
			</li>
			{data?.map(({ name, to }, i) => (
				<li key={i}>
					<ChevronIcon />
					<Link to={to} aria-disabled={i === data.length - 1}>
						{name}
					</Link>
				</li>
			))}
		</ol>
	);
};
