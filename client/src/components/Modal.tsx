import styles from './Modal.module.css';
import type { ModalParameters } from '../types/types';
import Button from './Button';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeModal } from './modalSlice';

interface ModalProps {
  modalParameters: ModalParameters,
}

function Modal ({ modalParameters }: ModalProps) {
  const dispatch = useAppDispatch();
  const currentModalShownName = useAppSelector((state) => state.modal.modalName);

  return currentModalShownName === modalParameters.name && (
    <div className={styles.screenContainer} onClick={(event) => {event.stopPropagation()}}>
      <div className={styles.container}>
        <div className={styles.closeIcon} onClick={() => {dispatch(closeModal())}}>+</div>
        <h2 className={styles.heading}>{modalParameters.heading}</h2>
        <p className={styles.message}>{modalParameters.message}</p>
        <div className={styles.buttonsContainer}>
          {modalParameters.options.map((buttonParameters, index) => {
            return (
              <div className={styles.buttonContainer} key={index}>
                <Button buttonParameters={buttonParameters} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Modal;