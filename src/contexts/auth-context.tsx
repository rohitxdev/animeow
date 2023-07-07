import { authRoles } from '@constants';
import { authRoleSchema } from '@schemas';
import { AuthRole, User } from '@types';
import { api, axiosInstance } from '@utils';
import { AxiosError } from 'axios';
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface AuthContext {
	signUp: (info: {
		email: string;
		password: string;
		username?: string;
	}) => Promise<void>;
	logIn: (info: { email: string; password: string }) => Promise<void>;
	logOut: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	isLoggedIn: boolean;
	user: Partial<User> | null;
	hasAccess: (requiredAuthRole?: AuthRole) => boolean;
	showAuthModal: boolean;
	setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthContextProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
	const refetchIntervalInMs = 1000 * 60 * 10;
	const timerId = useRef<number | null>(null);
	const interceptorId = useRef<number | null>(null);
	const parsed = authRoleSchema.safeParse(localStorage.getItem('role'));
	const [authRole, setAuthRole] = useState<AuthRole | null>(
		parsed.success ? parsed.data : null,
	);
	const [isLoggedIn, setIsLoggedIn] = useState(parsed.success);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [user, setUser] = useState<Partial<User> | null>(null);

	const hasAccess = (requiredAuthRole?: AuthRole) => {
		if (!requiredAuthRole) {
			return true;
		}
		if (!authRole) {
			return false;
		}
		const rolesArray = Object.values(authRoles);
		return rolesArray.indexOf(authRole) >= rolesArray.indexOf(requiredAuthRole);
	};

	const clearAuthData = () => {
		setAccessToken(null);
		setAuthRole(null);
		setIsLoggedIn(false);
	};

	const setAuthData = ({
		accessToken,
		role,
	}: {
		accessToken: string;
		role: AuthRole;
	}) => {
		setAccessToken(accessToken);
		setAuthRole(role);
		setIsLoggedIn(true);
	};

	const signUp = async (info: {
		email: string;
		password: string;
		username?: string;
	}) => {
		const data = await api.signUp(info);
		setAuthData(data);
		toast.success('Signed up successfully');
	};

	const logIn = async (info: { email: string; password: string }) => {
		const data = await api.logIn(info);
		setAuthData(data);
		toast.success('Logged in successfully');
	};

	const logOut = async () => {
		try {
			await api.logOut();
			clearAuthData();
			toast.success('Logged out successfully');
		} catch {
			toast.error('Could not log out');
		}
	};

	const refreshAccessToken = async () => {
		try {
			const data = await api.refreshAccessToken();
			setAuthData(data);
		} catch (err) {
			if (timerId.current) {
				window.clearInterval(timerId.current);
				return clearAuthData();
			}
		}
	};

	const updateAccessTokenInInterceptor = (accessToken: string | null) => {
		if (interceptorId.current) {
			axiosInstance.interceptors.request.eject(interceptorId.current);
		}
		interceptorId.current = axiosInstance.interceptors.request.use((config) => {
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		});
	};

	const getUser = async () => {
		const data = await api.getMyProfile();
		setUser(data);
	};

	useEffect(() => {
		if (authRole) {
			localStorage.setItem('role', authRole);
		} else {
			localStorage.removeItem('role');
		}
	}, [authRole]);

	useEffect(() => {
		if (authRole && !accessToken) {
			refreshAccessToken().then(() => {
				if (timerId.current) {
					window.clearInterval(timerId.current);
				}
				timerId.current = window.setInterval(() => {
					refreshAccessToken();
				}, refetchIntervalInMs);
			});
		}
		updateAccessTokenInInterceptor(accessToken);
		if (accessToken) {
			getUser();
		}
	}, [accessToken]);

	return (
		<AuthContext.Provider
			value={{
				signUp,
				logIn,
				logOut,
				refreshAccessToken,
				isLoggedIn,
				hasAccess,
				user,
				showAuthModal,
				setShowAuthModal,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
