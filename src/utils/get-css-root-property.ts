export const getCSSRootProperty = (property: string) => {
	const val = window
		.getComputedStyle(document.body)
		.getPropertyValue(property)
		.replaceAll('"', '');

	return val ?? null;
};
