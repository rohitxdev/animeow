import { authRoles } from '@constants';
import { searchResponseSchema, userSchema } from '@schemas';
import { z } from 'zod';

export type Theme = 'light' | 'dark';

export type User = z.infer<typeof userSchema>;

export type AuthRole = (typeof authRoles)[keyof typeof authRoles];

export interface SearchResultProps
	extends Omit<React.ComponentProps<'div'>, 'className'> {
	data: z.infer<typeof searchResponseSchema>['data'][number];
}

export interface CardData {
	animeId: string;
	animeTitle: string;
	animeImg: string;
	releaseDate: string;
}
