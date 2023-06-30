import { Banner, Carousel, Head } from '@components';
import { CardData } from '@types';
import { api } from '@utils';
import { useQuery } from 'react-query';

import styles from './home.module.scss';

export const HomePage = () => {
	const { data: popularData } = useQuery(
		['popular'],
		({ signal }) => api.getPopularAnime({ signal }),
		{ cacheTime: Infinity },
	);

	const { data: recentData } = useQuery(
		['recent'],
		({ signal }) => api.getRecentAnime({ signal }),
		{ cacheTime: Infinity },
	);
	const popularCarouselData = popularData
		? (popularData.data.map((val) => ({
				animeId: val.id,
				animeImg: val.coverImage,
				animeTitle: val.title.english ?? val.title.native,
				releaseDate: String(val.year),
		  })) as CardData[])
		: null;

	const recentCarouselData = recentData
		? (recentData.data.map((val) => ({
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
				{/* {recentData?.data && (
					<Banner
						data={recentData?.data?.map((val) => ({
							animeId: val.animeId,
							episodeId: val.id,
							animeImg: val.image ?? 'https://picsum.photos/800/600',
							subOrDub: 'sub',
							animeTitle: val.title ?? '',
							episodeNum: val.number,
						}))}
					/>
				)} */}
				<section>
					<p>Popular Anime</p>
					<Carousel data={popularCarouselData} />
				</section>
				<section>
					<p>Recently Released</p>
					<Carousel data={recentCarouselData} />
				</section>
			</div>
		</>
	);
};
