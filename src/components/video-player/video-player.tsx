import { ReactComponent as BrokenFileIcon } from '@icons/broken-file.svg';
import { ReactComponent as ForwardIcon } from '@icons/forward-10s.svg';
import { ReactComponent as EnterFullscreenIcon } from '@icons/fullscreen.svg';
import { ReactComponent as ExitFullscreenIcon } from '@icons/fullscreen-exit.svg';
import { ReactComponent as PauseIcon } from '@icons/pause.svg';
import { ReactComponent as PlayIcon } from '@icons/play.svg';
import { ReactComponent as PlaybackRateIcon } from '@icons/playback-rate.svg';
import { ReactComponent as RewindIcon } from '@icons/rewind-10s.svg';
import { ReactComponent as SettingsIcon } from '@icons/settings.svg';
import { ReactComponent as SpeakerOffIcon } from '@icons/speaker-off.svg';
import { ReactComponent as SpeakerOnIcon } from '@icons/speaker-on.svg';
import { ReactComponent as LoaderIcon } from '@icons/spinner-2.svg';
import { getTimeInMMSS } from '@utils';
import { memo, useEffect, useRef, useState } from 'react';
import HlsPlayer from 'react-hls-player';
import Skeleton from 'react-loading-skeleton';

import { VideoOptions } from './video-options';
import styles from './video-player.module.scss';

