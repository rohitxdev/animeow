import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import styles from './modal.module.scss';

export const Modal = ({
	children,
	showModal,
	setShowModal,
	closeable,
}: {
	children: ReactNode;
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	closeable?: boolean;
}) => {
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		let timerId: number | null = null;
		if (showModal) {
			dialogRef?.current?.showModal();
		} else {
			timerId = setTimeout(() => {
				dialogRef?.current?.close();
			}, 200);
		}

		return () => {
			if (timerId) {
				clearTimeout(timerId);
			}
		};
	}, [showModal]);

	return createPortal(
		<dialog
			className={[
				styles.modal,
				showModal ? styles.fadeIn : styles.fadeOut,
			].join(' ')}
			ref={dialogRef}
			onClick={(e) => {
				if (closeable) {
					setShowModal(false);
				}
			}}
			onCancel={(e) => {
				e.preventDefault();
				if (closeable) {
					setShowModal(false);
				}
			}}
		>
			<div onClick={(e) => e.stopPropagation()}>{children}</div>
		</dialog>,
		document.getElementById('root') as HTMLDivElement,
	);
};
