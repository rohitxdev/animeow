import { ReactComponent as ForwardIcon } from '@assets/icons/forward-10s.svg';
import { ReactComponent as PauseIcon } from '@assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from '@assets/icons/play.svg';
import { ReactComponent as RewindIcon } from '@assets/icons/rewind-10s.svg';
import { ReactComponent as SpeakerOffIcon } from '@assets/icons/speaker-off.svg';
import { ReactComponent as SpeakerOnIcon } from '@assets/icons/speaker-on.svg';
import { useEffect, useRef, useState } from 'react';
import HlsPlayer from 'react-hls-player';

import styles from './video-player.module.scss';

const VideoControls = ({
	playerRef,
}: {
	playerRef: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(Boolean(playerRef.current?.volume));
	const progressRef = useRef<HTMLInputElement | null>(null);

	const rewindBy10Seconds = () => {
		if (playerRef.current) {
			playerRef.current.currentTime -= 10;
		}
	};

	const forwardBy10Seconds = () => {
		if (playerRef.current) {
			playerRef.current.currentTime += 10;
		}
	};

	const toggleSpeaker = () => {
		setIsMuted((val) => !val);
	};

	useEffect(() => {
		if (playerRef.current) {
			isPlaying ? playerRef.current.play() : playerRef.current.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		if (playerRef.current) {
			if (isMuted) {
				playerRef.current.volume = 0;
			} else {
				playerRef.current.volume = 1;
			}
		}
	}, [isMuted]);

	useEffect(() => {
		const onVideoProgress = () => {
			if (playerRef.current && progressRef.current) {
				progressRef.current.value = String(playerRef.current.currentTime);

				sessionStorage.setItem(
					`timestamp-${playerRef.current.src}`,
					progressRef.current.value,
				);
			}
		};

		if (playerRef.current) {
			playerRef.current.currentTime =
				Number(sessionStorage.getItem(`timestamp-${playerRef.current.src}`)) ??
				0;
			playerRef.current.addEventListener('progress', onVideoProgress);
		}

		return () => {
			if (playerRef.current) {
				playerRef.current.removeEventListener('progress', onVideoProgress);
			}
		};
	}, []);

	return (
		<div className={styles.controls}>
			<button
				className={styles.playBtn}
				onClick={() => setIsPlaying(!isPlaying)}
			>
				{isPlaying ? <PauseIcon /> : <PlayIcon />}
				<span></span>
			</button>
			<div className={styles.toolBar}>
				<button onClick={rewindBy10Seconds}>
					<RewindIcon />
				</button>
				<button onClick={forwardBy10Seconds}>
					<ForwardIcon />
				</button>
				<div className={styles.progress}>
					<input
						type="range"
						min={0}
						max={playerRef.current?.duration ?? 24}
						onInput={(e) => {
							if (playerRef.current) {
								playerRef.current.currentTime = Number(e.currentTarget.value);
								sessionStorage.setItem(
									`timestamp-${playerRef.current.src}`,
									e.currentTarget.value,
								);
							}
						}}
						ref={progressRef}
					/>
				</div>
				<button onClick={toggleSpeaker}>
					{isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
				</button>
				{/* <button>Playback</button> */}
			</div>
		</div>
	);
};

export const VideoPlayer = ({ src }: { src: string }) => {
	const playerRef = useRef<HTMLVideoElement | null>(null);

	return (
		<div className={styles.videoPlayer}>
			<VideoControls playerRef={playerRef} />
			<HlsPlayer src={src} playerRef={playerRef} />
		</div>
	);
};
