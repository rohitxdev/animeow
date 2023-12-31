import { env } from '@constants';
import { useAuthContext } from '@hooks';
import { ReactComponent as AlertIcon } from '@icons/alert.svg';
import { ReactComponent as GoogleLogo } from '@icons/logo-google.svg';
import { ReactComponent as SpinnerIcon } from '@icons/spinner.svg';
import { loginFormSchema, signUpFormSchema } from '@schemas';
import { getFormData } from '@utils';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { Modal } from '../modal/modal';
import styles from './auth-modal.module.scss';
import { ForgotPassword } from './forgot-password';
import { TextInput } from './text-input';

export const AuthModal = () => {
	const { showAuthModal, setShowAuthModal, isLoggedIn, logIn, signUp } =
		useAuthContext();
	const [type, setType] = useState<'log-in' | 'sign-up'>('log-in');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [showResetPassword, setShowResetPassword] = useState(false);
	const passwordRegex =
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})\S+$/;

	const toggleType = () => {
		setType((val) => (val === 'log-in' ? 'sign-up' : 'log-in'));
	};

	const resetState = () => {
		setType('log-in');
		setEmail('');
		setPassword('');
		setConfirmPassword('');
		setError('');
	};

	const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
		try {
			e.preventDefault();
			if (type === 'log-in') {
				const { email, password } = loginFormSchema.parse(getFormData(e));
				setIsSubmitting(true);
				await logIn({ email, password });
			} else {
				const { email, password, confirmPassword } = signUpFormSchema.parse(
					getFormData(e),
				);
				if (!passwordRegex.test(password)) {
					throw 'Password must contain 8+ characters, 1 uppercase, 1 lowercase, 1 special character';
				}
				if (password !== confirmPassword) {
					throw 'Passwords do not match';
				}
				setIsSubmitting(true);
				await signUp({ email, password });
			}
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
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		setError('');
	}, [email, password, confirmPassword]);

	useEffect(() => {
		resetState();
		setShowAuthModal(false);
	}, [isLoggedIn]);

	useEffect(() => {
		setIsSubmitting(false);
	}, [type]);

	useEffect(() => {
		if (!showAuthModal) {
			setTimeout(() => setShowResetPassword(false), 200);
		}
	}, [showAuthModal]);

	return (
		<Modal showModal={showAuthModal} setShowModal={setShowAuthModal} closeable>
			<div className={styles.auth}>
				{showResetPassword ? (
					<ForgotPassword
						defaultEmail={email}
						setShowResetPassword={setShowResetPassword}
					/>
				) : (
					<>
						<form onSubmit={submitHandler}>
							<p>{type === 'log-in' ? 'Welcome back' : 'Create an account'}</p>
							<TextInput
								type="email"
								name="email"
								placeholder="Email"
								aria-label="Email"
								value={email}
								onInput={(e) => setEmail(e.currentTarget.value)}
								required
							/>
							<TextInput
								type="password"
								name="password"
								placeholder="Password"
								aria-label="Password"
								value={password}
								onInput={(e) => setPassword(e.currentTarget.value)}
								required
							/>
							{type === 'sign-up' && (
								<TextInput
									type="password"
									name="confirmPassword"
									placeholder="Confirm password"
									aria-label="Confirm password"
									value={confirmPassword}
									onInput={(e) => setConfirmPassword(e.currentTarget.value)}
									required
								/>
							)}
							{type === 'log-in' && (
								<button
									className={styles.forgotPassword}
									type="button"
									onClick={() => setShowResetPassword(true)}
								>
									Forgot password?
								</button>
							)}
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
							<div>
								<button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<SpinnerIcon />
									) : type === 'log-in' ? (
										'Log In'
									) : (
										'Sign Up'
									)}
								</button>
								<p className={styles.toggleType}>
									{type === 'log-in'
										? "Don't have an account?"
										: 'Already have an account?'}
									<button type="button" onClick={toggleType}>
										{type === 'log-in' ? 'Sign up' : 'Log in'}
									</button>
								</p>
							</div>
						</form>

						<div className={styles.hLineContainer}>
							<span className={styles.hLine}></span>
							<span>OR</span>
							<span className={styles.hLine}></span>
						</div>
						<a
							className={styles.googleBtn}
							href={`${
								import.meta.env.MODE === 'production'
									? env.API_URL
									: env.DEV_API_URL
							}/auth/oauth2/google`}
						>
							<GoogleLogo /> Log in with Google
						</a>
					</>
				)}
			</div>
		</Modal>
	);
};
