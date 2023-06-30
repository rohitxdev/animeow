import { AuthContext } from '@contexts';
import { useContext } from 'react';

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('Auth context is null');
	}
	return context;
};
