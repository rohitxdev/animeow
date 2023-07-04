import { ReactComponent as BrokenFileIcon } from '@assets/icons/broken-file.svg';
import { ErrorFallback, VideoPlayer } from '@components';
import { api } from '@utils';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import styles from './watch.module.scss';

export const WatchPage = () => {
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

	const { data, isError } = useQuery(
		['watch', episodeId],
		({ signal }) => api.getEpisodeSources({ episodeId, signal }),
		{
			refetchOnWindowFocus: false,
			cacheTime: Infinity,
			enabled: isStreamingEnabled,
		},
	);

	const src =
		data?.sources.find((val) => val.isM3U8 && val.quality === videoResolution)
			?.url ?? null;

	return (
		<div className={styles.watch}>
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
							availableResolutions={data?.sources.map((val) => val.quality)}
							setVideoResolution={setVideoResolution}
						/>
					)
				) : (
					<div className={styles.error}>
						<p>Streaming has been disabled.</p>
					</div>
				)}
			</div>
		</div>
	);
};
