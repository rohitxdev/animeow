import { ReactComponent as ForwardIcon } from '@assets/icons/forward-10s.svg';
import { ReactComponent as EnterFullscreenIcon } from '@assets/icons/fullscreen.svg';
import { ReactComponent as ExitFullscreenIcon } from '@assets/icons/fullscreen-exit.svg';
import { ReactComponent as PauseIcon } from '@assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from '@assets/icons/play.svg';
import { ReactComponent as RewindIcon } from '@assets/icons/rewind-10s.svg';
import { ReactComponent as SpeakerOffIcon } from '@assets/icons/speaker-off.svg';
import { ReactComponent as SpeakerOnIcon } from '@assets/icons/speaker-on.svg';
import { useEffect, useRef, useState } from 'react';
import HlsPlayer from 'react-hls-player';

import styles from './video-player.module.scss';

export const VideoPlayer = ({
	src,
	sourceId,
}: // videoContainerRef,
{
	src: string;
	sourceId?: string;
	// videoContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
}) => {
	const playerRef = useRef<HTMLVideoElement | null>(null);
	const progressRef = useRef<HTMLInputElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(Boolean(playerRef.current?.volume));
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const videoContainerRef = useRef<HTMLDivElement | null>(null);
	const initialTime = Number(
		sessionStorage.getItem(`timestamp-${sourceId}`) ?? 0,
	);

	const rewindByXSeconds = (x: number) => {
		if (playerRef.current) {
			playerRef.current.currentTime -= x;
		}
	};

	const forwardByXSeconds = (x: number) => {
		if (playerRef.current) {
			playerRef.current.currentTime += x;
		}
	};

	const saveCurrentTimeToSessionStorage = (currentTime: string) => {
		sessionStorage.setItem(`timestamp-${sourceId}`, currentTime);
	};

	const onVideoProgress = () => {
		if (playerRef.current && progressRef.current) {
			progressRef.current.value = String(playerRef.current.currentTime);
			saveCurrentTimeToSessionStorage(progressRef.current.value);
		}
	};

	useEffect(() => {
		if (playerRef.current) {
			isPlaying ? playerRef.current.play() : playerRef.current.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		if (isFullscreen && videoContainerRef?.current) {
			videoContainerRef.current.requestFullscreen();
		} else {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			}
		}
	}, [isFullscreen]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				setIsPlaying((val) => !val);
			}

			if (e.code === 'ArrowRight') {
				forwardByXSeconds(1);
			}
			if (e.code === 'ArrowLeft') {
				rewindByXSeconds(1);
			}
		};

		const onFullscreenChange = () =>
			setIsFullscreen(Boolean(document.fullscreenElement));

		if (playerRef.current) {
			playerRef.current.currentTime = initialTime;
		}

		window.addEventListener('keydown', onKeyDown);
		document.addEventListener('fullscreenchange', onFullscreenChange);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('fullscreenchange', onFullscreenChange);
		};
	}, []);

	return (
		<div
			className={[
				styles.videoPlayer,
				isFullscreen && styles.fullscreen,
				!showControls && styles.hideControls,
			].join(' ')}
			ref={videoContainerRef}
		>
			<button
				className={styles.playBtn}
				onClick={() => setIsPlaying(!isPlaying)}
			>
				{isPlaying ? <PauseIcon /> : <PlayIcon />}
				<span></span>
			</button>
			<HlsPlayer
				src={src}
				muted={isMuted}
				playerRef={playerRef}
				onProgress={onVideoProgress}
				onClick={(e) => {
					if (isFullscreen) {
						setShowControls((val) => !val);
					}
				}}
			/>
			<div className={styles.toolBar}>
				<button onClick={() => rewindByXSeconds(10)}>
					<RewindIcon />
				</button>
				<button onClick={() => forwardByXSeconds(10)}>
					<ForwardIcon />
				</button>
				<div className={styles.progress}>
					<input
						type="range"
						min={0}
						max={playerRef.current?.duration ?? 24}
						ref={progressRef}
						onInput={(e) => {
							saveCurrentTimeToSessionStorage(e.currentTarget.value);
							if (playerRef.current) {
								playerRef.current.currentTime = Number(e.currentTarget.value);
							}
						}}
					/>
				</div>
				<button onClick={() => setIsMuted((val) => !val)}>
					{isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
				</button>
				<button onClick={() => setIsFullscreen((val) => !val)}>
					{isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
				</button>
			</div>
		</div>
	);
};
