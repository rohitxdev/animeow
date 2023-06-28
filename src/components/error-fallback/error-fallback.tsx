import styles from './error-fallback.module.scss';

export const ErrorFallback = ({ error }: { error: Error | string }) => {
	return (
		<div className={styles.errorPage}>
			<h1>Something went wrong!</h1>
			<p>Error: {error instanceof Error ? error.message : error}</p>
		</div>
	);
};
