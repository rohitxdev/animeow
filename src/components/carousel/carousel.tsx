import { ReactComponent as BackwardIcon } from '@icons/arrow-backward.svg';
import { ReactComponent as ForwardIcon } from '@icons/arrow-forward.svg';
import { CardData } from '@types';
import { memo, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '../card/card';
import styles from './carousel.module.scss';

export const Carousel = memo(
	({
		name,
		href,
		data,
	}: {
		name: string;
		href: string;
		data: CardData[] | null;
	}) => {
		const cardListRef = useRef<HTMLDivElement | null>(null);

		const scrollRight = () => {
			cardListRef.current?.scrollBy({
				left: cardListRef.current?.offsetWidth,
			});
		};
		const scrollLeft = () => {
			cardListRef.current?.scrollBy({
				left: -cardListRef.current?.offsetWidth,
			});
		};

		return (
			<div className={styles.carouselContainer}>
				<div>
					<p>{name}</p>
					<Link to={href}>View All</Link>
				</div>
				<div className={styles.carousel}>
					<button onClick={scrollLeft} className={styles.scrollBtn}>
						<BackwardIcon />
					</button>
					<section className={styles.cardList} ref={cardListRef}>
						{data
							? data.map((anime, i) => <Card data={anime} key={i} />)
							: new Array(20)
									.fill(null)
									.map((_, i) => <Card data={null} key={i} />)}
					</section>
					<button onClick={scrollRight} className={styles.scrollBtn}>
						<ForwardIcon />
					</button>
				</div>
			</div>
		);
	},
);

Carousel.displayName = 'Carousel';
