import { Theme, User } from '@types';
import {
	createContext,
	ReactNode,
	Reducer,
	useEffect,
	useReducer,
} from 'react';

interface AppState {
	user: Partial<User>;
}

type AppAction = { type: 'UPDATE_USER_DATA'; payload: User };

interface AppContext {
	appState: AppState;
	appDispatch: React.Dispatch<AppAction>;
}

interface AppContextProviderProps {
	children: ReactNode;
}

export const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
	const reducer: Reducer<AppState, AppAction> = (state, action) => {
		switch (action.type) {
			case 'UPDATE_USER_DATA':
				return { ...state, user: action.payload };

			default:
				return state;
		}
	};

	const [appState, appDispatch] = useReducer(reducer, {
		user: {},
	});

	useEffect(() => {
		const onResize = () => {
			const root = document.getElementById('root');
			if (root) {
				root.style.setProperty('--vh', `${window.innerHeight}px`);
				root.style.setProperty('--vw', `${window.innerWidth}px`);
			}
		};

		onResize();
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	return (
		<AppContext.Provider value={{ appState, appDispatch }}>
			{children}
		</AppContext.Provider>
	);
};
