import { Breadcrumbs, Card, Pagination } from '@components';
import { api } from '@utils';
import { useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import styles from './popular.module.scss';

export const PopularPage = () => {
	const [searchParams] = useSearchParams();
	const totalPagesRef = useRef<number | null>(null);
	const currentPage = searchParams.get('page') ?? '1';
	const { data } = useQuery(['popular', currentPage], ({ signal }) =>
		api.getPopularAnime({ signal, page: Number(currentPage), perPage: 24 }),
	);

	if (!totalPagesRef.current) {
		totalPagesRef.current = data?.meta?.total ?? null;
	}
	return (
		<div className={styles.popularPage}>
			<Breadcrumbs data={[{ name: 'Popular', to: '.' }]} />
			<h1>Popular Anime</h1>
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
							.map((_, i) => <Card data={null} key={i} />)}
			</div>
			<div style={{ marginInline: 'auto' }}>
				{totalPagesRef.current ? (
					<Pagination totalPages={totalPagesRef.current} />
				) : (
					<Skeleton style={{ width: 'min(75vw, 35ch)' }} />
				)}
			</div>
		</div>
	);
};
