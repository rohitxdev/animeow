import { CardData } from '@types';
import { Link } from 'react-router-dom';

import styles from './card.module.scss';

export const Card = ({ data }: { data: CardData | null }) => {
	if (!data) {
		return <div className={styles.card}></div>;
	}

	const { animeId, animeTitle, animeImg, releaseDate } = data;

	return (
		<Link to={`/anime/${animeId}`}>
			<div className={styles.card}>
				<div>
					<p className={styles.title}>{animeTitle}</p>
					<p className={styles.releaseDate}>{releaseDate}</p>
				</div>
				<img src={animeImg} alt={animeTitle} />
			</div>
		</Link>
	);
};
