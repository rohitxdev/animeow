import { Breadcrumbs, ErrorFallback, VideoPlayer } from '@components';
import { ReactComponent as BrokenFileIcon } from '@icons/broken-file.svg';
import { api } from '@utils';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import styles from './episode.module.scss';

export const EpisodePage = () => {
	const { animeId, episodeId } = useParams();
	const [videoResolution, setVideoResolution] = useState<string>('default');

	if (!animeId || !episodeId) {
		return (
			<ErrorFallback error={`'animeId' and 'episodeId' params are missing.`} />
		);
	}

	const { data: isStreamingEnabled } = useQuery(
		['is-streaming-enabled'],
		() => api.getIsStreamingEnabled(),
		{ placeholderData: true },
	);

	const { data: episodeData } = useQuery(
		['episode', episodeId],
		({ signal }) => api.getEpisodeDetails({ episodeId, signal }),
		{ refetchOnWindowFocus: false, cacheTime: 1000 * 60 * 5 },
	);

	const { data: sourceData, isError } = useQuery(
		['source', episodeId],
		({ signal }) => api.getEpisodeSources({ episodeId, signal }),
		{
			refetchOnWindowFocus: false,
			cacheTime: Infinity,
			enabled: isStreamingEnabled,
		},
	);

	const src =
		sourceData?.sources.find(
			(val) => val.isM3U8 && val.quality === videoResolution,
		)?.url ?? null;

	return (
		<div className={styles.episodePage}>
			<Breadcrumbs
				data={[
					{
						name: 'Anime',
						to: `/anime/${animeId}`,
					},
					{
						name: 'Episode',
						to: '.',
					},
				]}
			/>
			<div className={styles.videoContainer}>
				{isStreamingEnabled ? (
					isError ? (
						<div className={styles.error}>
							<BrokenFileIcon />
							<p>Could not load video &nbsp;:&#40;</p>
						</div>
					) : (
						<VideoPlayer
							src={src}
							sourceId={episodeId}
							availableResolutions={sourceData?.sources.map(
								(val) => val.quality,
							)}
							setVideoResolution={setVideoResolution}
						/>
					)
				) : (
					<div className={styles.error}>
						<p>Streaming has been disabled.</p>
					</div>
				)}
			</div>
			<h2>{episodeData ? episodeData?.title ?? 'N/A' : <Skeleton />}</h2>
			<p className={styles.description}>
				{episodeData ? (
					episodeData?.description ?? 'N/A'
				) : (
					<Skeleton count={6} />
				)}
			</p>
		</div>
	);
};
