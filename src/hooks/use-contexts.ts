import { AppContext, AuthContext } from '@contexts';
import { useContext } from 'react';

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('App context is null');
	}
	return context;
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('Auth context is null');
	}
	return context;
};
