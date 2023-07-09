import { authRoles } from '@constants';
import { z } from 'zod';

export const authRoleSchema = z.union([
	z.literal(authRoles.USER),
	z.literal(authRoles.STAFF),
	z.literal(authRoles.ADMIN),
]);

export const userSchema = z.object({
	id: z.string().nonempty(),
	email: z.string().nonempty(),
	username: z.string().nonempty(),
	role: authRoleSchema,
	is_banned: z.boolean(),
	image_url: z.string().nonempty().nullish(),
	createdAt: z.number().nonnegative(),
});

export const usersSchema = z.array(userSchema);

export const loginFormSchema = z.object({
	email: z.string().nonempty().email(),
	password: z.string().nonempty(),
});

export const signUpFormSchema = loginFormSchema.extend({
	confirmPassword: z.string().nonempty(),
});
