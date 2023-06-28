import { ReactComponent as GoogleLogo } from '@assets/icons/logo-google.svg';
import { useAppContext, useAuthContext } from '@hooks';
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

import { User } from '../../types/app.types';
import { Modal } from '../modal/modal';
import styles from './auth-modal.module.scss';
import { Login } from './login';
import { SignUp } from './sign-up';

const firebaseConfig = {
	apiKey: 'AIzaSyB0HaSjAcg5XlNczqg4ewBr-gOW2gq883g',
	authDomain: 'animeow-db6c3.firebaseapp.com',
	projectId: 'animeow-db6c3',
	storageBucket: 'animeow-db6c3.appspot.com',
	messagingSenderId: '1093002153290',
	appId: '1:1093002153290:web:9f72d61e5d73e524c9c5b3',
	measurementId: 'G-D6NPNVBF88',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const AuthModal = () => {
	const [type, setType] = useState<'log-in' | 'sign-up'>('log-in');
	const [pfp, setPfp] = useState<string | null>(null);
	const [user, setUser] = useState<any>();
	const { showAuthModal, setShowAuthModal, isLoggedIn } = useAuthContext();
	const { appState, appDispatch } = useAppContext();

	useEffect(() => {
		if (pfp) {
			appDispatch({
				type: 'UPDATE_USER_DATA',
				payload: { ...appState.user, image_url: pfp } as User,
			});
		}
	}, [pfp]);

	const logInWithGoogle = () => {
		signInWithPopup(auth, googleProvider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				if (credential) {
					setUser(result.user);
					setPfp(result.user.photoURL);
				}
				// ...
			})
			.catch((error) => {
				console.log(error);

				// Handle Errors here.
				// const errorCode = error.code;
				// const errorMessage = error.message;
				// // The email of the user's account used.
				// const email = error.customData.email;
				// // The AuthCredential type that was used.
				// const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	};

	useEffect(() => {
		if (user?.photoURL) {
			setPfp(user.photoURL);
		}
	}, [user]);

	useEffect(() => {
		if (isLoggedIn) {
			setShowAuthModal(false);
		}
	}, [isLoggedIn]);

	return (
		<Modal showModal={showAuthModal} setShowModal={setShowAuthModal} closeable>
			<div className={styles.auth}>
				{type === 'log-in' ? <Login /> : <SignUp />}
				<div className={styles.hLineContainer}>
					<span className={styles.hLine}></span>
					<span>or</span>
					<span className={styles.hLine}></span>
				</div>
				<button className={styles.googleBtn} onClick={logInWithGoogle}>
					<GoogleLogo /> Log in with Google
				</button>
				{/* <button
					style={{ margin: '1rem', padding: '0.5rem' }}
					onClick={() => signOut(auth)}
				>
					Log out
				</button> */}
			</div>
		</Modal>
	);
};
