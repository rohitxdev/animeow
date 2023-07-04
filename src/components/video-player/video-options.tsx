import { ComponentProps, memo, ReactNode, useEffect, useState } from 'react';

import styles from './video-player.module.scss';

interface VideoOptionsProps extends Partial<ComponentProps<'div'>> {
	show?: boolean;
	icon: ReactNode;
	options: string[];
	onSelectOption: (selectedOption: string) => void;
}

export const VideoOptions = memo(
	({
		show,
		icon,
		options,
		onSelectOption,
		className,
		...props
	}: VideoOptionsProps) => {
		const [showOptions, setShowOptions] = useState(show);

		useEffect(() => {
			if (!show) {
				setShowOptions(false);
			}
		}, [show]);

		return (
			<div
				{...props}
				className={[
					styles.videoOptions,
					showOptions ? styles.show : styles.hide,
					className,
				].join(' ')}
			>
				<button
					className={styles.selectBtn}
					onClick={() => setShowOptions((val) => !val)}
				>
					{icon}
				</button>
				<div className={styles.selectOptions}>
					<div>
						{options.map((val, i) => (
							<button
								onClick={() => {
									onSelectOption(val), setShowOptions(false);
								}}
								key={val + i}
							>
								{val}
							</button>
						))}
					</div>
				</div>
			</div>
		);
	},
);
