import { Banner, Carousel, Head } from '@components';
import { CardData } from '@types';
import { api } from '@utils';
import { useQuery } from 'react-query';

import styles from './home.module.scss';

export const HomePage = () => {
	const { data: popularData } = useQuery(['popular'], ({ signal }) =>
		api.getPopularAnime({ signal }),
	);

	const { data: recentData } = useQuery(['recent'], ({ signal }) =>
		api.getRecentAnime({ signal }),
	);

	const carouselData = popularData
		? (popularData.data.map((val) => ({
				animeId: val.id,
				animeImg: val.coverImage,
				animeTitle: val.title.english ?? val.title.native,
				releaseDate: Number(val.year),
		  })) as unknown as CardData[])
		: [];
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
				<div>
					<p>Popular</p>
					<Carousel data={carouselData} />
				</div>
			</div>
		</>
	);
};
