import { ReactComponent as LoaderIcon } from '@assets/icons/loader.svg';
import { ErrorFallback, VideoPlayer } from '@components';
import { api } from '@utils';
import { useEffect, useId, useState } from 'react';
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
	const id = useId();
	const [isChecked, setIsChecked] = useState(false);
	return (
		<div className={styles.videoResolutionPicker}>
			<label htmlFor={id}>Options</label>
			<input
				type="checkbox"
				checked={isChecked}
				onClick={() => setIsChecked(!isChecked)}
				id={id}
				hidden
			/>
			<div className={styles.options}>
				<div>
					{availableResolutions.map((val, i) => (
						<button onClick={() => setVideoResolution(val)} key={val + i}>
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
	const [src, setSrc] = useState<string | null>(null);
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

	useEffect(() => {
		setSrc(
			data?.sources.find((val) => val.isM3U8 && val.quality === videoResolution)
				?.url ?? null,
		);
	}, [data, videoResolution]);

	if (isError) {
		return <p style={{ backgroundColor: 'red', color: 'white' }}>Error</p>;
	}

	return (
		<div className={styles.watch}>
			{isLoading && <LoaderIcon height={200} />}
			{data && src && (
				<div className={styles.videoWrapper}>
					<VideoResolutionPicker
						availableResolutions={data?.sources.map((val) => val.quality)}
						setVideoResolution={setVideoResolution}
					/>
					<VideoPlayer src={src} />
				</div>
			)}
		</div>
	);
};
