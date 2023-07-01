import { ReactComponent as BrokenFileIcon } from '@assets/icons/broken-file.svg';
import { ReactComponent as LoaderIcon } from '@assets/icons/loader-2.svg';
import { ErrorFallback, VideoPlayer } from '@components';
import { api } from '@utils';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import styles from './watch.module.scss';

export const VideoResolutionPicker = ({
	availableResolutions,
	setVideoResolution,
}: {
	availableResolutions: string[];
	setVideoResolution: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [showOptions, setShowOptions] = useState(false);

	return (
		<div className={styles.videoResolutionPicker}>
			<button onClick={() => setShowOptions((val) => !val)}>Options</button>
			<div
				className={[
					styles.options,
					showOptions ? styles.show : styles.hide,
				].join(' ')}
			>
				<div>
					{availableResolutions.map((val, i) => (
						<button
							onClick={() => {
								setVideoResolution(val), setShowOptions(false);
							}}
							key={val + i}
						>
							{val}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export const WatchPage = () => {
	const { animeId, episodeId } = useParams();
	const [videoResolution, setVideoResolution] = useState<string>('default');

	if (!animeId || !episodeId) {
		return (
			<ErrorFallback error={`'animeId' and 'episodeId' params are missing.`} />
		);
	}

	const { data, isLoading, isError } = useQuery(
		['watch', episodeId],
		({ signal }) => api.getEpisodeDetails({ episodeId, signal }),
		{
			refetchOnWindowFocus: false,
			cacheTime: Infinity,
		},
	);

	const src =
		data?.sources.find((val) => val.isM3U8 && val.quality === videoResolution)
			?.url ?? null;

	return (
		<div className={styles.watch}>
			<div className={styles.videoContainer}>
				{isLoading && (
					<div className={styles.loading}>
						<LoaderIcon />
						<Skeleton baseColor="black" highlightColor="var(--dark)" />
					</div>
				)}
				{data && src && (
					<>
						<VideoResolutionPicker
							availableResolutions={data?.sources.map((val) => val.quality)}
							setVideoResolution={setVideoResolution}
						/>
						<VideoPlayer src={src} sourceId={episodeId} />
					</>
				)}
				{isError && (
					<div className={styles.error}>
						<BrokenFileIcon />
						<p>Could not load video &nbsp;:&#40;</p>
					</div>
				)}
			</div>
		</div>
	);
};
