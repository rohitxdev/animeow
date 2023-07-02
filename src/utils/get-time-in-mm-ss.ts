export const getTimeInMMSS = (timeInSeconds: number) => {
	const seconds = Math.floor(timeInSeconds % 60);
	const minutes = Math.floor(timeInSeconds - seconds) / 60;
	return `${minutes < 10 ? '0' + minutes : minutes}:${
		seconds < 10 ? '0' + seconds : seconds
	}`;
};