export const VideoPlayer = memo(
	({
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
		const [source, setSource] = useState(src);
		const [isError, setIsError] = useState(false);
		const [isPlaying, setIsPlaying] = useState(false);
		const [isLoading, setIsLoading] = useState(false);
		const [hasMetaData, setHasMetaData] = useState(false);
		const [isFullscreen, setIsFullscreen] = useState(false);
		const [showControls, setShowControls] = useState(true);
		const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
		const [showResolutionOptions, setShowResolutionOptions] = useState(false);
		const [volume, setVolume] = useState(() => {
			const val = localStorage.getItem('volume');
			return val === null ? 100 : Number(val);
		});
		const [playbackRate, setPlaybackRate] = useState(1);
		const currentVolumeRef = useRef(volume);
		const hideTimerRef = useRef<number | null>(null);
		const playerRef = useRef<HTMLVideoElement | null>(null);
		const progressRef = useRef<HTMLInputElement | null>(null);
		const volumeRef = useRef<HTMLInputElement | null>(null);
		const videoContainerRef = useRef<HTMLDivElement | null>(null);
		const timeRef = useRef<HTMLSpanElement | null>(null);
		const timerIdRef = useRef<number | null>(null);
		const initialTime = Number(sessionStorage.getItem(`time-${sourceId}`) ?? 0);
		const secondsElapsedRef = useRef(initialTime);

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
			sessionStorage.setItem(`time-${sourceId}`, currentTime);
		};

		const paintVideoTrackBackground = (
			ref: React.MutableRefObject<HTMLInputElement | null>,
		) => {
			if (ref.current) {
				const progressPercent =
					((Number(ref.current.value) - Number(ref.current.min)) /
						(Number(ref.current.max) - Number(ref.current.min))) *
					100;
				ref.current.style.setProperty(
					'--progress-percent',
					`${progressPercent}%`,
				);
			}
		};

		const onVideoProgress = () => {
			if (
				playerRef.current &&
				progressRef.current &&
				timeRef.current &&
				timerIdRef.current
			) {
				progressRef.current.value = String(playerRef.current.currentTime);
				saveCurrentTimeToSessionStorage(progressRef.current.value);
				paintVideoTrackBackground(progressRef);
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
			setTimeout(() => setSource(src), 200);
		}, [src]);

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
				isPlaying ? playerRef.current.play() : playerRef.current.pause();
			}
		}, [isPlaying]);

		useEffect(() => {
			if (isPlaying) {
				timerIdRef.current = setInterval(() => {
					if (timeRef.current && playerRef.current) {
						if (secondsElapsedRef.current <= playerRef.current.duration) {
							timeRef.current.textContent = `${getTimeInMMSS(
								secondsElapsedRef.current++,
							)}/${getTimeInMMSS(playerRef.current.duration)}`;
						} else {
							if (timerIdRef.current) {
								clearInterval(timerIdRef.current);
							}
						}
					}
				}, 1000 / playbackRate);
			}

			if (isLoading) {
				if (timerIdRef.current) {
					clearInterval(timerIdRef.current);
				}
			}

			return () => {
				if (timerIdRef.current) {
					clearInterval(timerIdRef.current);
				}
			};
		}, [isPlaying, isLoading, playbackRate]);

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
			paintVideoTrackBackground(volumeRef);
		}, [hasMetaData, volume]);

		useEffect(() => {
			if (timeRef.current && playerRef.current) {
				timeRef.current.textContent = `${getTimeInMMSS(
					secondsElapsedRef.current,
				)}/${getTimeInMMSS(playerRef.current.duration)}`;
			}
			paintVideoTrackBackground(progressRef);
		}, [hasMetaData]);

		useEffect(() => {
			if (!showControls) {
				setShowPlaybackOptions(false);
				setShowResolutionOptions(false);
			}
		}, [showControls]);

		useEffect(() => {
			if (playerRef.current) {
				playerRef.current.playbackRate = Number(playbackRate);
			}
		}, [playbackRate]);

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
				onMouseLeave={hideVideoControls}
				onMouseMove={() => {
					if (!showControls) {
						showVideoControls();
					}
				}}
				ref={videoContainerRef}
			>
				{isError ? (
					<div className={styles.error}>
						<BrokenFileIcon />
						<p>Could not load video &nbsp;:&#40;</p>
					</div>
				) : source ? (
					<>
						{isLoading ? (
							<LoaderIcon className={styles.loadingSpinner} />
						) : (
							<div className={styles.options2}>
								<button onClick={() => rewindByXSeconds(10)}>
									<RewindIcon />
								</button>
								<button onClick={() => setIsPlaying((val) => !val)}>
									{isPlaying ? <PauseIcon /> : <PlayIcon />}
								</button>
								<button onClick={() => forwardByXSeconds(10)}>
									<ForwardIcon />
								</button>
							</div>
						)}
						<HlsPlayer
							src={source}
							playerRef={playerRef}
							onProgress={onVideoProgress}
							onWaiting={(e) => {
								if (e.currentTarget.networkState === 2) {
									setIsLoading(true);
								}
							}}
							onPlaying={() => setIsLoading(false)}
							onError={() => setIsError(true)}
							onEnded={() => {
								setIsLoading(false);
								setIsPlaying(false);
							}}
							onLoadedMetadata={(e) => {
								e.currentTarget.currentTime = initialTime;
								if (playerRef.current && isPlaying) {
									playerRef.current.play();
								}
								setHasMetaData(true);
							}}
							onClick={(e) => {
								e.stopPropagation();
								showControls ? hideVideoControls() : showVideoControls();
							}}
							onDoubleClick={() => setIsFullscreen(false)}
							onSeeking={(e) => {
								if (timeRef.current && playerRef.current) {
									secondsElapsedRef.current = e.currentTarget.currentTime;
									timeRef.current.textContent = `${getTimeInMMSS(
										secondsElapsedRef.current++,
									)}/${getTimeInMMSS(playerRef.current.duration)}`;
								}
								paintVideoTrackBackground(progressRef);
							}}
						/>
						<div
							className={[
								styles.toolBar,
								hasMetaData && playerRef.current ? styles.show : styles.hide,
							].join(' ')}
						>
							<input
								className={styles.progress}
								type="range"
								defaultValue={initialTime}
								min={0}
								max={playerRef.current?.duration}
								ref={progressRef}
								onInput={(e) => {
									if (playerRef.current && timeRef.current) {
										playerRef.current.currentTime = Number(
											e.currentTarget.value,
										);
										saveCurrentTimeToSessionStorage(e.currentTarget.value);
										showVideoControls();
									}
								}}
							/>
							<div className={styles.toolOptions}>
								<span className={styles.time} ref={timeRef}></span>
								<button
									onClick={() =>
										setVolume((val) =>
											val ? 0 : currentVolumeRef.current || 100,
										)
									}
								>
									{volume === 0 ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
								</button>
								<input
									className={styles.volume}
									ref={volumeRef}
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
								<VideoOptions
									icon={<PlaybackRateIcon />}
									show={showControls && showPlaybackOptions}
									defaultOption={2}
									options={['1.5x', '1.25x', '1x', '0.75x', '0.5x']}
									onSelectOption={(val) => setPlaybackRate(parseFloat(val))}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										showVideoControls();
										setShowPlaybackOptions((val) => !val);
										setShowResolutionOptions(false);
									}}
								/>
								{availableResolutions && setVideoResolution && (
									<VideoOptions
										icon={<SettingsIcon />}
										show={showControls && showResolutionOptions}
										defaultOption={availableResolutions.length - 1}
										options={availableResolutions}
										onSelectOption={setVideoResolution}
										onClick={() => {
											showVideoControls();
											setShowResolutionOptions((val) => !val);
											setShowPlaybackOptions(false);
										}}
										onMouseDown={(e) => e.preventDefault()}
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
					</>
				) : (
					<div className={styles.loadingBg}>
						<LoaderIcon />
						<Skeleton baseColor="black" highlightColor="var(--dark)" />
					</div>
				)}
			</div>
		);
	},
);
