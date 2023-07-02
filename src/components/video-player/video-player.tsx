import { ReactComponent as BrokenFileIcon } from '@assets/icons/broken-file.svg';
import { ReactComponent as ForwardIcon } from '@assets/icons/forward-10s.svg';
import { ReactComponent as EnterFullscreenIcon } from '@assets/icons/fullscreen.svg';
import { ReactComponent as ExitFullscreenIcon } from '@assets/icons/fullscreen-exit.svg';
import { ReactComponent as LoaderIcon } from '@assets/icons/loader.svg';
import { ReactComponent as PauseIcon } from '@assets/icons/pause.svg';
import { ReactComponent as PlayIcon } from '@assets/icons/play.svg';
import { ReactComponent as RewindIcon } from '@assets/icons/rewind-10s.svg';
import { ReactComponent as SettingsIcon } from '@assets/icons/settings.svg';
import { ReactComponent as SpeakerOffIcon } from '@assets/icons/speaker-off.svg';
import { ReactComponent as SpeakerOnIcon } from '@assets/icons/speaker-on.svg';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import HlsPlayer from 'react-hls-player';
import Skeleton from 'react-loading-skeleton';

import styles from './video-player.module.scss';

interface VideoResolutionPickerProps
	extends Omit<ComponentProps<'div'>, 'style' | 'className'> {
	availableResolutions: string[];
	setVideoResolution: React.Dispatch<React.SetStateAction<string>>;
}

export const VideoResolutionPicker = ({
	availableResolutions,
	setVideoResolution,
	...props
}: VideoResolutionPickerProps) => {
	const [showOptions, setShowOptions] = useState(false);

	return (
		<div
			{...props}
			className={[
				styles.videoResolutionPicker,
				showOptions ? styles.show : styles.hide,
			].join(' ')}
		>
			<button
				className={styles.settings}
				onClick={() => setShowOptions((val) => !val)}
			>
				<SettingsIcon />
			</button>
			<div className={styles.resolutions}>
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

export const VideoPlayer = ({
	src,
	sourceId,
	availableResolutions,
	setVideoResolution,
}: {
	src: string | null;
	sourceId: string;
	availableResolutions?: string[];
	setVideoResolution?: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [isError, setIsError] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMetaData, setHasMetaData] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [volume, setVolume] = useState(
		Number(localStorage.getItem('volume')) ?? 100,
	);
	const currentVolumeRef = useRef(volume);
	const hideTimerRef = useRef<number | null>(null);
	const playerRef = useRef<HTMLVideoElement | null>(null);
	const progressRef = useRef<HTMLInputElement | null>(null);
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

	const clearHideTimer = () => {
		if (hideTimerRef.current !== null) {
			clearTimeout(hideTimerRef.current);
		}
	};

	const hideVideoControls = () => {
		clearHideTimer();
		setShowControls(false);
	};

	const showVideoControls = () => {
		clearHideTimer();
		setShowControls(true);
		hideTimerRef.current = window.setTimeout(hideVideoControls, 4000);
	};

	useEffect(() => {
		if (isFullscreen && videoContainerRef.current) {
			videoContainerRef.current.requestFullscreen();
		} else {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			}
		}
	}, [isFullscreen]);

	useEffect(() => {
		if (playerRef.current) {
			if (isPlaying) {
				playerRef.current.play();
			} else {
				playerRef.current.pause();
			}
		}
	}, [isPlaying]);

	useEffect(() => {
		if (playerRef.current) {
			playerRef.current.volume = volume / 100;
		}
		localStorage.setItem('volume', String(volume));
	}, [volume]);

	useEffect(() => {
		setHasMetaData(false);
	}, [src]);

	useEffect(() => {
		const onFullscreenChange = () =>
			setIsFullscreen(Boolean(document.fullscreenElement));

		const onKeyDown = (e: KeyboardEvent) => {
			switch (e.code) {
				case 'Space':
					setIsPlaying((val) => !val);
					break;
				case 'ArrowRight':
					forwardByXSeconds(1);
					break;
				case 'ArrowLeft':
					rewindByXSeconds(1);
					break;
				default:
					break;
			}
		};

		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('fullscreenchange', onFullscreenChange);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
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
			onFocus={showVideoControls}
			onBlur={hideVideoControls}
			onMouseEnter={showVideoControls}
			onMouseLeave={hideVideoControls}
			onMouseMove={showVideoControls}
			ref={videoContainerRef}
		>
			{isError ? (
				<div className={styles.error}>
					<BrokenFileIcon />
					<p>Could not load video &nbsp;:&#40;</p>
				</div>
			) : src ? (
				<>
					{isLoading ? (
						<LoaderIcon className={styles.loadingSpinner} />
					) : (
						<button
							className={styles.playBtn}
							onClick={() => setIsPlaying((val) => !val)}
						>
							{isPlaying ? <PauseIcon /> : <PlayIcon />}
							<span></span>
						</button>
					)}
					<HlsPlayer
						src={src}
						playerRef={playerRef}
						onProgress={onVideoProgress}
						onWaiting={(e) => {
							if (e.currentTarget.networkState === 2) {
								setIsLoading(true);
							}
						}}
						onPlaying={() => setIsLoading(false)}
						onError={() => setIsError(true)}
						onLoadedMetadata={(e) => {
							e.currentTarget.currentTime = initialTime;
							if (playerRef.current && isPlaying) {
								playerRef.current.play();
							}
							setHasMetaData(true);
						}}
					/>
					{hasMetaData && playerRef.current && (
						<div className={styles.toolBar}>
							<input
								className={styles.progress}
								type="range"
								defaultValue={initialTime}
								min={0}
								max={playerRef.current.duration}
								ref={progressRef}
								onInput={(e) => {
									if (playerRef.current) {
										playerRef.current.currentTime = Number(
											e.currentTarget.value,
										);
										saveCurrentTimeToSessionStorage(e.currentTarget.value);
										showVideoControls();
									}
								}}
							/>
							<div className={styles.options}>
								<button onClick={() => rewindByXSeconds(10)}>
									<RewindIcon />
								</button>
								<button onClick={() => forwardByXSeconds(10)}>
									<ForwardIcon />
								</button>

								<button
									onClick={() =>
										setVolume((val) => {
											return val ? 0 : currentVolumeRef.current || 100;
										})
									}
								>
									{volume === 0 ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
								</button>
								<input
									className={styles.volume}
									type="range"
									value={volume}
									min={0}
									max={100}
									onInput={(e) => {
										const volume = Number(e.currentTarget.value);
										currentVolumeRef.current = volume;
										setVolume(volume);
										showVideoControls();
									}}
									onKeyDown={(e) => e.stopPropagation()}
								/>
								{availableResolutions && setVideoResolution && (
									<VideoResolutionPicker
										onClick={showVideoControls}
										availableResolutions={availableResolutions}
										setVideoResolution={setVideoResolution}
									/>
								)}
								<button onClick={() => setIsFullscreen((val) => !val)}>
									{isFullscreen ? (
										<ExitFullscreenIcon />
									) : (
										<EnterFullscreenIcon />
									)}
								</button>
							</div>
						</div>
					)}
				</>
			) : (
				<div className={styles.loadingBg}>
					<LoaderIcon />
					<Skeleton baseColor="black" highlightColor="var(--dark)" />
				</div>
			)}
		</div>
	);
};
