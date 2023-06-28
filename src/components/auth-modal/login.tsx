import { ReactComponent as SpinnerIcon } from '@assets/icons/spinner.svg';
import { useAuthContext } from '@hooks';
import { getFormData } from '@utils';
import { AxiosError } from 'axios';
import { useId, useState } from 'react';
import { ZodError } from 'zod';

import { loginFormSchema } from '../../schemas';
import styles from './auth-modal.module.scss';
import { TextInput } from './text-input';

interface LoginProps {
	email?: string;
	password?: string;
}

export const Login = ({
	email: defaultEmail,
	password: defaultPassword,
}: LoginProps) => {
	const id = useId();
	const { logIn } = useAuthContext();
	const [email, setEmail] = useState(defaultEmail ?? '');
	const [password, setPassword] = useState(defaultPassword ?? '');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		try {
			e.preventDefault();
			setIsSubmitting(true);
			const { email, password } = loginFormSchema.parse(getFormData(e));
			await logIn({ email, password });
		} catch (err) {
			if (err instanceof ZodError) {
				console.log(err.message);
			}
			if (err instanceof AxiosError) {
				console.log(err.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.logIn}>
			<form onSubmit={submitHandler} tabIndex={0}>
				<label htmlFor={id + 'email'}>Email</label>
				<TextInput
					type="email"
					name="email"
					id={id + 'email'}
					placeholder="Email"
					value={email}
					onInput={(e) => setEmail(e.currentTarget.value)}
				/>
				<label htmlFor={id + 'password'}>Password</label>

				<TextInput
					type="password"
					name="password"
					id={id + 'password'}
					placeholder="Password"
					value={password}
					onInput={(e) => setPassword(e.currentTarget.value)}
				/>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? <SpinnerIcon /> : 'Submit'}
				</button>
			</form>
		</div>
	);
};
