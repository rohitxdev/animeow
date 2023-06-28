import { useEffect, useRef } from 'react';
import HlsPlayer from 'react-hls-player';

import styles from './video-player.module.scss';

export const VideoPlayer = ({ src }: { src: string }) => {
	const playerRef = useRef<HTMLVideoElement | null>(null);
	const isPlaying = useRef(false);
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
		<div className={styles.videoContainer}>
			<HlsPlayer
				src={src}
				controls
				playerRef={playerRef}
				className={styles.videoPlayer}
				autoPlay={isPlaying.current}
				onPlay={() => {
					isPlaying.current = true;
				}}
				onPause={() => {
					isPlaying.current = false;
				}}
				onProgress={(e) => {
					setCurrentTimeStamp(e.currentTarget.currentTime);
				}}
			/>
		</div>
	);
};
