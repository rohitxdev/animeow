import { ReactComponent as AlertIcon } from '@assets/icons/alert.svg';
import { ReactComponent as CrossIcon } from '@assets/icons/cross.svg';
import { ReactComponent as RatingIcon } from '@assets/icons/rating.svg';
import { ReactComponent as SearchIcon } from '@assets/icons/search.svg';
import { ReactComponent as SpinnerIcon } from '@assets/icons/spinner.svg';
import { useDebounce } from '@hooks';
import { SearchResultProps } from '@types';
import { api } from '@utils';
import { useId, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import styles from './search.module.scss';

const SearchResult = ({ data, ...props }: SearchResultProps) => {
	const title =
		data.title.english ?? data.title.userPreferred ?? data.title.native;
	return (
		<div className={styles.searchResult} {...props}>
			<div>
				<img src={data.coverImage} alt={`Cover image of ${title}`} />
				<span className={styles.rating}>
					<RatingIcon />
					{data.averageScore}/100
				</span>
				<span className={styles.year}>{data.year}</span>
			</div>
			<div>
				<p className={styles.title}>{title}</p>
				<div className={styles.genres}>
					{data.genre.slice(0, 5).map((val) => (
						<span key={val}>{val}</span>
					))}
				</div>
			</div>
		</div>
	);
};

export const Search = () => {
	const id = useId();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [showResults, setShowResults] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const query = useDebounce({ value: searchQuery, delayInMs: 300 });

	const { data, isLoading } = useQuery(
		['search', query],
		({ signal }) => api.getSearchResults({ query, perPage: 5, signal }),
		{
			enabled: searchQuery.length >= 2 && showResults,
			cacheTime: 1000 * 30,
		},
	);

	return (
		<div
			className={[styles.search, showResults ? styles.show : styles.hide].join(
				' ',
			)}
			onFocus={() => setShowResults(true)}
			onBlur={() => setShowResults(false)}
		>
			<div className={styles.searchBar}>
				<input
					id={id}
					ref={inputRef}
					type="text"
					autoComplete="off"
					aria-autocomplete="none"
					placeholder="Search"
					value={searchQuery}
					onInput={(e) => setSearchQuery(e.currentTarget.value.trimStart())}
				/>
				{searchQuery.length && showResults ? (
					isLoading ? (
						<SpinnerIcon />
					) : (
						<CrossIcon
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => setSearchQuery('')}
						/>
					)
				) : (
					<label htmlFor={id}>
						<SearchIcon />
					</label>
				)}
			</div>
			<div className={styles.results}>
				<div>
					{data?.data &&
						data.data.length > 0 &&
						data.data.slice(0, 5).map((val) => {
							return (
								<SearchResult
									role="link"
									data={val}
									key={val.slug}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										setShowResults(false);
										setSearchQuery(
											val.title.english ??
												val.title.userPreferred ??
												val.title.native,
										);
										setTimeout(() => {
											inputRef.current?.blur();
											navigate(`/anime/${val.slug}`);
										}, 200);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											setShowResults(false);
											setSearchQuery(
												val.title.english ??
													val.title.userPreferred ??
													val.title.native,
											);
											setTimeout(() => {
												inputRef.current?.blur();
												navigate(`/anime/${val.slug}`);
											}, 200);
										}
									}}
									tabIndex={0}
								/>
							);
						})}
					{data?.data.length === 0 && (
						<div className={styles.noResultsFound}>
							<AlertIcon />
							<p>No results found</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
