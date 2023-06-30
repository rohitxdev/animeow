import WatchListIcon from '@assets/icons/bookmark-plus.svg';
import { ReactComponent as PlayIcon } from '@assets/icons/play.svg';
import { Head } from '@components';
// import { Carousel, EpisodesList, Loader } from '@components';
import { api } from '@utils';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';

import styles from './anime-details.module.scss';

export const AnimeDetailsPage = () => {
	const params = useParams();
	const animeId = params.animeId as string;

	const { data, isError } = useQuery(
		['watch', animeId],
		async ({ signal }) => api.getAnimeDetails({ animeId, signal }),
		{
			refetchOnWindowFocus: false,
			cacheTime: 1000 * 60 * 5,
		},
	);

	if (isError) {
		return <p style={{ backgroundColor: 'red', color: 'white' }}>Error</p>;
	}

	// const addToWatchList = async () => {
	// 	const res = await api.addToWatchList(animeId as string);
	// };

	const title = data?.title.english ?? data?.title.native;

	return (
		<>
			{data && (
				<Head>
					<title>Animeow | {title}</title>
					<meta property="og:title" content={title} />
					<meta property="og:description" content={data.description} />
				</Head>
			)}
			<div className={styles.animeDetailsPage}>
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

						<h4>{data?.year ?? <Skeleton style={{ width: '5ch' }} />}</h4>
						<h4>{data?.status ?? <Skeleton style={{ width: '10ch' }} />}</h4>
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
							to={`/details/${animeId}/watch/${episode.id}`}
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
