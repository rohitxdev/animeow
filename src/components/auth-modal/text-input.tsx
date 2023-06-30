import { ReactComponent as EyeOffIcon } from '@assets/icons/eye-off.svg';
import { ReactComponent as EyeOnIcon } from '@assets/icons/eye-on.svg';
import { InputHTMLAttributes, useState } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

import styles from './auth-modal.module.scss';

export const TextInput = ({ className, type, ...props }: InputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className={styles.textInput}>
			{type === 'password' ? (
				<>
					<input
						type={showPassword ? 'text' : 'password'}
						className={className}
						{...props}
					/>
					<button
						type="button"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						onClick={() => setShowPassword((state) => !state)}
					>
						{showPassword ? (
							<EyeOnIcon fill="white" />
						) : (
							<EyeOffIcon fill="var(--grey-200)" />
						)}
					</button>
				</>
			) : (
				<input type={type} className={className} {...props} />
			)}
		</div>
	);
};
