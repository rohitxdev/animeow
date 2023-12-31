import { Breadcrumbs, Head } from '@components';
import { ReactComponent as BrokenFileIcon } from '@icons/broken-file.svg';
import { ReactComponent as PlayIcon } from '@icons/play-2.svg';
import { api } from '@utils';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';

import styles from './anime.module.scss';

export const AnimePage = () => {
	const params = useParams();
	const animeId = params.animeId as string;

	const { data, isError, error } = useQuery(
		['anime', animeId],
		async ({ signal }) => api.getAnimeDetails({ animeId, signal }),
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 5,
		},
	);

	if (isError && error instanceof Error) {
		return (
			<div className={styles.error}>
				<BrokenFileIcon />
				<p>Could not get data &nbsp;:&#40;</p>
			</div>
		);
	}

	const title =
		data?.title.english ?? data?.title.userPreferred ?? data?.title.native;

	return (
		<>
			{data && (
				<Head>
					<title>Animeow | {title}</title>
					<meta property="og:title" content={title} />
					<meta property="og:description" content={data.description} />
				</Head>
			)}
			<div className={styles.animePage}>
				<Breadcrumbs data={[{ name: 'Anime', to: `.` }]} />
				<div className={styles.animeInfo}>
					<div>
						{data?.coverImage ? (
							<img src={data.coverImage} alt={animeId} />
						) : (
							<Skeleton></Skeleton>
						)}
					</div>
					<div>
						<h1>{title ?? <Skeleton />}</h1>
						{data ? (
							<div className={styles.genres}>
								{data?.genre.map((genre: string) => {
									return <span key={genre}>{genre}</span>;
								})}
							</div>
						) : (
							<div
								style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
							>
								{new Array(4).fill(null).map((val, i) => (
									<Skeleton
										key={i}
										style={{ height: '1.75rem', width: '8ch' }}
									/>
								))}
							</div>
						)}

						<h4>
							{data ? (
								data.year ?? 'N/A'
							) : (
								<Skeleton style={{ width: '5ch' }} />
							)}
						</h4>
						<h4>
							{data ? (
								data.status ?? 'N/A'
							) : (
								<Skeleton style={{ width: '10ch' }} />
							)}
						</h4>
						{/* <p style={{ backgroundColor: `${data?.color}` }}>{data?.color}</p> */}
					</div>
				</div>

				<p className={styles.description}>
					{data?.description ? (
						data.description.replace(/<[^>]+>/g, '')
					) : (
						<Skeleton count={8} />
					)}
				</p>

				<div
					className={[
						styles.episodesList,
						data && data.episodes.length >= 24 && styles.short,
					].join(' ')}
				>
					{data?.episodes.map((episode) => (
						<Link
							to={`/anime/${animeId}/episode/${episode.id}`}
							key={episode.id}
						>
							<span>{episode.number}</span>
							<h4>{episode.title}</h4>
							<PlayIcon />
						</Link>
					))}
				</div>
			</div>
		</>
	);
};
