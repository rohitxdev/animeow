import { ComponentProps } from 'react';

import styles from './toggle-switch.module.scss';

type ToggleSwitchProps = Omit<
	ComponentProps<'input'>,
	'type' | 'style' | 'className'
>;

export const ToggleSwitch = ({ ...props }: ToggleSwitchProps) => {
	return <input type="checkbox" className={styles.toggleSwitch} {...props} />;
};
