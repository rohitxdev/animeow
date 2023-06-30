import { useEffect, useRef } from 'react';
import HlsPlayer from 'react-hls-player';

import styles from './video-player.module.scss';

export const VideoPlayer = ({ src }: { src: string }) => {
	const playerRef = useRef<HTMLVideoElement | null>(null);
	const currentTimeStamp = useRef(
		Number(sessionStorage.getItem(`timestamp-${src}`)) ?? 0,
	);

	const setCurrentTimeStamp = (timeStamp: number) => {
		sessionStorage.setItem(`timestamp-${src}`, timeStamp.toString());
		currentTimeStamp.current = timeStamp;
	};

	useEffect(() => {
		if (playerRef.current) {
			playerRef.current.currentTime = currentTimeStamp.current;
		}
	}, [src]);

	return (
		<div className={styles.videoPlayer}>
			<HlsPlayer
				controls
				src={src}
				playerRef={playerRef}
				onProgress={(e) => {
					setCurrentTimeStamp(e.currentTarget.currentTime);
				}}
			/>
		</div>
	);
};
