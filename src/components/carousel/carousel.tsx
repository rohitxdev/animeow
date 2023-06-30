import { ReactComponent as BackwardIcon } from '@assets/icons/arrow-backward.svg';
import { ReactComponent as ForwardIcon } from '@assets/icons/arrow-forward.svg';
import { CardData } from '@types';
import { memo, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Card } from '../card/card';
import styles from './carousel.module.scss';

export const Carousel = memo(({ data }: { data: CardData[] | null }) => {
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
				<BackwardIcon />
			</button>
			<section className={styles.cardList} ref={cardListRef}>
				{data
					? data.map((anime: any, i: any) => <Card data={anime} key={i} />)
					: new Array(20)
							.fill(null)
							.map((anime, i: any) => (
								<Skeleton
									key={i}
									duration={1}
									className={styles.card}
								></Skeleton>
							))}
			</section>
			<button onClick={scrollRight} className={styles.scrollBtn}>
				<ForwardIcon />
			</button>
		</div>
	);
});

Carousel.displayName = 'Carousel';
