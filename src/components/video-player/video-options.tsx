import { ReactComponent as CheckIcon } from '@assets/icons/check.svg';
import { ComponentProps, memo, ReactNode, useEffect, useState } from 'react';

import styles from './video-player.module.scss';
interface VideoOptionsProps extends Partial<ComponentProps<'div'>> {
	show?: boolean;
	icon: ReactNode;
	defaultOption: number;
	options: string[];
	onSelectOption: (selectedOption: string) => void;
}

export const VideoOptions = memo(
	({
		show,
		icon,
		defaultOption,
		options,
		onSelectOption,
		...props
	}: VideoOptionsProps) => {
		const [showOptions, setShowOptions] = useState(show);

		const [selectedOption, setSelectedOption] = useState<string>(
			options[defaultOption],
		);

		useEffect(() => {
			setShowOptions(false);
		}, [show]);

		return (
			<div
				{...props}
				className={[
					styles.videoOptions,
					showOptions ? styles.show : styles.hide,
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
									setSelectedOption(val);
									setShowOptions(false);
									onSelectOption(val);
								}}
								key={val + i}
								className={[
									styles.optionBtn,
									selectedOption === val && styles.selected,
								].join(' ')}
							>
								<CheckIcon />
								<span>{val}</span>
								<CheckIcon />
							</button>
						))}
					</div>
				</div>
			</div>
		);
	},
);
