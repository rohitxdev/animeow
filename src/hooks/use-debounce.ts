import { useEffect, useState } from 'react';

export const useDebounce = <T>({
	value,
	delayInMs,
}: {
	value: T;
	delayInMs: number;
}) => {
	const [debouncedValue, setDebounceValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceValue(value);
		}, delayInMs);
		return () => {
			clearTimeout(timer);
		};
	}, [value, delayInMs]);

	return debouncedValue;
};
