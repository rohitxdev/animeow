export const getFormData = (e: React.FormEvent<HTMLFormElement>) => {
	const obj = Object.fromEntries(new FormData(e.currentTarget).entries());
	const newObj: Record<keyof typeof obj, string> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			newObj[key] = obj[key].toString();
		}
	}
	return newObj;
};
