import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import styles from './pagination.module.scss';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
	const cutTotalPages = totalPages > 10 ? 10 : totalPages;
	const pages = useMemo(
		() => new Array(cutTotalPages).fill(null),
		[cutTotalPages],
	);
	const [searchParams, setSearchParams] = useSearchParams();

	return (
		<div className={styles.pagination}>
			<button
				onClick={() => {
					if (currentPage > 1) {
						setSearchParams({
							page: `${Number(searchParams.get('page')) - 1}`,
						});
					}
				}}
			>
				Previous
			</button>
			<div>
				{pages.map((val, i) => (
					<button
						key={i + 1}
						onClick={() => setSearchParams({ page: `${i + 1}` })}
						className={i + 1 === currentPage ? styles.current : ''}
					>
						{i + 1}
					</button>
				))}
			</div>
			<button
				onClick={() => {
					if (currentPage < cutTotalPages) {
						setSearchParams({
							page: `${Number(searchParams.get('page')) + 1}`,
						});
					}
				}}
			>
				Next
			</button>
		</div>
	);
};
