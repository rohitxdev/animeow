import { ReactComponent as BackIcon } from '@assets/icons/chevron-back-outline.svg';
import { ReactComponent as ForwardIcon } from '@assets/icons/chevron-forward-outline.svg';
import { CardData } from '@types';
import { memo, useRef } from 'react';

import { Card } from '../card/card';
import styles from './carousel.module.scss';

export const Carousel = memo(({ data }: { data: CardData[] }) => {
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
		<div className={styles.carousel}>
			<button onClick={scrollLeft} className={styles.scrollBtn}>
				<BackIcon />
			</button>
			<section className={styles.cardList} ref={cardListRef}>
				{data
					? data.map((anime: any, i: any) => <Card data={anime} key={i} />)
					: new Array(20)
							.fill(null)
							.map((anime, i: any) => <Card data={null} key={i} />)}
			</section>
			<button onClick={scrollRight} className={styles.scrollBtn}>
				<ForwardIcon />
			</button>
		</div>
	);
});

Carousel.displayName = 'Carousel';
