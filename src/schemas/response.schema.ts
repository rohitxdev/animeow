import { z } from 'zod';

import { authRoleSchema } from './auth.schema';

const metaObjectSchema = z.object({
	total: z.number(),
	lastPage: z.number(),
	currentPage: z.number(),
	perPage: z.number(),
	prev: z.number().nullish(),
	next: z.number().nullish(),
});

export const successfulAuthResponseSchema = z.object({
	accessToken: z.string().nonempty(),
	role: authRoleSchema,
});

export const searchResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string().nonempty(),
			slug: z.string().nonempty(),
			coverImage: z.string().nonempty(),
			bannerImage: z.string().nonempty().nullish(),
			status: z.string().nonempty(),
			season: z.string().nonempty(),
			title: z.object({
				native: z.string().nonempty(),
				romaji: z.string().nonempty().nullish(),
				english: z.string().nonempty().nullish(),
				userPreferred: z.string().nonempty().nullish(),
			}),
			currentEpisode: z.number(),
			countryOfOrigin: z.string().nonempty().nullish(),
			lastEpisodeUpdate: z.string().nonempty().nullish(),
			description: z.string().nonempty(),
			duration: z.number().nullish(),
			color: z.string().nonempty().nullish(),
			year: z.number().nullish(),
			format: z.string().nullish(),
			anilistId: z.number().nullish(),
			averageScore: z.number().nullish(),
			next: z.string().nonempty().nullable(),
			seasonInt: z.number(),
			popularity: z.number(),
			genre: z.array(z.string().nonempty()),
		}),
	),
	meta: metaObjectSchema,
});

export const episodeObjectSchema = z
	.object({
		id: z.string().nonempty(),
		number: z.number(),
		title: z.string().nonempty().nullish(),
		description: z.string().nonempty().nullish(),
		image: z.string().nullish(),
		airedAt: z.string().nullish(),
	})
	.transform((val) => {
		if (!val.title) {
			val.title = `Episode ${val.number}`;
			return val;
		}
		return val;
	});

export const sourcesResponseSchema = z.object({
	headers: z.object({
		Referer: z.string().nonempty().nullish(),
	}),
	sources: z.array(
		z.object({
			url: z.string().nonempty(),
			isM3U8: z.boolean(),
			quality: z.string().nonempty(),
		}),
	),
});

export const animeResponseSchema = z.object({
	id: z.string().nonempty(),
	
	slug: z.string().nonempty().nullish(),
	anilistId: z.number(),
	coverImage: z.string().nonempty().nullish(),
	bannerImage: z.string().nonempty().nullish(),
	status: z.string().nonempty(),
	season: z.string().nonempty().nullish(),
	title: z.object({
		native: z.string().nonempty(),
		romaji: z.string().nonempty().nullish(),
		english: z.string().nonempty().nullish(),
		userPreferred: z.string().nonempty().nullish(),
	}),
	currentEpisode: z.number(),
	next: z.string().nonempty().nullish(),
	countryOfOrigin: z.string(),
	description: z.string().nonempty(),
	duration: z.number().nullish(),
	averageScore: z.number().nullish(),
	popularity: z.number().nullish(),
	color: z.string().nonempty().nullish(),
	year: z.number().nullish(),
	genre: z.array(z.string().nonempty()),
	format: z.string(),
	episodes: z.array(episodeObjectSchema),
});

export const recentAnimeSchema = z.object({
	data: z.array(
		z.object({
			id: z.string().nonempty(),
			animeId: z.string().nonempty(),
			number: z.number(),
			airedAt: z.string().nonempty().nullish(),
			anime: animeResponseSchema
				.omit({ episodes: true, description: true })
				.extend({
					description: z.string().nonempty().nullable(),
					updatedAt: z.string().nonempty().nullish(),
				}),
			createdAt: z.string().nonempty(),
			description: z.string().nonempty().nullish(),
			image: z.string().nonempty().nullish(),
			title: z.string().nonempty().nullish(),
			titleVariations: z
				.object({
					native: z.string().nonempty().nullish(),
					english: z.string().nonempty().nullish(),
				})
				.nullish(),
			sources: z.array(z.object({ id: z.string().nonempty() })),
			lastEpisodeUpdate: z.string().nonempty().nullish(),
		}),
	),
	meta: metaObjectSchema,
});
