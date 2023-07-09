import { ReactComponent as AlertIcon } from '@icons/alert.svg';
import { ReactComponent as SpinnerIcon } from '@icons/spinner.svg';
import { api } from '@utils';
import { AxiosError } from 'axios';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import styles from './auth-modal.module.scss';
import { TextInput } from './text-input';

interface ForgotPasswordProps extends ComponentProps<'form'> {
	defaultEmail: string;
	setShowResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ForgotPassword = ({
	defaultEmail,
	setShowResetPassword,
	...props
}: ForgotPasswordProps) => {
	const [email, setEmail] = useState(defaultEmail);
	const [isDisabled, setIsDisabled] = useState(false);
	const secondsRef = useRef(30);
	const [seconds, setSeconds] = useState(secondsRef.current);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const sendPasswordResetEmail: React.FormEventHandler<
		HTMLFormElement
	> = async (e) => {
		e.preventDefault();
		setIsDisabled(true);
		setIsSubmitting(true);
		try {
			await api.sendPasswordResetEmail(email);
			toast.success('Sent reset link to email');
		} catch (err) {
			if (err instanceof AxiosError) {
				setError(
					typeof err.response?.data === 'string'
						? err.response?.data
						: err.response?.statusText ?? 'Network error',
				);
			}
			if (typeof err === 'string') {
				setError(err);
			}
			console.error(err);
			setIsDisabled(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		setSeconds(secondsRef.current);
		let timerId: number | null = null;
		let intervalId: number | null = null;

		if (isDisabled) {
			timerId = window.setTimeout(() => {
				setIsDisabled(false);
			}, 1000 * secondsRef.current);

			intervalId = window.setInterval(() => {
				setSeconds((val) => (val > 0 ? val - 1 : val));
			}, 1000);
		}

		return () => {
			if (timerId) {
				window.clearTimeout(timerId);
			}
			if (intervalId) {
				window.clearInterval(intervalId);
			}
		};
	}, [isDisabled]);

	useEffect(() => {
		setError('');
	}, [email]);
	return (
		<form
			className={styles.forgotPasswordForm}
			onSubmit={sendPasswordResetEmail}
			{...props}
		>
			<p>
				Enter the email associated with your account below. We'll send you a
				link to reset your password.
			</p>
			<TextInput
				placeholder="Email"
				type="email"
				value={email}
				onInput={(e) => setEmail(e.currentTarget.value)}
			/>
			<p className={styles.error}>
				{error ? (
					<>
						<AlertIcon />
						{error}
					</>
				) : (
					<>&nbsp;</>
				)}
			</p>
			<button type="submit" disabled={!isSubmitting && isDisabled}>
				{isSubmitting ? (
					<SpinnerIcon />
				) : isDisabled ? (
					`Send again in ${seconds}s`
				) : (
					'Send Link'
				)}
			</button>
			<button type="button" onClick={() => setShowResetPassword(false)}>
				Go back
			</button>
		</form>
	);
};
