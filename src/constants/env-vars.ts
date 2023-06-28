import { z } from 'zod';

const envSchema = z
	.object({
		IS_PWA_ENABLED: z.union([z.literal('true'), z.literal('false')]),
		IS_PWA_DEV_ENABLED: z.union([z.literal('true'), z.literal('false')]),
		API_URL: z.string().url().nonempty(),
	})
	.transform((val) => ({
		...val,
		IS_PWA_ENABLED:
			import.meta.env.VITE_IS_PWA_ENABLED === 'true' ? true : false,
		IS_PWA_DEV_ENABLED:
			import.meta.env.VITE_IS_PWA_DEV_ENABLED === 'true' ? true : false,
	}));
// Z

const envVariables: Partial<Record<keyof z.infer<typeof envSchema>, unknown>> =
	{
		IS_PWA_ENABLED: import.meta.env.VITE_IS_PWA_ENABLED,
		IS_PWA_DEV_ENABLED: import.meta.env.VITE_IS_PWA_DEV_ENABLED,
		API_URL: import.meta.env.VITE_API_URL,
	};

if (import.meta.env.MODE === 'production') {
	const undefinedList: string[] = [];
	Object.entries(envVariables).forEach(([key, val]) => {
		if (val === undefined) {
			undefinedList.push(key);
		}
	});
	if (undefinedList.length > 0) {
		throw new Error(
			`${undefinedList.join(', ')} ${
				undefinedList.length > 1 ? 'are' : 'is'
			} undefined`,
		);
	}
}

export const env = envSchema.parse(envVariables);
