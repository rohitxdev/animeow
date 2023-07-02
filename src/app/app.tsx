import './globals.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';

import { ReactComponent as CrossIcon } from '@assets/icons/cross.svg';
import { AuthModal, ErrorFallback } from '@components';
import { AuthContextProvider } from '@contexts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { SkeletonTheme } from 'react-loading-skeleton';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

import { Router } from './router';
import { registerServiceWorker } from './service-worker';

registerServiceWorker();

const queryClient = new QueryClient();

export const App = () => {
	return (
		<StrictMode>
			<ErrorBoundary fallbackRender={ErrorFallback}>
				<HelmetProvider>
					<QueryClientProvider client={queryClient}>
						<AuthContextProvider>
							<SkeletonTheme
								baseColor="var(--grey-300)"
								highlightColor="var(--grey-200)"
							>
								<Router />
								<AuthModal />
								<ToastContainer
									pauseOnHover={false}
									position="bottom-right"
									toastClassName={(val) =>
										[val?.defaultClassName, val?.type, 'toast'].join(' ')
									}
									theme="dark"
									closeButton={() => (
										<CrossIcon
											style={{
												height: '0.875rem',
												width: '0.875rem',
											}}
										/>
									)}
									draggable
									hideProgressBar
								/>
							</SkeletonTheme>
						</AuthContextProvider>
					</QueryClientProvider>
				</HelmetProvider>
			</ErrorBoundary>
		</StrictMode>
	);
};

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
