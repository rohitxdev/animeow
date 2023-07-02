import { ComponentProps, useEffect, useRef, useState } from 'react';

import styles from './toggle-switch.module.scss';

interface ToggleSwitchProps
	extends Omit<ComponentProps<'button'>, 'style' | 'className'> {
	initialValue?: boolean;
}

export const ToggleSwitch = ({ initialValue, ...props }: ToggleSwitchProps) => {
	const [isEnabled, setIsEnabled] = useState(initialValue ?? false);
	const toggleSwitchRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		setIsEnabled(initialValue ?? false);
	}, [initialValue]);

	useEffect(() => {
		const onToggle = () => setIsEnabled((val) => !val);

		if (toggleSwitchRef.current) {
			toggleSwitchRef.current.addEventListener('click', onToggle);
		}

		return () => {
			if (toggleSwitchRef.current) {
				toggleSwitchRef.current.removeEventListener('click', onToggle);
			}
		};
	}, [isEnabled]);

	return (
		<button
			{...props}
			className={[styles.toggleSwitch, isEnabled ? styles.on : styles.off].join(
				' ',
			)}
			ref={toggleSwitchRef}
		></button>
	);
};
