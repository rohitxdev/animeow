import { Breadcrumbs, Card, Pagination } from '@components';
import { api } from '@utils';
import { useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import styles from './recent.module.scss';
export const RecentPage = () => {
	const [searchParams] = useSearchParams();
	const totalPagesRef = useRef<number | null>(null);
	const currentPage = searchParams.get('page') ?? '1';
	const { data } = useQuery(['recent', currentPage], ({ signal }) =>
		api.getRecentAnime({ signal, page: Number(currentPage) }),
	);

	if (!totalPagesRef.current) {
		totalPagesRef.current = data?.meta?.total ?? null;
	}
	return (
		<div className={styles.recentPage}>
			<Breadcrumbs data={[{ name: 'Recent', to: '.' }]} />
			<h1>Recently Released</h1>
			<div>
				{data
					? data.data.map((val) => (
							<Card
								data={{
									animeId: val.animeId,
									animeImg: val.anime.coverImage ?? val.image ?? '',
									animeTitle:
										val.anime.title.userPreferred ??
										val.anime.title.english ??
										val.anime.title.native,
									releaseDate: String(
										val.anime.year ??
											new Date(val.anime.updatedAt ?? '').getFullYear() ??
											'N/A',
									),
								}}
								key={val.id}
							/>
					  ))
					: new Array(20)
							.fill(null)
							.map((_, i) => <Card data={null} key={i} />)}
			</div>
			<div style={{ width: '40ch', marginInline: 'auto' }}>
				{totalPagesRef.current ? (
					<Pagination totalPages={totalPagesRef.current} />
				) : (
					<Skeleton />
				)}
			</div>
		</div>
	);
};
