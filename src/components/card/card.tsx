import { ReactComponent as HeartedIcon } from '@assets/icons/heart.svg';
import { ReactComponent as NotHeartedIcon } from '@assets/icons/not-hearted.svg';
import { CardData } from '@types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './card.module.scss';

export const Card = ({ data }: { data: CardData | null }) => {
	const [isHearted, setIsHearted] = useState(false);
	const toggleIsHearted: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setIsHearted((state) => !state);
	};

	if (!data) {
		return <div className={styles.card}></div>;
	}

	const { animeId, animeTitle, animeImg, releaseDate } = data;
	return (
		<Link to={`/details/${animeId}`}>
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
