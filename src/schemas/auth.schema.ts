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
	password_hash: z.string().nonempty(),
	salt: z.string().nonempty(),
	username: z.string().nonempty(),
	role: authRoleSchema,
	is_banned: z.boolean(),
	image_url: z.string().nonempty().nullish(),
});

export const usersSchema = z.array(userSchema);

export const loginFormSchema = z.object({
	email: z.string().nonempty().email(),
	password: z.string().nonempty(),
});

export const signUpFormSchema = z
	.object({
		email: z.string().nonempty().email(),
		password: z
			.string()
			.nonempty()
			.regex(
				/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})\S+$/,
				'Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 special character and should be 8 or more characters in length',
			),
		confirmPassword: z.string().nonempty(),
		username: z.string().nonempty().nullish(),
	})
	.refine(
		(val) => val.password !== val.confirmPassword,
		'Passwords do not match!',
	);
