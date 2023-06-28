import WatchListIcon from '@assets/icons/bookmark-plus.svg';
import { Head } from '@components';
// import { Carousel, EpisodesList, Loader } from '@components';
import { api } from '@utils';
import { useState } from 'react';
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
			cacheTime: Infinity,
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
				</Head>
			)}
			<div className={styles.animeDetailsPage}>
				{data && (
					<>
						<div className={styles.animeInfo}>
							{data.coverImage && (
								<img
									className={styles.animeImg}
									src={data.coverImage}
									alt={animeId}
								/>
							)}
							<h2>{title}</h2>
							<div style={{ display: 'flex', flexWrap: 'wrap' }}>
								{data.genre.map((genre: string) => {
									return <span key={genre}>{genre}</span>;
								})}
								<h4>{data.year}</h4>
								<h4>{data.status}</h4>
								{/* <button className={styles.watchListBtn} onClick={addToWatchList}>
							<WatchListIcon />
							Add to watch list
						</button> */}
							</div>
							<p dangerouslySetInnerHTML={{ __html: data.description }}></p>
							<div className={styles.episodesList}>
								{data?.episodes.map((episode) => (
									<div key={episode.id}>
										<p>{episode.number}</p>
										<h4>{episode.title}</h4>
										{/* <p>{episode.description}</p> */}
										<Link to={`/details/${animeId}/watch/${episode.id}`}>
											Watch
										</Link>
									</div>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};
