import { Breadcrumbs, Card, Pagination } from '@components';
import { api } from '@utils';
import { useMemo, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import styles from './view-all.module.scss';

interface ViewAllPageProps {
	page: 'popular' | 'recent';
}
export const ViewAllPage = ({ page }: ViewAllPageProps) => {
	const [searchParams] = useSearchParams();
	const totalPagesRef = useRef<number | null>(null);
	const currentPage = searchParams.get('page') ?? '1';
	const nullArray = useMemo(() => new Array(24).fill(null), []);

	const { data: popularData } = useQuery(
		['popular', currentPage],
		({ signal }) =>
			api.getPopularAnime({ signal, page: Number(currentPage), perPage: 24 }),
		{ enabled: page === 'popular' },
	);

	const { data: recentData } = useQuery(
		['recent', currentPage],
		({ signal }) =>
			api.getRecentAnime({ signal, page: Number(currentPage), perPage: 24 }),
		{ enabled: page === 'recent' },
	);

	if (!totalPagesRef.current) {
		if (page === 'popular') {
			totalPagesRef.current = popularData?.meta?.total ?? null;
		}
		if (page === 'recent') {
			totalPagesRef.current = recentData?.meta?.total ?? null;
		}
	}

	return (
		<div className={styles.viewAllPage}>
			{page === 'popular' && (
				<>
					<Breadcrumbs data={[{ name: 'Popular', to: '.' }]} />
					<h1>Popular Anime</h1>
					<div>
						{popularData
							? popularData.data.map((val) => (
									<Card
										data={{
											animeId: val.id,
											animeImg: val.coverImage,
											animeTitle:
												val.title.english ??
												val.title.userPreferred ??
												val.title.native,
											releaseDate: String(val.year ?? 'N/A'),
										}}
										key={val.id}
									/>
							  ))
							: nullArray.map((_, i) => <Card data={null} key={i} />)}
					</div>
				</>
			)}
			{page === 'recent' && (
				<>
					<Breadcrumbs data={[{ name: 'Recent', to: '.' }]} />
					<h1>Recently Released</h1>
					<div>
						{recentData
							? recentData.data.map((val) => (
									<Card
										data={{
											animeId: val.id,
											animeImg: val.anime.coverImage ?? val.image ?? '',
											animeTitle:
												val.anime.title.english ??
												val.anime.title.userPreferred ??
												val.anime.title.native,
											releaseDate: String(val.anime.year ?? 'N/A'),
										}}
										key={val.id}
									/>
							  ))
							: nullArray.map((_, i) => <Card data={null} key={i} />)}
					</div>
				</>
			)}
			<div style={{ marginInline: 'auto' }}>
				{totalPagesRef.current ? (
					<Pagination totalPages={totalPagesRef.current} />
				) : (
					<Skeleton width={'35ch'} />
				)}
			</div>
		</div>
	);
};
