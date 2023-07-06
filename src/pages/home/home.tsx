import { Carousel, Head } from '@components';
import { CardData } from '@types';
import { api } from '@utils';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

import styles from './home.module.scss';

export const HomePage = () => {
	const getData = useCallback(
		({ signal }: { signal?: AbortSignal }) =>
			Promise.all([
				api.getPopularAnime({ signal }),
				api.getRecentAnime({ signal }),
			]),
		[],
	);

	const { data } = useQuery(['home'], getData, {
		cacheTime: Infinity,
	});

	const popularData = data
		? (data[0].data.map((val) => ({
				animeId: val.id,
				animeImg: val.coverImage,
				animeTitle: val.title.english ?? val.title.native,
				releaseDate: String(val.year),
		  })) as CardData[])
		: null;

	const recentData = data
		? (data[1].data.map((val) => ({
				animeId: val.animeId,
				animeImg: val.anime.coverImage,
				animeTitle:
					val.anime.title.userPreferred ??
					val.anime.title.english ??
					val.anime.title.native,
				releaseDate: String(
					val.anime.year ??
						new Date(val.anime.updatedAt ?? '').getFullYear() ??
						'N/A',
				),
		  })) as CardData[])
		: null;

	return (
		<>
			<Head>
				<title>Animeow | Watch HD anime for free</title>
			</Head>
			<div className={styles.homePage}>
				<Carousel name="Popular Anime" data={popularData} href="/popular" />
				<Carousel name="Recently Released" data={recentData} href="/recent" />
			</div>
		</>
	);
};
