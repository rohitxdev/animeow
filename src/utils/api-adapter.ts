import { env } from '@constants';
import {
	animeResponseSchema,
	episodeObjectSchema,
	isStreamingEnabledSchema,
	recentAnimeSchema,
	searchResponseSchema,
	sourcesResponseSchema,
	successfulAuthResponseSchema,
	userSchema,
	usersSchema,
} from '@schemas';
import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL:
		import.meta.env.MODE === 'development' ? env.DEV_API_URL : env.API_URL,
	withCredentials: true,
	timeout: 4000,
});

const enime = axios.create({ baseURL: 'https://api.enime.moe', timeout: 4000 });

export const api = {
	signUp: async ({
		email,
		password,
		username,
	}: {
		email: string;
		password: string;
		username?: string;
	}) => {
		const { data } = await axiosInstance.post(`/auth/sign-up`, {
			email,
			password,
			username,
		});
		return successfulAuthResponseSchema.parse(data);
	},
	logIn: async ({ email, password }: { email: string; password: string }) => {
		const { data } = await axiosInstance.post(`/auth/log-in`, {
			email,
			password,
		});
		return successfulAuthResponseSchema.parse(data);
	},
	logOut: async () => {
		await axiosInstance.post(`/auth/log-out`);
	},
	refreshAccessToken: async () => {
		const { data } = await axiosInstance.get('/auth/refresh-token');
		return successfulAuthResponseSchema.parse(data);
	},
	getSearchResults: async ({
		query,
		page,
		perPage,
		signal,
	}: {
		query: string;
		perPage?: number;
		page?: number;
		signal?: AbortSignal;
	}) => {
		const { data } = await enime.get(`/search/${query}`, {
			params: { page, perPage },
			signal,
		});
		return searchResponseSchema.parse(data);
	},
	getEpisodeSources: async ({
		episodeId,
		signal,
	}: {
		episodeId: string;
		signal?: AbortSignal;
	}) => {
		const { data } = await axiosInstance.get(`/episode/${episodeId}`, {
			signal,
		});
		return sourcesResponseSchema.parse(data);
	},
	getAnimeDetails: async ({
		animeId,
		signal,
	}: {
		animeId: string;
		signal?: AbortSignal;
	}) => {
		const { data } = await enime.get(`/anime/${animeId}`, { signal });
		return animeResponseSchema.parse(data);
	},
	getEpisodeDetails: async ({
		episodeId,
		signal,
	}: {
		episodeId: string;
		signal?: AbortSignal;
	}) => {
		const { data } = await enime.get(`/episode/${episodeId}`, { signal });
		return episodeObjectSchema.parse(data);
	},
	getPopularAnime: async ({
		page,
		perPage,
		signal,
	}: {
		page?: number;
		perPage?: number;
		signal?: AbortSignal;
	}) => {
		const { data } = await enime.get('/popular', {
			params: { page, perPage },
			signal,
		});
		return searchResponseSchema.parse(data);
	},
	getRecentAnime: async ({
		page,
		perPage,
		signal,
	}: {
		page?: number;
		perPage?: number;
		signal?: AbortSignal;
	}) => {
		const { data } = await enime.get('/recent', {
			params: { page, perPage },
			signal,
		});
		return recentAnimeSchema.parse(data);
	},
	getMyProfile: async (signal?: AbortSignal) => {
		const { data } = await axiosInstance.get('/users/me', { signal });
		return userSchema.parse(data);
	},
	getUsers: async (signal?: AbortSignal) => {
		const { data } = await axiosInstance.get('/users', { signal });
		return usersSchema.parse(data);
	},
	getIsStreamingEnabled: async () => {
		try {
			const { data } = await axiosInstance.get('/app/is-streaming-enabled');
			return isStreamingEnabledSchema.parse(data).is_streaming_enabled;
		} catch (err) {
			return false;
		}
	},
	setIsStreamingEnabled: async (isEnabled: boolean) => {
		await axiosInstance.put('/app/is-streaming-enabled', {
			is_enabled: isEnabled,
		});
	},
	sendPasswordResetEmail: async (email: string) =>
		await axiosInstance.get('/auth/send-password-reset-email', {
			params: { email },
		}),
	uploadProfilePicture: async (file: File) =>
		await axiosInstance.putForm('/users/profile-picture', {
			file,
		}),
	deleteProfilePicture: async () =>
		await axiosInstance.delete('/users/profile-picture'),
	googleLogin: async () => await axiosInstance.get('auth/oauth2/google'),
};
