import { ReactComponent as ChevronBackwardIcon } from '@icons/chevron-back-outline.svg';
import { ReactComponent as ChevronForwardIcon } from '@icons/chevron-forward-outline.svg';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import styles from './pagination.module.scss';

interface PaginationProps {
	totalPages: number;
}

export const Pagination = ({ totalPages }: PaginationProps) => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const pages = useMemo(
		() => new Array(totalPages > 10 ? 10 : totalPages).fill(null),
		[totalPages],
	);

	const getCurrentPage = () => {
		const page = searchParams.get('page');
		if (!page) {
			return 1;
		}
		const pageNum = parseInt(page);
		if (isNaN(pageNum) || pageNum <= 0) {
			return 1;
		}
		if (pageNum > totalPages) {
			return totalPages;
		}
		return pageNum;
	};

	const [currentPage, setCurrentPage] = useState(getCurrentPage());

	useEffect(() => {
		setCurrentPage(getCurrentPage());
	}, [location]);

	useEffect(() => {
		if (currentPage !== getCurrentPage()) {
			searchParams.set('page', `${currentPage}`);
			setSearchParams(searchParams);
		}
	}, [currentPage]);

	return (
		<div className={styles.pagination}>
			<button onClick={() => setCurrentPage((val) => (val > 1 ? val - 1 : 1))}>
				<ChevronBackwardIcon />
			</button>
			<div>
				{pages.map((_, i) => (
					<button
						key={i + 1}
						onClick={() => setCurrentPage(i + 1)}
						className={i + 1 === currentPage ? styles.current : undefined}
					>
						{i + 1}
					</button>
				))}
			</div>
			<button
				onClick={() =>
					setCurrentPage((val) => (val < pages.length ? val + 1 : val))
				}
			>
				<ChevronForwardIcon />
			</button>
		</div>
	);
};
