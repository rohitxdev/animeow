import { Breadcrumbs, Card, Pagination } from '@components';
import { api } from '@utils';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { useLocation, useSearchParams } from 'react-router-dom';

import styles from './popular.module.scss';

export const PopularPage = () => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get('page'));
	const [currentPage, setCurrentPage] = useState(page > 0 ? page : 1);

	const { data } = useQuery(['popular', currentPage], ({ signal }) =>
		api.getPopularAnime({ signal, page: currentPage, perPage: 24 }),
	);

	useEffect(() => {
		setSearchParams({ page: String(currentPage) });
	}, []);

	useEffect(() => {
		setCurrentPage(page > 0 ? page : 1);
	}, [location]);

	return (
		<div className={styles.popularPage}>
			<Breadcrumbs data={[{ name: 'Popular', to: '.' }]} />
			<h1>Popular</h1>
			<div>
				{data
					? data.data.map((val) => (
							<Card
								data={{
									animeId: val.id,
									animeImg: val.coverImage,
									animeTitle: val.title.english ?? val.title.native,
									releaseDate: String(val.year),
								}}
								key={val.id}
							/>
					  ))
					: new Array(24)
							.fill(null)
							.map((_, i) => (
								<Skeleton
									key={i}
									duration={1}
									className={styles.card}
								></Skeleton>
							))}
			</div>
			{data?.meta ? (
				<Pagination currentPage={currentPage} totalPages={data.meta.total} />
			) : (
				<Skeleton />
			)}
		</div>
	);
};
