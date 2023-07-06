import { ReactComponent as BackIcon } from '@icons/chevron-back-outline.svg';
import { ReactComponent as ForwardIcon } from '@icons/chevron-forward-outline.svg';
import { ReactComponent as InfoIcon } from '@icons/info.svg';
import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './banner.module.scss';

export interface BannerProps {
	data: {
		animeTitle: string;
		episodeId: string;
		episodeNum: string | number;
		animeImg: string;
		subOrDub?: string;
		animeId: string;
	}[];
}

export const Banner = memo(({ data }: BannerProps) => {
	const bannerRef = useRef<HTMLDivElement | null>(null);
	const [currentBanner, setCurrentBanner] = useState(0);

	const scrollToBanner = (n: number) => {
		setCurrentBanner(n);
	};

	const scrollBannerBy = (n: -1 | 1) => {
		const num =
			(currentBanner + n < 0 ? data.length - 1 : currentBanner + n) %
			data.length;
		setCurrentBanner(num);
	};

	useEffect(() => {
		bannerRef.current?.scrollTo({
			left: currentBanner * bannerRef.current?.offsetWidth,
		});
	}, [currentBanner]);

	useEffect(() => {
		const scrollTimer = setInterval(() => {
			setCurrentBanner((state) => (state + 1) % data.length);
		}, 7000);
		return () => {
			clearInterval(scrollTimer);
		};
	});

	return (
		<div className={styles.banner}>
			<button onClick={() => scrollBannerBy(-1)} className={styles.scrollBtn}>
				<BackIcon />
			</button>
			<button onClick={() => scrollBannerBy(1)} className={styles.scrollBtn}>
				<ForwardIcon />
			</button>
			<div className={styles.navButtons}>
				{data.map((anime, i) => {
					return (
						<button
							title={anime.animeTitle}
							onClick={() => scrollToBanner(i)}
							key={anime.episodeId}
							style={
								i === currentBanner
									? { backgroundColor: 'var(--coral-100)' }
									: { backgroundColor: 'var(--light)' }
							}
						></button>
					);
				})}
			</div>
			<div className={styles.gallery} ref={bannerRef}>
				{data.map((anime) => {
					// const animeIdPieces = anime.episodeId.split('-');
					// const animeId = animeIdPieces
					// 	.slice(0, animeIdPieces.length - 2)
					// 	.join('-');
					// const latestEpNum = anime.episodeNum.split('-').at(-1);
					return (
						<div
							className={styles.banner}
							id={`${anime.episodeId}-banner`}
							key={anime.episodeId}
						>
							<img
								src={anime.animeImg}
								alt={anime.episodeId}
								className={styles.bg}
							/>
							<div className={styles.details}>
								<p>{anime.animeTitle}</p>
								<p className={styles.subOrDub}>{anime?.subOrDub}</p>
								<Link to={`/anime/${anime.animeId}`}>
									<p className={styles.latestEp}>
										Latest episode: {anime.episodeNum}
									</p>
									<button className={styles.moreInfoBtn}>
										<InfoIcon /> More info
									</button>
								</Link>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
});

Banner.displayName = 'BannerCarousel';
